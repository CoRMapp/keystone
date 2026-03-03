const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const NameFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject'));
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function NameModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
