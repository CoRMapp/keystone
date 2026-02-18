const _ = require('lodash');
const async = require('async');
const FieldType = require('../Type');
const keystone = require('../../../');
const util = require('util');

const getEmptyValue = () => undefined;

const truthy = (value) => value;

/*
* Uses a before and after snapshot of the images array to find out what images are no longer included
*/
const cleanUp = (oldValues, newValues) => {
	const cloudinary = require('cloudinary');
	const oldvalIds = oldValues.map((val) => val.public_id);
	const newValIds = newValues.map((val) => val.public_id);

	const removedItemsCloudinaryIds = _.difference(oldvalIds, newValIds);

	// We never wait to return on the images being removed
	async.map(removedItemsCloudinaryIds, (id, next) => {
		cloudinary.uploader.destroy(id, (result) => {
			next();
		});
	});
};

/**
 * CloudinaryImages FieldType Constructor
 */
function cloudinaryimages (list, path, options) {
	this._underscoreMethods = ['format'];
	this._fixedSize = 'full';
	this._properties = ['select', 'selectPrefix', 'autoCleanup', 'publicID', 'folder', 'filenameAsPublicID'];

	cloudinaryimages.super_.call(this, list, path, options);

	// validate cloudinary config
	if (!keystone.get('cloudinary config')) {
		throw new Error('Invalid Configuration\n\n'
			+ `CloudinaryImages fields (${list.key}.${this.path}) require the "cloudinary config" option to be set.\n\n`
			+ 'See http://v4.keystonejs.com/docs/configuration/#services-cloudinary for more information.\n');
	}
}
cloudinaryimages.properName = 'CloudinaryImages';
util.inherits(cloudinaryimages, FieldType);

/**
 * Gets the folder for images in this field
 */
cloudinaryimages.prototype.getFolder = function (item) {
	let folder = null;

	if (keystone.get('cloudinary folders') || this.options.folder) {
		if (typeof this.options.folder === 'string') {
			folder = this.options.folder;
		} else if (typeof this.options.folder === 'function') {
			folder = this.options.folder(item)
		} else {
			folder = `${this.list.path}/${this.path}`;
		}
	}

	return folder;
};

/**
 * Registers the field on the List's Mongoose Schema.
 */
cloudinaryimages.prototype.addToSchema = function (schema) {

	const cloudinary = require('cloudinary');
	const mongoose = keystone.mongoose;
	const field = this;

	this.paths = {
		// virtuals
		folder: `${this.path}.folder`,
		// form paths
		upload: `${this.path}_upload`,
		uploads: `${this.path}_uploads`,
		action: `${this.path}_action`,
	};

	const ImageSchema = new mongoose.Schema({
		public_id: String,
		version: Number,
		signature: String,
		format: String,
		resource_type: String,
		url: String,
		width: Number,
		height: Number,
		secure_url: String,
	});

	// Generate cloudinary folder used to upload/select images
	const folder = (item) => { // eslint-disable-line no-unused-vars
		let folderValue = '';

		if (keystone.get('cloudinary folders')) {
			if (field.options.folder === 'string') {
				folderValue = field.options.folder;
			} else if (typeof this.options.folder === 'function') {
				folderValue = this.options.folder(item);
			} else {
				const folderList = keystone.get('cloudinary prefix') ? [keystone.get('cloudinary prefix')] : [];
				folderList.push(field.list.path);
				folderList.push(field.path);
				folderValue = folderList.join('/');
			}
		}

		return folderValue;
	};

	// The .folder virtual returns the cloudinary folder used to upload/select images
	schema.virtual(field.paths.folder).get(function () {
		return folder(this);
	});

	const src = (img, options) => {
		if (keystone.get('cloudinary secure')) {
			options = options || {};
			options.secure = true;
		}
		options.format = options.format || img.format;
		return img.public_id ? cloudinary.url(img.public_id, options) : '';
	};

	const addSize = (options, width, height, other) => {
		if (width) options.width = width;
		if (height) options.height = height;
		if (typeof other === 'object') {
			Object.assign(options, other);
		}
		return options;
	};
	ImageSchema.method('src', function (options) {
		return src(this, options);
	});
	ImageSchema.method('scale', function (width, height, options) {
		return src(this, addSize({ crop: 'scale' }, width, height, options));
	});
	ImageSchema.method('fill', function (width, height, options) {
		return src(this, addSize({ crop: 'fill', gravity: 'faces' }, width, height, options));
	});
	ImageSchema.method('lfill', function (width, height, options) {
		return src(this, addSize({ crop: 'lfill', gravity: 'faces' }, width, height, options));
	});
	ImageSchema.method('fit', function (width, height, options) {
		return src(this, addSize({ crop: 'fit' }, width, height, options));
	});
	ImageSchema.method('limit', function (width, height, options) {
		return src(this, addSize({ crop: 'limit' }, width, height, options));
	});
	ImageSchema.method('pad', function (width, height, options) {
		return src(this, addSize({ crop: 'pad' }, width, height, options));
	});
	ImageSchema.method('lpad', function (width, height, options) {
		return src(this, addSize({ crop: 'lpad' }, width, height, options));
	});
	ImageSchema.method('crop', function (width, height, options) {
		return src(this, addSize({ crop: 'crop', gravity: 'faces' }, width, height, options));
	});
	ImageSchema.method('thumbnail', function (width, height, options) {
		return src(this, addSize({ crop: 'thumb', gravity: 'faces' }, width, height, options));
	});

	schema.add(this._path.addTo({}, [ImageSchema]));

	this.removeImage = function (item, id, method, callback) {
		const images = item.get(field.path);
		if (typeof id !== 'number') {
			for (let i = 0; i < images.length; i++) {
				if (images[i].public_id === id) {
					id = i;
					break;
				}
			}
		}
		const img = images[id];
		if (!img) return;
		if (method === 'delete') {
			cloudinary.uploader.destroy(img.public_id, function () {});
		}
		images.splice(id, 1);
		if (callback) {
			const saveOptions = (typeof callback !== 'function') ? callback : undefined;
			const savePromise = item.save(saveOptions);
			if (typeof callback === 'function') {
				savePromise.then(() => {
					callback();
				}).catch((err) => {
					callback(err);
				});
			}
		}
	};
	this.underscoreMethod('remove', function (id, callback) {
		field.removeImage(this, id, 'remove', callback);
	});
	this.underscoreMethod('delete', function (id, callback) {
		field.removeImage(this, id, 'delete', callback);
	});
	this.bindUnderscoreMethods();
};

/**
 * Formats the field value
 */
cloudinaryimages.prototype.format = function (item) {
	return _.map(item.get(this.path), (img) => img.src()).join(', ');
};

/**
 * Gets the field's data from an Item, as used by the React components
 */
cloudinaryimages.prototype.getData = function (item) {
	const value = item.get(this.path);
	return Array.isArray(value) ? value : [];
};

/**
 * Validates that a value for this field has been provided in a data object
 *
 * Deprecated
 */
cloudinaryimages.prototype.inputIsValid = function (data) { // eslint-disable-line no-unused-vars
	// TODO - how should image field input be validated?
	return true;
};


cloudinaryimages.prototype._originalGetOptions = cloudinaryimages.prototype.getOptions;

cloudinaryimages.prototype.getOptions = function () {
	this._originalGetOptions();
	// We are performing the check here, so that if cloudinary secure is added
	// to keystone after the model is registered, it will still be respected.
	// Setting secure overrides default `cloudinary secure`
	if ('secure' in this.options) {
		this.__options.secure = this.options.secure;
	} else if (keystone.get('cloudinary secure')) {
		this.__options.secure = keystone.get('cloudinary secure');
	}
	return this.__options;
};

/**
 * Updates the value for this field in the item from a data object
 */
cloudinaryimages.prototype.updateItem = function (item, data, files, callback) {
	if (typeof files === 'function') {
		callback = files;
		files = {};
	} else if (!files) {
		files = {};
	}

	const cloudinary = require('cloudinary');
	const field = this;
	let values = this.getValueFromData(data);
	const oldValues = item.get(this.path);

	// TODO: This logic needs to block uploading of files from the data argument,
	// see CloudinaryImage for a reference on how it should be implemented

	// Early exit path: reset value when falsy, or bail if no value was provided
	if (!values) {
		if (values !== undefined) {
			if (field.options.autoCleanup) {
				cleanUp(oldValues, []);
			}
			item.set(field.path, []);
		}
		return process.nextTick(callback);
	}

	// When the value exists, but isn't an array, turn it into one (this just
	// means a single field was submitted in the formdata)
	if (!Array.isArray(values)) {
		values = [values];
	}

	// We cache options to avoid recalculating them on each iteration in the map below
	let cachedUploadOptions;
	const getUploadOptions = () => {
		if (cachedUploadOptions) {
			return cachedUploadOptions;
		}
		let tagPrefix = keystone.get('cloudinary prefix') || '';
		const uploadOptions = {
			tags: [],
		};
		if (tagPrefix.length) {
			uploadOptions.tags.push(tagPrefix);
			tagPrefix += '_';
		}
		uploadOptions.tags.push(`${tagPrefix}${field.list.path}_${field.path}`);
		if (keystone.get('env') !== 'production') {
			uploadOptions.tags.push(`${tagPrefix}dev`);
		}
		const folder = field.getFolder(item);
		if (folder) {
			uploadOptions.folder = folder;
		}
		cachedUploadOptions = uploadOptions;
		return uploadOptions;
	};

	// Preprocess values to deserialise JSON, detect mappings to uploaded files
	// and flatten out arrays
	values = values.map((value) => {
		// When the value is a string, it may be JSON serialised data.
		if (typeof value === 'string'
			&& value.charAt(0) === '{'
			&& value.charAt(value.length - 1) === '}'
		) {
			try {
				return JSON.parse(value);
			} catch (e) { /* value isn't JSON */ }
		}
		if (typeof value === 'string') {
			// detect file upload (field value must be a reference to a field in the
			// uploaded files object provided by multer)
			if (value.substr(0, 7) === 'upload:') {
				const uploadFieldPath = value.substr(7);
				return files[uploadFieldPath];
			}
			// detect a URL or Base64 Data
			else if (/^(data:[a-z\/]+;base64)|(https?\:\/\/)/.test(value)) {
				return { path: value };
			}
		}
		return value;
	});
	values = _.flatten(values);

	async.map(values, (value, next) => {
		if (typeof value === 'object' && 'public_id' in value) {
			// Cloudinary Image data provided
			if (value.public_id) {
				// Default the object with empty values
				const v = Object.assign(getEmptyValue(), value);
				return next(null, v);
			} else {
				// public_id is falsy, remove the value
				return next();
			}
		} else if (typeof value === 'object' && value.path) {
			// File provided - upload it
			let uploadOptions = getUploadOptions();
			// NOTE: field.options.publicID has been deprecated (tbc)
			if (field.options.filenameAsPublicID && value.originalname && typeof value.originalname === 'string') {
				uploadOptions = Object.assign({}, uploadOptions, {
					public_id: value.originalname.substring(0, value.originalname.lastIndexOf('.')),
				});
			}
			cloudinary.uploader.upload(value.path, (result) => {
				if (result.error) {
					next(result.error);
				} else {
					next(null, result);
				}
			}, uploadOptions);
		} else {
			// Nothing to do
			// TODO: We should really also support deleting images from cloudinary,
			// see the CloudinaryImageType field for reference
			return next();
		}
	}, (err, result) => {
		cleanUp(oldValues, values);
		if (err) return callback(err);
		result = result.filter(truthy);
		item.set(field.path, result);
		return callback();
	});
};

module.exports = cloudinaryimages;
