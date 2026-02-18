var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var PasswordFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject'));

module.exports = function PasswordModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
