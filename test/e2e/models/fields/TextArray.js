const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const TextArray = new keystone.List('TextArray', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

TextArray.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.TextArray,
	},
	fieldB: {
		type: Types.TextArray,
	},
});

TextArray.defaultColumns = 'name, fieldA, fieldB';
TextArray.register();

module.exports = TextArray;
