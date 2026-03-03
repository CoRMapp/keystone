const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const SelectFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'SelectFieldTestObject'));
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function SelectModelTestConfig(config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new SelectFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new SelectFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
