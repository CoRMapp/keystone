const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const TextareaFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextareaFieldTestObject'));

module.exports = function TextareaModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextareaFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextareaFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
