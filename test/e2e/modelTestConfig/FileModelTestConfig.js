const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const FileFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'FileFieldTestObject'));

module.exports = function FileModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new FileFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
