const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function TextModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
