var fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
var path = require('path');
var TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
var RelationshipFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'RelationshipFieldTestObject'));

module.exports = function RelationshipModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new RelationshipFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
