var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var CodeFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CodeFieldTestObject'));
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function CodeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CodeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CodeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
