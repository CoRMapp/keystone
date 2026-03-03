const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const Datetime = new keystone.List('Datetime', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Datetime.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Datetime,
		initial: true,
	},
	fieldB: {
		type: Types.Datetime,
	},
});

Datetime.defaultColumns = 'name, fieldA, fieldB';
Datetime.register();

module.exports = Datetime;
