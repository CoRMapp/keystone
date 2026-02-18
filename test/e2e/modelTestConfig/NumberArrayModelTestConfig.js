var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var NumberArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberArrayFieldTestObject'));

module.exports = function NumberArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
