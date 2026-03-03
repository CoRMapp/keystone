const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const RelationshipFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'RelationshipFieldTestObject'));

module.exports = function RelationshipModelTestConfig (config) {
	return {
		name: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		fieldA: new RelationshipFieldTestObject(Object.assign({}, config, {fieldName: 'fieldA'})),
		fieldB: new RelationshipFieldTestObject(Object.assign({}, config, {fieldName: 'fieldB'})),
	};
};
