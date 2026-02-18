var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var FileFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'FileFieldTestObject'));

module.exports = function FileModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new FileFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new FileFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
