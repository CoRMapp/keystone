const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const Text = new keystone.List('Text', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Text.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Text,
		initial: true,
	},
	fieldB: {
		type: Types.Text,
	},
});

Text.defaultColumns = 'name, fieldA, fieldB';
Text.register();

module.exports = Text;
