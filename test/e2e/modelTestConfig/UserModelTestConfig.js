const fieldTestObjectsPath = require('keystone-nightwatch-e2e').fieldTestObjectsPath;
const path = require('path');
const NameFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'NameFieldTestObject'));
const EmailFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'EmailFieldTestObject'));
const PasswordFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'PasswordFieldTestObject'));
const TextFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'TextFieldTestObject'));
const BooleanFieldTestObject = require(path.resolve(fieldTestObjectsPath, 'BooleanFieldTestObject'));

module.exports = function UserModelTestConfig (config) {
	return {
		name: new NameFieldTestObject(Object.assign({}, config, {fieldName: 'name'})),
		email: new EmailFieldTestObject(Object.assign({}, config, {fieldName: 'email'})),
		password: new PasswordFieldTestObject(Object.assign({}, config, {fieldName: 'password'})),
		resetPasswordKey: new TextFieldTestObject(Object.assign({}, config, {fieldName: 'resetPasswordKey'})),
		isAdmin: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'isAdmin'})),
		isMember: new BooleanFieldTestObject(Object.assign({}, config, {fieldName: 'isMember'})),
	};
};
