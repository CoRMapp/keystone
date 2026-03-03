const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const CloudinaryImageFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CloudinaryImageFieldTestObject'));
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function CloudinaryImageModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
