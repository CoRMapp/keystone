const FieldType = require('../Type');
const moment = require('moment');
const utils = require('keystone-utils');
const TextType = require('../text/TextType');

/**
 * Date FieldType Constructor
 * @extends Field
 * @api public
 */
class date extends FieldType {
	get _nativeType () { return Date; }
	get _underscoreMethods () { return ['format', 'moment', 'parse']; }

	constructor (list, path, options) {
		super(list, path, options);
		this._fixedSize = 'medium';
		this._properties = ['formatString', 'yearRange', 'isUTC', 'inputFormat', 'todayButton'];
		this.parseFormatString = options.inputFormat || 'YYYY-MM-DD';
		this.formatString = (options.format === false) ? false : (options.format || 'Do MMM YYYY');

		this.yearRange = options.yearRange;
		this.isUTC = options.utc || false;
		this.todayButton = typeof options.todayButton !== 'undefined' ? options.todayButton : true;

		this.timezoneUtcOffsetMinutes = options.timezoneUtcOffsetMinutes || moment().utcOffset();

		if (this.formatString && typeof this.formatString !== 'string') {
			throw new Error('FieldType.Date: options.format must be a string.');
		}
	}

	/**
	 * Add filters to a query
	 */
	addFilterToQuery (filter) {
		const query = {};
		if (filter.mode === 'between') {
			if (filter.after && filter.before) {
				filter.after = moment(filter.after);
				filter.before = moment(filter.before);
				if (filter.after.isValid() && filter.before.isValid()) {
					query[this.path] = {
						$gte: filter.after.startOf('day').toDate(),
						$lte: filter.before.endOf('day').toDate(),
					};
				}
			}
		} else if (filter.value) {
			const day = {
				moment: moment(filter.value),
			};
			day.start = day.moment.startOf('day').toDate();
			day.end = moment(filter.value).endOf('day').toDate();
			if (day.moment.isValid()) {
				if (filter.mode === 'after') {
					query[this.path] = { $gt: day.end };
				} else if (filter.mode === 'before') {
					query[this.path] = { $lt: day.start };
				} else {
					query[this.path] = { $gte: day.start, $lte: day.end };
				}
			}
		}
		if (filter.inverted) {
			query[this.path] = { $not: query[this.path] };
		}
		return query;
	}

	/**
	 * Formats the field value
	 */
	format (item, format) {
		if (format || this.formatString) {
			return item.get(this.path) ? this.moment(item).format(format || this.formatString) : '';
		} else {
			return item.get(this.path) || '';
		}
	}

	/**
	 * Returns a new `moment` object with the field value
	 */
	moment (item) {
		const m = moment(item.get(this.path));
		if (this.isUTC) m.utc();
		return m;
	}

	/**
	 * Parses input with the correct moment version (normal or utc) and uses
	 * either the provided input format or the default for the field
	 */
	parse (value, format, strict) {
		const m = this.isUTC ? moment.utc : moment;
		if (typeof value === 'number' || value instanceof Date) {
			return m(value);
		} else {
			return m(value, format || this.parseFormatString, strict);
		}
	}

	/**
	 * Asynchronously confirms that the provided date is valid
	 */
	validateInput (data, callback) {
		const value = this.getValueFromData(data);
		let result = true;
		if (value) {
			result = this.parse(value).isValid();
		}
		utils.defer(callback, result);
	}

	/**
	 * Retrives the date as a 'Javascript Date'.
	 */
	getData (item) {
		const value = item.get(this.path);
		const momentDate = this.isUTC ? moment.utc(value) : moment(value);

		if (this.isUTC) {
			if (momentDate.format('HH:mm:ss:SSS') !== '00:00:00:000') {
				const adjustedMomentDate = moment.utc(momentDate);
				adjustedMomentDate.add(this.timezoneUtcOffsetMinutes, 'minutes');
				adjustedMomentDate.add(1, 'hours');
				const timeAsNumber = Number(adjustedMomentDate.format('HHmmssSSS'));
				if (timeAsNumber >= 0 && timeAsNumber <= 20000000) {
					return adjustedMomentDate.startOf('day').toDate();
				} else {
					return momentDate.toDate();
				}
			}
		}

		return momentDate.toDate();
	}

	/**
	 * Checks that a valid date has been provided in a data object
	 * An empty value clears the stored value and is considered valid
	 *
	 * Deprecated
	 */
	inputIsValid (data, required, item) {
		if (!(this.path in data) && item && item.get(this.path)) return true;
		const newValue = moment(data[this.path], this.parseFormatString);
		if (required && (!newValue.isValid())) {
			return false;
		} else if (data[this.path] && newValue && !newValue.isValid()) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Updates the value for this field in the item from a data object
	 */
	updateItem (item, data, callback) {
		const value = this.getValueFromData(data);
		if (value !== null && value !== '') {
			const newValue = this.parse(value);
			if (newValue.isValid() && (!item.get(this.path) || !newValue.isSame(item.get(this.path)))) {
				item.set(this.path, newValue.toDate());
			}
		} else {
			item.set(this.path, null);
		}
		process.nextTick(callback);
	}
}

date.properName = 'Date';

date.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;

/* Export Field Type */
module.exports = date;
