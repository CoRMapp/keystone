var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var EmailFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject'));

module.exports = function EmailModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new EmailFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new EmailFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
