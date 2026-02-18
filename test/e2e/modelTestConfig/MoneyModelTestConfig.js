var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var MoneyFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'MoneyFieldTestObject'));

module.exports = function MoneyModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new MoneyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new MoneyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
		fieldC: new MoneyFieldTestObject(Object.assign({}, config, {fieldName: 'fieldC'})),
		fieldD: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'fieldD'})),
	};
};
