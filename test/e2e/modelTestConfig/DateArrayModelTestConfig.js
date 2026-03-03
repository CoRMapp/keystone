const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const DateArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateArrayFieldTestObject'));

module.exports = function DateArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DateArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
