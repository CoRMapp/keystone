import React from 'react';
import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';
import displayName from 'display-name';

const NameColumn = React.createClass({
	displayName: 'NameColumn',
	propTypes: {
		col: React.PropTypes.object,
		data: React.PropTypes.object,
		linkTo: React.PropTypes.string,
	},
	renderValue () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || (!value.first && !value.last)) return '(no name)';
		return displayName(value.first, value.last);
	},
	render () {
		return (
			<ItemsTableCell>
				<ItemsTableValue to={this.props.linkTo} padded interior field={this.props.col.type}>
					{this.renderValue()}
				</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = NameColumn;
