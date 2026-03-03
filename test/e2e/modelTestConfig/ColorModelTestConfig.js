const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const ColorFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'ColorFieldTestObject'));

module.exports = function ColorModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new ColorFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
