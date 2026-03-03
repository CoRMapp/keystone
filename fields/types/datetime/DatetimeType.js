const moment = require('moment');
const DateType = require('../date/DateType');
const FieldType = require('../Type');
const utils = require('keystone-utils');

// ISO_8601 is needed for the automatically created createdAt and updatedAt fields
const parseFormats = ['YYYY-MM-DD', 'YYYY-MM-DD hh:mm:ss a', 'YYYY-MM-DD h:mm:ss a', 'YYYY-MM-DD h:m:s a', 'YYYY-MM-DD hh:mm a', 'YYYY-MM-DD h:m a', 'YYYY-MM-DD HH:mm:ss', 'YYYY-MM-DD H:m:s', 'YYYY-MM-DD HH:mm', 'YYYY-MM-DD H:m', 'YYYY-MM-DD hh:mm:ss a Z', 'YYYY-MM-DD h:mm:s a Z', moment.ISO_8601];

/**
 * DateTime FieldType Constructor
 * @extends Field
 * @api public
 */
class datetime extends FieldType {
	get _nativeType () { return Date; }
	get _underscoreMethods () { return ['format', 'moment', 'parse']; }

	constructor (list, path, options) {
		super(list, path, options);
		this._fixedSize = 'full';
		this._properties = ['formatString', 'isUTC'];
		this.typeDescription = 'date and time';
		this.parseFormatString = options.parseFormat || parseFormats;
		this.formatString = (options.format === false) ? false : (options.format || 'YYYY-MM-DD h:mm:ss a');
		this.isUTC = options.utc || false;
		if (this.formatString && typeof this.formatString !== 'string') {
			throw new Error('FieldType.DateTime: options.format must be a string.');
		}
		this.paths = {
			date: `${this.path}_date`,
			time: `${this.path}_time`,
			tzOffset: `${this.path}_tzOffset`,
		};
	}

	/**
	 * Get the value from a data object; may be simple or a pair of fields
	 */
	getInputFromData (data) {
		const dateValue = this.getValueFromData(data, '_date');
		const timeValue = this.getValueFromData(data, '_time');
		const tzOffsetValue = this.getValueFromData(data, '_tzOffset');
		if (dateValue && timeValue) {
			let combined = `${dateValue} ${timeValue}`;
			if (typeof tzOffsetValue !== 'undefined') {
				combined += ` ${tzOffsetValue}`;
			}
			return combined;
		}

		return this.getValueFromData(data);
	}

	validateRequiredInput (item, data, callback) {
		const value = this.getInputFromData(data);
		let result = !!value;
		if (value === undefined && item.get(this.path)) {
			result = true;
		}
		utils.defer(callback, result);
	}

	/**
	 * Validates the input we get to be a valid date,
	 * undefined, null or an empty string
	 */
	validateInput (data, callback) {
		const value = this.getInputFromData(data);
		let result = true;
		if (value) {
			result = this.parse(value, this.parseFormatString, true).isValid();
		}
		utils.defer(callback, result);
	}

	/**
	 * Checks that a valid date has been provided in a data object
	 * An empty value clears the stored value and is considered valid
	 *
	 * Deprecated
	 */
	inputIsValid (data, required, item) {
		if (!(this.path in data && !(this.paths.date in data && this.paths.time in data)) && item && item.get(this.path)) return true;
		const newValue = moment(this.getInputFromData(data), parseFormats);
		if (required && (!newValue || !newValue.isValid())) {
			return false;
		} else if (this.getInputFromData(data) && newValue && !newValue.isValid()) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Updates the value for this field in the item from a data object
	 */
	updateItem (item, data, callback) {
		const value = this.getInputFromData(data);
		if (value !== undefined) {
			if (value !== null && value !== '') {
				const newValue = this.parse(value, this.parseFormatString, true);
				if (!item.get(this.path) || !newValue.isSame(item.get(this.path))) {
					item.set(this.path, newValue.toDate());
				}
			} else {
				item.set(this.path, null);
			}
		}
		process.nextTick(callback);
	}
}

datetime.properName = 'Datetime';

/* Inherit generic methods */
datetime.prototype.format = DateType.prototype.format;
datetime.prototype.moment = DateType.prototype.moment;
datetime.prototype.parse = DateType.prototype.parse;
datetime.prototype.addFilterToQuery = DateType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = datetime;
