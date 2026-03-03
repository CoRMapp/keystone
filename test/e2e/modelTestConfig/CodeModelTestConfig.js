const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const CodeFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CodeFieldTestObject'));
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function CodeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CodeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CodeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
