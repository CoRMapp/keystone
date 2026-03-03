const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const LocationFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'LocationFieldTestObject'));

module.exports = function LocationModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new LocationFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new LocationFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
