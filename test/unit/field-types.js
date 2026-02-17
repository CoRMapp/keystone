const fs = require('fs');
const keystone = require('../../index.js');
const path = require('path');

keystone.init();

const typesLoc = path.resolve('fields/types');
const types = fs.readdirSync(typesLoc);

types.forEach(function (name) {
	const typeTestPath = typesLoc + '/' + name + '/test/type.js';
	if (!fs.existsSync(typeTestPath)) return;

	// nocreate option prevents warnings for required / not initial fields
	const List = keystone.List(name + 'Test', { nocreate: true });
	const test = require(typeTestPath);

	test.initList(List);
	List.register();
	describe('FieldType: ' + name.substr(0, 1).toUpperCase() + name.substr(1), function () {
		before(async function () {
			await List.model.deleteMany({});
		});
		test.testFieldType(List);
	});
});
