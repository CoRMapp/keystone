const FieldType = require('../Type');
const TextType = require('../text/TextType');
const utils = require('keystone-utils');

/**
 * Key FieldType Constructor
 * @extends Field
 * @api public
 */
class key extends FieldType {

	get _nativeType () { return String; }

	constructor (list, path, options) {
		super(list, path, options);
		this._defaultSize = 'medium';
		this.separator = options.separator || '-';
	}

	/**
	 * Generates a valid key from a string
	 */
	generateKey (str) {
		return utils.slug(String(str), this.separator);
	}

	/**
	 * Checks that a valid key has been provided in a data object
	 *
	 * Deprecated
	 */
	inputIsValid (data, required, item) {
		let value = this.getValueFromData(data);
		if (value === undefined && item && item.get(this.path)) {
			return true;
		}
		value = this.generateKey(value);
		return (value || !required) ? true : false;
	}

	/**
	 * Updates the value for this field in the item from a data object
	 */
	updateItem (item, data, callback) {
		let value = this.getValueFromData(data);
		if (value === undefined) {
			return process.nextTick(callback);
		}
		value = this.generateKey(value);
		if (item.get(this.path) !== value) {
			item.set(this.path, value);
		}
		process.nextTick(callback);
	}

}

key.properName = 'Key';

key.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
key.prototype.validateInput = TextType.prototype.validateInput;
key.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Export Field Type */
module.exports = key;
