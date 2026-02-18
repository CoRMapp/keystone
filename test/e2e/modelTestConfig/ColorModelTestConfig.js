var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var ColorFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'ColorFieldTestObject'));

module.exports = function ColorModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new ColorFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new ColorFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
