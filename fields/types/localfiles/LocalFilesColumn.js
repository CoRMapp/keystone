const React = require('react');

const LocalFilesColumn = React.createClass({
	renderValue: function () {
		const value = this.props.data.fields[this.props.col.path];
		if (value.length === 0) return '';
		const fileOrFiles = (value.length > 1) ? 'Files' : 'File';
		return `${value.length} ${fileOrFiles}`;
	},
	render: function () {
		return (
			<td className="ItemList__col">
				<div className="ItemList__value ItemList__value--local-files">{this.renderValue()}</div>
			</td>
		);
	},
});

module.exports = LocalFilesColumn;
