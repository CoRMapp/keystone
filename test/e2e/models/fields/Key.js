const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const Key = new keystone.List('Key', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Key.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Key,
		initial: true,
	},
	fieldB: {
		type: Types.Key,
	},
});

Key.defaultColumns = 'name, fieldA, fieldB';
Key.register();

module.exports = Key;
