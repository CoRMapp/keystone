var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var MarkdownFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'MarkdownFieldTestObject'));

module.exports = function MarkdownModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new MarkdownFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MarkdownFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MarkdownFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
