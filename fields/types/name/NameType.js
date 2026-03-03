const _ = require('lodash');
const FieldType = require('../Type');
const utils = require('keystone-utils');
const displayName = require('display-name');

/**
 * Name FieldType Constructor
 * @extends Field
 * @api public
 */
class name extends FieldType {

	constructor (list, path, options) {
		options.default = { first: '', last: '' };
		super(list, path, options);
		this._fixedSize = 'full';
	}

	/**
	 * Registers the field on the List's Mongoose Schema.
	 */
	addToSchema (schema) {
		const paths = this.paths = {
			first: `${this.path}.first`,
			last: `${this.path}.last`,
			full: `${this.path}.full`,
		};

		schema.nested[this.path] = true;
		schema.add({
			first: String,
			last: String,
		}, `${this.path}.`);

		schema.virtual(paths.full).get(function () {
			return displayName(this.get(paths.first), this.get(paths.last));
		});

		schema.virtual(paths.full).set(function (value) {
			if (typeof value !== 'string') {
				this.set(paths.first, undefined);
				this.set(paths.last, undefined);
				return;
			}
			const split = value.split(' ');
			this.set(paths.first, split.shift());
			this.set(paths.last, split.join(' ') || undefined);
		});

		this.bindUnderscoreMethods();
	}

	/**
	 * Gets the string to use for sorting by this field
	 */
	getSortString (options) {
		if (options.invert) {
			return `-${this.paths.first} -${this.paths.last}`;
		}
		return `${this.paths.first} ${this.paths.last}`;
	}

	/**
	 * Add filters to a query
	 */
	addFilterToQuery (filter) {
		const query = {};
		if (filter.mode === 'exactly' && !filter.value) {
			query[this.paths.first] = query[this.paths.last] = filter.inverted ? { $nin: ['', null] } : { $in: ['', null] };
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
		if (filter.inverted) {
			query[this.paths.first] = query[this.paths.last] = { $not: value };
		} else {
			const first = {}; first[this.paths.first] = value;
			const last = {}; last[this.paths.last] = value;
			query.$or = [first, last];
		}
		return query;
	}

	/**
	 * Formats the field value
	 */
	format (item) {
		return item.get(this.paths.full);
	}

	/**
	 * Get the value from a data object; may be simple or a pair of fields
	 */
	getInputFromData (data) {
		if (data[this.path] === null) {
			return null;
		}
		let first = this.getValueFromData(data, '_first');
		if (first === undefined) first = this.getValueFromData(data, '.first');
		let last = this.getValueFromData(data, '_last');
		if (last === undefined) last = this.getValueFromData(data, '.last');
		if (first !== undefined || last !== undefined) {
			return {
				first: first,
				last: last,
			};
		}
		return this.getValueFromData(data) || this.getValueFromData(data, '.full');
	}

	/**
	 * Validates that a value for this field has been provided in a data object
	 */
	validateInput (data, callback) {
		const value = this.getInputFromData(data);
		const result = value === undefined
			|| value === null
			|| typeof value === 'string'
			|| (typeof value === 'object' && (
				typeof value.first === 'string'
				|| value.first === null
				|| typeof value.last === 'string'
				|| value.last === null)
			);
		utils.defer(callback, result);
	}

	/**
	 * Validates that input has been provided
	 */
	validateRequiredInput (item, data, callback) {
		const value = this.getInputFromData(data);
		let result;
		if (value === null) {
			result = false;
		} else {
			result = (
				typeof value === 'string' && value.length
				|| typeof value === 'object' && (
					typeof value.first === 'string' && value.first.length
					|| typeof value.last === 'string' && value.last.length)
				|| (item.get(this.paths.full)
					|| item.get(this.paths.first)
					|| item.get(this.paths.last))
						&& (value === undefined
						|| (value.first === undefined
							&& value.last === undefined))
			) ? true : false;
		}
		utils.defer(callback, result);
	}

	/**
	 * Validates that a value for this field has been provided in a data object
	 *
	 * Deprecated
	 */
	inputIsValid (data, required, item) {
		if (!(this.path in data || this.paths.first in data || this.paths.last in data || this.paths.full in data) && item && item.get(this.paths.full)) return true;
		if (!required) return true;
		if (_.isObject(data[this.path])) {
			return (data[this.path].full || data[this.path].first || data[this.path].last) ? true : false;
		} else {
			return (data[this.paths.full] || data[this.paths.first] || data[this.paths.last]) ? true : false;
		}
	}

	/**
	 * Detects whether the field has been modified
	 */
	isModified (item) {
		return item.isModified(this.paths.first) || item.isModified(this.paths.last);
	}

	/**
	 * Updates the value for this field in the item from a data object
	 */
	updateItem (item, data, callback) {
		const paths = this.paths;
		const value = this.getInputFromData(data);
		if (typeof value === 'string' || value === null) {
			item.set(paths.full, value);
		} else if (typeof value === 'object') {
			if (typeof value.first === 'string' || value.first === null) {
				item.set(paths.first, value.first);
			}
			if (typeof value.last === 'string' || value.last === null) {
				item.set(paths.last, value.last);
			}
		}
		process.nextTick(callback);
	}

}

name.properName = 'Name';

/* Export Field Type */
module.exports = name;
