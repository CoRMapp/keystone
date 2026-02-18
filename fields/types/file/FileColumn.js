import React from 'react';

import ItemsTableCell from '../../components/ItemsTableCell';
import ItemsTableValue from '../../components/ItemsTableValue';

const LocalFileColumn = React.createClass({
	renderValue: function () {
		const value = this.props.data.fields[this.props.col.path];
		if (!value || !value.filename) return;
		return value.filename;
	},
	render: function () {
		const value = this.props.data.fields[this.props.col.path];
		const href = value && value.url ? value.url : null;
		const label = value && value.filename ? value.filename : null;
		return (
			<ItemsTableCell href={href} padded interior field={this.props.col.type}>
				<ItemsTableValue>{label}</ItemsTableValue>
			</ItemsTableCell>
		);
	},
});

module.exports = LocalFileColumn;
