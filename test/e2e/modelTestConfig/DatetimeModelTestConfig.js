const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const DatetimeFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'DatetimeFieldTestObject'));

module.exports = function DatetimeModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new DatetimeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new DatetimeFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
