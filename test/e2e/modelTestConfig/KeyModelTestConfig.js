var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var KeyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'KeyFieldTestObject'));

module.exports = function KeyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new KeyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new KeyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
