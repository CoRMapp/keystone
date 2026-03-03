const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const UrlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'UrlFieldTestObject'));

module.exports = function UrlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new UrlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new UrlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
