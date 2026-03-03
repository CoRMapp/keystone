const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

// Model to demonstrate issue #2929

const DependsOn = new keystone.List('DependsOn', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

DependsOn.add({
	dependency: { type: Boolean, initial: true, default: false },
	dependent:
	{
		type: Types.Select,
		options: ['spam', 'ham'],
		initial: true,
		dependsOn: { dependency: false }
	}
});

DependsOn.register();

module.exports = DependsOn;
