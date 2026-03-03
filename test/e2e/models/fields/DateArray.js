const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const DateArray = new keystone.List('DateArray', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

DateArray.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.DateArray,
	},
	fieldB: {
		type: Types.DateArray,
	},
});

DateArray.defaultColumns = 'name, fieldA, fieldB';
DateArray.register();

module.exports = DateArray;
