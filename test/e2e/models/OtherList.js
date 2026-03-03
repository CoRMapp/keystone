const keystone = require('../../../index.js');
const Types = keystone.Field.Types;

const OtherList = new keystone.List('OtherList', {
	autokey: {path: 'key', from: 'name', unique: true},
	track: true
});

OtherList.add({
	name: {
		type: Types.Name, 
		required: true, 
		index: true
	},
});

OtherList.defaultColumns = 'name';
OtherList.register();

module.exports = OtherList;
