const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const InlineRelationship = new keystone.List('InlineRelationship');

InlineRelationship.add({
	fieldA: { type: Types.Relationship, ref: 'User', createInline: true },
});

InlineRelationship.register();
module.exports = InlineRelationship;
