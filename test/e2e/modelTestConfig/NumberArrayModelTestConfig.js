const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const NumberArrayFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NumberArrayFieldTestObject'));

module.exports = function NumberArrayModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new NumberArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new NumberArrayFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
