var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var CloudinaryImageFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CloudinaryImageFieldTestObject'));
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function CloudinaryImageModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
