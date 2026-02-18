var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var DateArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateArrayFieldTestObject'));

module.exports = function DateArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
