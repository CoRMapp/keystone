var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var UrlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'UrlFieldTestObject'));

module.exports = function UrlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new UrlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
