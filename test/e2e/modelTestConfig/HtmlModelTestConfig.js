const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const HtmlFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'HtmlFieldTestObject'));

module.exports = function HtmlModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new HtmlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new HtmlFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
