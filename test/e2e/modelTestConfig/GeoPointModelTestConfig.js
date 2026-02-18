var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var GeoPointFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'GeoPointFieldTestObject'));

module.exports = function GeoPointModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new GeoPointFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new GeoPointFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
