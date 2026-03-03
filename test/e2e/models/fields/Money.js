const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const Money = new keystone.List('Money', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

Money.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.Money,
		initial: true,
	},
	fieldB: {
		type: Types.Money,
	},
});

Money.defaultColumns = 'name, fieldA, fieldB';
Money.register();

module.exports = Money;
