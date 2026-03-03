const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const DateFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DateFieldTestObject'));

module.exports = function DateModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DateFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DateFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
