'use strict';

var uniqueValidator = require('../mongooseUniqueValidator');

var MESSAGE_FIELDS = ['PATH', 'VALUE', 'TYPE'];
var FIELD_ALIASES = {
	PATH: 'PATH',
	VALUE: 'VALUE',
	TYPE: 'TYPE',
	KIND: 'TYPE',
};

function normalizeOptions(options) {
	if (!options || options === true) {
		return options;
	}

	if (typeof options === 'string') {
		return { field: options };
	}

	return options;
}

function getMessageField(list) {
	var options = normalizeOptions(list.get('uniqueValidator'));

	if (!options || options === true) {
		return 'PATH';
	}

	var field = String(options.field || 'PATH').toUpperCase();
	var normalizedField = FIELD_ALIASES[field] || 'PATH';

	return MESSAGE_FIELDS.indexOf(normalizedField) === -1 ? 'PATH' : normalizedField;
}

module.exports = function () {
	var options = normalizeOptions(this.get('uniqueValidator'));

	if (!options) {
		return;
	}

	var pluginOptions = {};
	var messageField = getMessageField(this);

	if (options !== true && options.message) {
		pluginOptions.message = options.message;
	} else {
		pluginOptions.message = 'This {' + messageField + '} has already been taken';
	}

	if (options !== true && options.type) {
		pluginOptions.type = options.type;
	}

	this.schema.plugin(uniqueValidator, pluginOptions);
};
