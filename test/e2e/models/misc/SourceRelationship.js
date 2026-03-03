const keystone = require('../../../../index');
const Types = keystone.Field.Types;

const SourceRelationship = new keystone.List('SourceRelationship');

SourceRelationship.add({
	name: {
		type: String,
		initial: true,
	},
	fieldA: { 
		type: Types.Relationship, 
		ref: 'TargetRelationship'
	},
});

SourceRelationship.register();
SourceRelationship.defaultColumns = 'name, fieldA';

module.exports = SourceRelationship;
