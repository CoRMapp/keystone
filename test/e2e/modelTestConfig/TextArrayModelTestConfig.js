var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var TextArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextArrayFieldTestObject'));

module.exports = function TextArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
