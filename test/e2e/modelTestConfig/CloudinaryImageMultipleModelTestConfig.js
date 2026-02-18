var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var CloudinaryImageMultipleFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'CloudinaryImageMultipleFieldTestObject'));
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));

module.exports = function CloudinaryImageMultipleModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new CloudinaryImageMultipleFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new CloudinaryImageMultipleFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
