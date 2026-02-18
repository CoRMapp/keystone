var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var NameFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject'));
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function NameModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
