var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var NumberFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberFieldTestObject'));

module.exports = function NumberModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NumberFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
