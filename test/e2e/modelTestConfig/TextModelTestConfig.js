var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function TextModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
