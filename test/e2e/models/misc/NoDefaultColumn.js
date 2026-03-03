const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const NoDefaultColumn = new keystone.List('NoDefaultColumn', {
	track: true,
});

NoDefaultColumn.add({
	fieldA: {
		type: Types.Text,
		initial: true,
	},
	fieldB: {
		type: Types.Text,
	},
});

NoDefaultColumn.register();

module.exports = NoDefaultColumn;
