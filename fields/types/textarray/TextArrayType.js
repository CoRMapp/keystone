const FieldType = require('../Type');
const utils = require('keystone-utils');
const addPresenceToQuery = require('../../utils/addPresenceToQuery');

/**
 * TextArray FieldType Constructor
 * @extends Field
 * @api public
 */
class textarray extends FieldType {

	get _nativeType () { return [String]; }
	get _underscoreMethods () { return ['format']; }

	constructor (list, path, options) {
		super(list, path, options);
		this.separator = options.separator || ' | ';
	}

	/**
	 * Formats the field value
	 */
	format (item, separator) {
		return item.get(this.path).join(separator || this.separator);
	}

	/**
	 * Add filters to a query
	 */
	addFilterToQuery (filter) {
		const query = {};
		const presence = filter.presence || 'some';
		// Filter empty/non-empty arrays
		if (!filter.value) {
			query[this.path] = presence === 'some' ? {
				$size: 0,
			} : {
				$not: {
					$size: 0,
				},
			};
			return query;
		}
		let value = utils.escapeRegExp(filter.value);
		if (filter.mode === 'beginsWith') {
			value = `^${value}`;
		} else if (filter.mode === 'endsWith') {
			value = `${value}$`;
		} else if (filter.mode === 'exactly') {
			value = `^${value}$`;
		}
		value = new RegExp(value, filter.caseSensitive ? '' : 'i');
		if (presence === 'none') {
			query[this.path] = addPresenceToQuery(presence, value);
		} else {
			query[this.path] = addPresenceToQuery(presence, {
				$regex: value,
			});
		}
		return query;
	}

	/**
	 * Asynchronously confirms that the provided value is valid
	 */
	validateInput (data, callback) {
		let value = this.getValueFromData(data);
		let result = true;
		if (value !== undefined && value !== null && value !== '') {
			if (!Array.isArray(value)) {
				value = [value];
			}
			for (let i = 0; i < value.length; i++) {
				const thisValue = value[i];
				if (typeof thisValue !== 'string') {
					result = false;
					break;
				}
			}
		}
		utils.defer(callback, result);
	}

	/**
	 * Asynchronously confirms that the a value is present
	 */
	validateRequiredInput (item, data, callback) {
		const value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if (item.get(this.path) && item.get(this.path).length) {
				result = true;
			}
		}
		if (typeof value === 'string') {
			if (value !== '') {
				result = true;
			}
		} else if (Array.isArray(value)) {
			let invalidContent = false;
			for (let i = 0; i < value.length; i++) {
				const thisValue = value[i];
				if (typeof thisValue !== 'string' || thisValue === '') {
					invalidContent = true;
					break;
				}
			}
			if (invalidContent === false) {
				result = true;
			}
		}
		utils.defer(callback, result);
	}

	/**
	 * Validates that a value for this field has been provided in a data object
	 *
	 * Deprecated
	 */
	inputIsValid (data, required, item) {
		const value = this.getValueFromData(data);
		if (required) {
			if (value === undefined && item && item.get(this.path) && item.get(this.path).length) {
				return true;
			}
			if (value === undefined || !Array.isArray(value) || (typeof value !== 'string') || (typeof value !== 'number')) {
				return false;
			}
			if (Array.isArray(value) && !value.length) {
				return false;
			}
		}
		return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
	}

	/**
	 * Updates the value for this field in the item from a data object.
	 * If the data object does not contain the value, then the value is set to empty array.
	 */
	updateItem (item, data, callback) {
		let value = this.getValueFromData(data);
		if (value === undefined || value === null || value === '') {
			value = [];
		}
		if (!Array.isArray(value)) {
			value = [value];
		}
		value = value.map((str) => {
			if (str && str.toString) {
				str = str.toString();
			}
			return str;
		}).filter((str) => (typeof str === 'string' && str));
		item.set(this.path, value);
		process.nextTick(callback);
	}

}

textarray.properName = 'TextArray';

/* Export Field Type */
module.exports = textarray;
