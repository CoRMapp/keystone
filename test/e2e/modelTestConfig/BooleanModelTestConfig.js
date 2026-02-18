var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var BooleanFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject'));

module.exports = function BooleanModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
