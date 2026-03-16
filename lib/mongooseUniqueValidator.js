'use strict';

function isFunc(val) {
	return typeof val === 'function';
}

function each(collection, iteratee) {
	if (Array.isArray(collection)) {
		collection.forEach(iteratee);
		return;
	}

	if (collection && typeof collection === 'object') {
		Object.keys(collection).forEach(function (key) {
			iteratee(collection[key], key);
		});
	}
}

function get(obj, path) {
	if (!obj || !path) {
		return obj;
	}

	var parts = path.split('.');
	var current = obj;

	for (var i = 0; i < parts.length; i++) {
		if (current == null) {
			return current;
		}
		current = current[parts[i]];
	}

	return current;
}

function deepPath(schema, pathName) {
	var path;
	var paths = pathName.split('.');

	if (paths.length > 1) {
		pathName = paths.shift();
	}

	if (isFunc(schema.path)) {
		path = schema.path(pathName);
	}

	if (path && path.schema) {
		path = deepPath(path.schema, paths.join('.'));
	}

	return path;
}

function escapeRegExp(value) {
	return value.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function buildQuery(conditions, partialFilterExpression) {
	if (!partialFilterExpression) {
		return conditions;
	}

	return { $and: [conditions, partialFilterExpression] };
}

var plugin = function (schema, options) {
	options = options || {};
	var type = options.type || plugin.defaults.type || 'unique';
	var message = options.message || plugin.defaults.message || 'Error, expected `{PATH}` to be unique. Value: `{VALUE}`';
	var indexes = [[{ _id: 1 }, { unique: true }]].concat(schema.indexes());

	each(indexes, function (index) {
		var indexOptions = index[1];

		if (!indexOptions.unique) {
			return;
		}

		var paths = Object.keys(index[0]);
		each(paths, function (pathName) {
			var pathMessage = typeof indexOptions.unique === 'string' ? indexOptions.unique : message;
			var path = deepPath(schema, pathName) || schema.path(pathName);

			if (!path) {
				return;
			}

			path.validate(function () {
				return new Promise((resolve, reject) => {
					var isQuery = this.constructor.name === 'Query';
					var conditions = {};
					var model;

					if (isQuery) {
						each(paths, (name) => {
							var pathValue = get(this, '_update.' + name) || get(this, '_update.$set.' + name);

							if ((get(path, 'options.uniqueCaseInsensitive') || indexOptions.uniqueCaseInsensitive) && typeof pathValue === 'string') {
								pathValue = new RegExp('^' + escapeRegExp(pathValue) + '$', 'i');
							}

							conditions[name] = pathValue;
						});

						each(this._conditions, (value, key) => {
							conditions[key] = { $ne: value };
						});

						model = this.model;
					} else {
						var parentDoc = this.$parent();
						var isNew = parentDoc.isNew;

						if (!isNew && !parentDoc.isModified(pathName)) {
							resolve(true);
							return;
						}

						var isSubdocument = this._id !== parentDoc._id;
						var isNestedPath = isSubdocument ? false : pathName.split('.').length > 1;

						each(paths, (name) => {
							var pathValue;
							if (isSubdocument) {
								pathValue = get(this, name.split('.').pop());
							} else if (isNestedPath) {
								var keys = name.split('.');
								pathValue = get(this, keys[0]);
								for (var i = 1; i < keys.length; i++) {
									pathValue = get(pathValue, keys[i]);
								}
							} else {
								pathValue = get(this, name);
							}

							if ((get(path, 'options.uniqueCaseInsensitive') || indexOptions.uniqueCaseInsensitive) && typeof pathValue === 'string') {
								pathValue = new RegExp('^' + escapeRegExp(pathValue) + '$', 'i');
							}

							conditions[name] = pathValue;
						});

						if (!isNew && this._id) {
							conditions._id = { $ne: this._id };
						}

						if (isSubdocument) {
							model = this.ownerDocument().model(this.ownerDocument().constructor.modelName);
						} else if (isFunc(this.model)) {
							model = this.model(this.constructor.modelName);
						} else {
							model = this.constructor.model(this.constructor.modelName);
						}
					}

					if (model.baseModelName && (indexOptions.partialFilterExpression === null || indexOptions.partialFilterExpression === undefined)) {
						model = model.db.model(model.baseModelName);
					}

					model.find(buildQuery(conditions, indexOptions.partialFilterExpression)).countDocuments()
						.then((count) => {
							resolve(count === 0);
						})
						.catch((err) => {
							reject(err);
						});
				});
			}, pathMessage, type);
		});
	});
};

plugin.defaults = {};

module.exports = plugin;
