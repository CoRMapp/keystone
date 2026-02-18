var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var DateFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateFieldTestObject'));

module.exports = function DateModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DateFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
