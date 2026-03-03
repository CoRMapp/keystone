/**
Deprecated.

Using this field will now throw an error, and this code will be removed soon.

See https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide
*/

/* eslint-disable */

/**
 * localfile FieldType Constructor
 * @extends Field
 * @api public
 */
function localfile (list, path, options) {
	throw new Error('The LocalFile field type has been removed. Please use File instead.'
		+ '\n\nSee https://github.com/keystonejs/keystone/wiki/File-Fields-Upgrade-Guide\n');

	/*

	grappling.mixin(this).allowHooks('move');
	this._underscoreMethods = ['format', 'uploadFile'];
	this._fixedSize = 'full';
	this.autoCleanup = options.autoCleanup || false;

	if (options.overwrite !== false) {
		options.overwrite = true;
	}

	localfile.super_.call(this, list, path, options);

	// validate destination dir
	if (!options.dest) {
		throw new Error('Invalid Configuration\n\n'
			+ 'localfile fields (' + list.key + '.' + path + ') require the "dest" option to be set.');
	}
	// Allow hook into before and after
	if (options.pre && options.pre.move) {
		this.pre('move', options.pre.move);
	}

	if (options.post && options.post.move) {
		this.post('move', options.post.move);
	}

	*/
}
localfile.properName = 'LocalFile';
// util.inherits(localfile, FieldType);

localfile.prototype.addToSchema = function (schema) {
	const field = this;

	const paths = this.paths = {
		// fields
		filename: `${this.path}.filename`,
		originalname: `${this.path}.originalname`,
		path: `${this.path}.path`,
		size: `${this.path}.size`,
		filetype: `${this.path}.filetype`,
		// virtuals
		exists: `${this.path}.exists`,
		href: `${this.path}.href`,
		upload: `${this.path}_upload`,
		action: `${this.path}_action`,
	};

	const schemaPaths = this._path.addTo({}, {
		filename: String,
		originalname: String,
		path: String,
		size: Number,
		filetype: String,
	});

	schema.add(schemaPaths);

	// exists checks for a matching file at run-time
	const exists = (item) => {
		const filepath = item.get(paths.path);
		const filename = item.get(paths.filename);

		if (!filepath || !filename) {
			return false;
		}

		return fs.existsSync(path.join(filepath, filename));
	};

	// The .exists virtual indicates whether a file is stored
	schema.virtual(paths.exists).get(function () {
		return schemaMethods.exists.apply(this);
	});

	// The .href virtual returns the public path of the file
	schema.virtual(paths.href).get(function () {
		return field.href(this);
	});

	// reset clears the value of the field
	const reset = (item) => {
		item.set(field.path, {
			filename: '',
			path: '',
			size: 0,
			filetype: '',
		});
	};

	const schemaMethods = {
		exists: function () {
			return exists(this);
		},
		reset: function () {
			reset(this);
		},
		delete: function () {
			if (exists(this)) {
				fs.unlinkSync(path.join(this.get(paths.path), this.get(paths.filename)));
			}
			reset(this);
		},
	};

	_.forEach(schemaMethods, (fn, key) => {
		field.underscoreMethod(key, fn);
	});

	// expose a method on the field to call schema methods
	this.apply = function (item, method) {
		return schemaMethods[method].apply(item, Array.prototype.slice.call(arguments, 2));
	};

	this.bindUnderscoreMethods();
};

localfile.prototype.format = function (item) {
	if (!item.get(this.paths.filename)) return '';
	if (this.hasFormatter()) {
		const file = item.get(this.path);
		file.href = this.href(item);
		return this.options.format.call(this, item, file);
	}
	return this.href(item);
};

localfile.prototype.hasFormatter = function () {
	return typeof this.options.format === 'function';
};

localfile.prototype.href = function (item) {
	if (!item.get(this.paths.filename)) return '';
	const prefix = this.options.prefix ? this.options.prefix : item.get(this.paths.path);
	return `${prefix}/${item.get(this.paths.filename)}`;
};

localfile.prototype.isModified = function (item) {
	return item.isModified(this.paths.path);
};


function validateInput (value) {
	if (value === undefined) return true;
	if (typeof value === 'string') return true;
	if (typeof value === 'object' && value.path) return true;
	return false;
}

localfile.prototype.validateInput = function (data, callback) {
	const value = this.getValueFromData(data);
	utils.defer(callback, validateInput(value));
};

localfile.prototype.validateRequiredInput = function (item, data, callback) {
	const value = this.getValueFromData(data);
	const result = (value || item.get(this.path).path) ? true : false;
	utils.defer(callback, result);
};

localfile.prototype.inputIsValid = function (data) { // eslint-disable-line no-unused-vars
	return true;
};

localfile.prototype.updateItem = function (item, data, callback) { // eslint-disable-line no-unused-vars
	process.nextTick(callback);
};

localfile.prototype.uploadFile = function (item, file, update, callback) {
	const field = this;
	const prefix = field.options.datePrefix ? `${moment().format(field.options.datePrefix)}-` : '';
	let filename = prefix + file.name;
	const filetype = file.mimetype || file.type;

	if (field.options.allowedTypes && !_.includes(field.options.allowedTypes, filetype)) {
		return callback(new Error(`Unsupported File Type: ${filetype}`));
	}

	if (typeof update === 'function') {
		callback = update;
		update = false;
	}

	const doMove = (callback) => {
		if (typeof field.options.filename === 'function') {
			filename = field.options.filename(item, file);
		}

		fs.move(file.path, path.join(field.options.dest, filename), { clobber: field.options.overwrite }, (err) => {
			if (err) return callback(err);

			const fileData = {
				filename: filename,
				originalname: file.originalname,
				path: field.options.dest,
				size: file.size,
				filetype: filetype,
			};

			if (update) {
				item.set(field.path, fileData);
			}

			callback(null, fileData);
		});
	};

	field.callHook('pre:move', item, file, (err) => {
		if (err) return callback(err);
		doMove((err, fileData) => {
			if (err) return callback(err);
			field.callHook('post:move', [item, file, fileData], (err) => {
				if (err) return callback(err);
				callback(null, fileData);
			});
		});
	});
};

localfile.prototype.getRequestHandler = function (item, req, paths, callback) {
	const field = this;

	if (utils.isFunction(paths)) {
		callback = paths;
		paths = field.paths;
	} else if (!paths) {
		paths = field.paths;
	}

	callback = callback || function () {};

	return function () {
		if (req.body) {
			const action = req.body[paths.action];

			if (/^(delete|reset)$/.test(action)) {
				field.apply(item, action);
			}
		}

		if (req.files && req.files[paths.upload] && req.files[paths.upload].size) {
			return field.uploadFile(item, req.files[paths.upload], true, callback);
		}

		return callback();
	};
};

/* Export Field Type */
module.exports = localfile;
