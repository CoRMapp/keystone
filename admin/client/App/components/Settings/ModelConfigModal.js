import React from 'react';
import xhr from 'xhr';
import { css } from 'glamor';
import { Button, Modal, Spinner } from '../../elemental';

const classes = {
	title: {
		fontSize: 22,
		fontWeight: 600,
		margin: '0 0 16px',
	},
	search: {
		border: '1px solid #d8d8d8',
		borderRadius: 6,
		fontSize: 14,
		marginBottom: 16,
		padding: '10px 12px',
		width: '100%',
	},
	section: {
		borderBottom: '1px solid #e8e8e8',
		padding: '14px 0',
	},
	sectionButton: {
		alignItems: 'center',
		background: 'transparent',
		border: 0,
		cursor: 'pointer',
		display: 'flex',
		padding: 0,
		textAlign: 'left',
		width: '100%',
	},
	sectionInfo: {
		display: 'flex',
		flex: 1,
		flexDirection: 'column',
		paddingRight: 16,
	},
	sectionLabel: {
		color: '#3b3b3b',
		fontSize: 16,
		fontWeight: 600,
	},
	sectionMeta: {
		color: '#8f8f8f',
		fontSize: 12,
		marginTop: 4,
	},
	sectionChevron: {
		color: '#8f8f8f',
		fontSize: 18,
		fontWeight: 600,
		lineHeight: 1,
		paddingLeft: 12,
	},
	configPanel: {
		background: '#fafafa',
		border: '1px solid #ececec',
		borderRadius: 6,
		marginTop: 12,
		padding: 12,
	},
	configRow: {
		alignItems: 'flex-start',
		display: 'flex',
		justifyContent: 'space-between',
	},
	configLabel: {
		display: 'flex',
		flexDirection: 'column',
		paddingRight: 16,
	},
	configName: {
		fontWeight: 600,
	},
	configNote: {
		color: '#8f8f8f',
		fontSize: 12,
		marginTop: 4,
	},
	list: {
		maxHeight: '60vh',
		overflowY: 'auto',
	},
	checkbox: {
		cursor: 'pointer',
		height: 18,
		width: 18,
	},
	error: {
		color: '#d64242',
		marginBottom: 12,
	},
	empty: {
		color: '#8f8f8f',
		padding: '12px 0',
	},
	footerButton: {
		display: 'inline-block',
	},
	footerButtonSpacer: {
		display: 'inline-block',
		marginLeft: 12,
	},
};

const request = (options) => new Promise((resolve, reject) => {
	xhr(options, (err, resp, body) => {
		if (err) return reject(err);
		try {
			resolve(typeof body === 'string' ? JSON.parse(body) : body);
		} catch (parseError) {
			reject(parseError);
		}
	});
});

var ModelConfigModal = React.createClass({
	displayName: 'ModelConfigModal',
	propTypes: {
		isOpen: React.PropTypes.bool,
		onClose: React.PropTypes.func.isRequired,
	},
	getInitialState () {
		return {
			expandedKeys: {},
			error: null,
			isLoading: false,
			searchTerm: '',
			searchValue: '',
			isSaving: false,
			models: [],
		};
	},
	componentWillUnmount () {
		if (this.searchDebounce) {
			clearTimeout(this.searchDebounce);
		}
	},
	componentDidUpdate (prevProps) {
		if (!prevProps.isOpen && this.props.isOpen) {
			this.loadModels();
		}
	},
	getCsrfHeaders () {
		return Object.assign({}, Keystone.csrf.header);
	},
	loadModels () {
		this.setState({
			error: null,
			isLoading: true,
		});

		request({
			url: `${Keystone.adminPath}/api/model-config`,
		})
			.then((body) => {
				this.setState({
					expandedKeys: (body.models || []).reduce((acc, model, index) => {
						acc[model.key] = index === 0;
						return acc;
					}, {}),
					error: null,
					isLoading: false,
					models: body.models || [],
				});
			})
			.catch((err) => {
				this.setState({
					error: err.message || 'Failed to load model config.',
					isLoading: false,
				});
			});
	},
	handleToggle (key) {
		this.setState({
			models: this.state.models.map((model) => {
				if (model.key !== key) return model;

				return Object.assign({}, model, {
					optimizedCounter: !model.optimizedCounter,
				});
			}),
		});
	},
	handleSectionToggle (key) {
		this.setState({
			expandedKeys: Object.assign({}, this.state.expandedKeys, {
				[key]: !this.state.expandedKeys[key],
			}),
		});
	},
	handleSearchChange (event) {
		const value = event.target.value;

		this.setState({
			searchValue: value,
		});

		if (this.searchDebounce) {
			clearTimeout(this.searchDebounce);
		}

		this.searchDebounce = setTimeout(() => {
			this.setState({
				searchTerm: value.trim().toLowerCase(),
			});
		}, 200);
	},
	getVisibleModels () {
		if (!this.state.searchTerm) {
			return this.state.models;
		}

		return this.state.models.filter((model) => {
			const label = (model.label || '').toLowerCase();
			const key = (model.key || '').toLowerCase();

			return label.indexOf(this.state.searchTerm) !== -1 || key.indexOf(this.state.searchTerm) !== -1;
		});
	},
	handleSave () {
		this.setState({
			error: null,
			isSaving: true,
		});

		request({
			method: 'POST',
			url: `${Keystone.adminPath}/api/model-config`,
			headers: this.getCsrfHeaders(),
			json: {
				models: this.state.models.map((model) => ({
					key: model.key,
					optimizedCounter: !!model.optimizedCounter,
				})),
			},
		})
			.then((body) => {
				this.setState({
					expandedKeys: (body.models || []).reduce((acc, model, index) => {
						acc[model.key] = this.state.expandedKeys[model.key] || index === 0;
						return acc;
					}, {}),
					error: null,
					isSaving: false,
					models: body.models || [],
				});
				this.props.onClose();
			})
			.catch((err) => {
				this.setState({
					error: err.message || 'Failed to save model config.',
					isSaving: false,
				});
			});
	},
	renderBody () {
		if (this.state.isLoading) {
			return <Spinner />;
		}

		const visibleModels = this.getVisibleModels();

		return (
			<div className={css(classes.list)}>
				<input
					className={css(classes.search)}
					onChange={this.handleSearchChange}
					placeholder="Search model"
					type="text"
					value={this.state.searchValue}
				/>
				{!visibleModels.length ? (
					<div className={css(classes.empty)}>No models found.</div>
				) : null}
				{visibleModels.map((model) => (
					<div className={css(classes.section)} key={model.key}>
						<button
							className={css(classes.sectionButton)}
							onClick={() => this.handleSectionToggle(model.key)}
							type="button"
						>
							<div className={css(classes.sectionInfo)}>
								<span className={css(classes.sectionLabel)}>{model.label}</span>
								<span className={css(classes.sectionMeta)}>{model.key}</span>
							</div>
							<span className={css(classes.sectionChevron)}>
								{this.state.expandedKeys[model.key] ? '−' : '+'}
							</span>
						</button>
						{this.state.expandedKeys[model.key] ? (
							<div className={css(classes.configPanel)}>
								<div className={css(classes.configRow)}>
									<div className={css(classes.configLabel)}>
										<span className={css(classes.configName)}>optimizedCounter</span>
										<span className={css(classes.configNote)}>
											Uses optimized query search for counters. Greater speed, but less accuracy
										</span>
									</div>
									<input
										checked={!!model.optimizedCounter}
										className={css(classes.checkbox)}
										onChange={() => this.handleToggle(model.key)}
										type="checkbox"
									/>
								</div>
							</div>
						) : null}
					</div>
				))}
			</div>
		);
	},
	render () {
		return (
			<Modal.Dialog backdropClosesModal isOpen={this.props.isOpen} onClose={this.props.onClose}>
				<Modal.Header showCloseButton text="Settings" />
				<Modal.Body>
					<h2 className={css(classes.title)}>Model Settings</h2>
					{this.state.error ? <div className={css(classes.error)}>{this.state.error}</div> : null}
					{this.renderBody()}
				</Modal.Body>
				<Modal.Footer>
					<span className={css(classes.footerButton)}>
						<Button color="cancel" disabled={this.state.isSaving} onClick={this.props.onClose}>
							Cancel
						</Button>
					</span>
					<span className={css(classes.footerButtonSpacer)}>
						<Button color="primary" disabled={this.state.isLoading || this.state.isSaving} onClick={this.handleSave}>
							{this.state.isSaving ? 'Saving...' : 'Save'}
						</Button>
					</span>
				</Modal.Footer>
			</Modal.Dialog>
		);
	},
});

module.exports = ModelConfigModal;
