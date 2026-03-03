const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const GeoPointFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'GeoPointFieldTestObject'));

module.exports = function GeoPointModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
