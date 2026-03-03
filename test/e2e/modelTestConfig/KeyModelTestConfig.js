const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const KeyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'KeyFieldTestObject'));

module.exports = function KeyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new KeyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
