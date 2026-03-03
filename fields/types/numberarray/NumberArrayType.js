const FieldType = require('../Type');
const numeral = require('numeral');
const utils = require('keystone-utils');
const addPresenceToQuery = require('../../utils/addPresenceToQuery');

/**
 * Checks if a value is a valid number
 */
function isValidNumber (value) {
	return !Number.isNaN(utils.number(value));
}

/**
 * NumberArray FieldType Constructor
 * @extends Field
 * @api public
 */
class numberarray extends FieldType {

	get _nativeType () { return [Number]; }
	get _underscoreMethods () { return ['format']; }

	constructor (list, path, options) {
		super(list, path, options);
		this._formatString = (options.format === false) ? false : (options.format || '0,0[.][000000000000]');
		this._defaultSize = 'small';
		if (this._formatString && typeof this._formatString !== 'string') {
			throw new Error('FieldType.NumberArray: options.format must be a string.');
		}
		this.separator = options.separator || ' | ';
	}

	/**
	 * Formats the field value
	 */
	format (item, format, separator) {
		let value = item.get(this.path);
		if (format || this._formatString) {
			value = value.map((n) => numeral(n).format(format || this._formatString));
		}
		return value.join(separator || this.separator);
	}

	/**
	 * Asynchronously confirms that the provided value is valid
	 */
	validateInput (data, callback) {
		const value = this.getValueFromData(data);
		let result = true;
		// Let undefined, empty string and null pass
		if (value !== undefined && value !== '' && value !== null) {
			// Coerce a single value to an array
			const arr = !Array.isArray(value) ? [value] : value;
			for (let i = 0; i < arr.length; i++) {
				let thisValue = arr[i];
				// If it's a string, check if there's a number in the string
				if (typeof thisValue === 'string') {
					thisValue = utils.number(thisValue);
				}
				// If it's not a number or NaN invalidate
				if (typeof thisValue !== 'number' || Number.isNaN(thisValue)) {
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
		if (typeof value === 'string' && value !== '') {
			result = true;
		} else if (Array.isArray(value)) {
			let invalidContent = false;
			for (let i = 0; i < value.length; i++) {
				let thisValue = value[i];
				if (typeof thisValue === 'string') {
					thisValue = utils.number(thisValue);
				}
				if (typeof thisValue !== 'number' || Number.isNaN(thisValue)) {
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
	 * Add filters to a query
	 */
	addFilterToQuery (filter) {
		const query = {};
		const presence = filter.presence || 'some';
		if (filter.value === undefined
			|| filter.value === null
			|| filter.value === '') {
			query[this.path] = presence === 'some' ? {
				$size: 0,
			} : {
				$not: {
					$size: 0,
				},
			};
			return query;
		}
		if (filter.mode === 'between') {
			const min = utils.number(filter.value.min);
			const max = utils.number(filter.value.max);
			if (!isNaN(min) && !isNaN(max)) {
				query[this.path] = {
					$gte: min,
					$lte: max,
				};
				query[this.path] = addPresenceToQuery(presence, query[this.path]);
			}
			return query;
		}
		const value = utils.number(filter.value);
		if (!isNaN(value)) {
			if (filter.mode === 'gt') {
				query[this.path] = {
					$gt: value,
				};
			}
			else if (filter.mode === 'lt') {
				query[this.path] = {
					$lt: value,
				};
			}
			else {
				query[this.path] = {
					$eq: value,
				};
			}
			query[this.path] = addPresenceToQuery(presence, query[this.path]);
		}
		return query;
	}

	/**
	 * Checks that a valid array of number has been provided in a data object
	 * An empty value clears the stored value and is considered valid
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
		if (typeof value === 'string') {
			if (!isValidNumber(value)) {
				return false;
			}
		}
		if (Array.isArray(value)) {
			for (let index = 0; index < value.length; index++) {
				if (!isValidNumber(value[index])) {
					return false;
				}
			}
		}
		return (value === undefined || Array.isArray(value) || (typeof value === 'string') || (typeof value === 'number'));
	}

	/**
	 * Updates the value for this field in the item from a data object
	 */
	updateItem (item, data, callback) {
		let value = this.getValueFromData(data);
		if (value === undefined || value === null || value === '') {
			value = [];
		}
		if (!Array.isArray(value)) {
			value = [value];
		}
		value = value.map((num) => {
			if (typeof num !== 'number') {
				num = utils.number(num);
			}
			return num;
		}).filter((num) => !Number.isNaN(num));
		item.set(this.path, value);
		process.nextTick(callback);
	}

}

numberarray.properName = 'NumberArray';

/* Export Field Type */
module.exports = numberarray;
