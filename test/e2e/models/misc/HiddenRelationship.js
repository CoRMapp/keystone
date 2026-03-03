const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const HiddenRelationship = new keystone.List('HiddenRelationship');

HiddenRelationship.add({
	fieldA: { type: Types.Relationship, ref: 'User', initial: true, hidden: true },
});

HiddenRelationship.register();
module.exports = HiddenRelationship;
