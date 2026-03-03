const _ = require('lodash');
const FieldType = require('../Type');
const utils = require('keystone-utils');

/**
 * Select FieldType Constructor
 * @extends Field
 * @api public
 */
class select extends FieldType {
	get _nativeType () { return this.options && this.options.numeric ? Number : String; }
	get _underscoreMethods () { return ['format', 'pluck']; }

	constructor (list, path, options) {
		if (typeof options.options === 'string') {
			options.options = options.options.split(',');
		}
		if (!Array.isArray(options.options)) {
			throw new Error('Select fields require an options array.');
		}
		// undefined options.emptyOption defaults to true
		if (options.emptyOption === undefined) {
			options.emptyOption = true;
		}
		super(list, path, options);
		this.ui = options.ui || 'select';
		this.numeric = options.numeric ? true : false;
		this._properties = ['ops', 'numeric'];
		// ensure this.emptyOption is a boolean
		this.emptyOption = !!options.emptyOption;
	}

	/**
	 * Registers the field on the List's Mongoose Schema.
	 */
	addToSchema (schema) {
		const field = this;

		// Compute ops/map/labels/values from options
		this.ops = this.options.options.map((i) => {
			let op = typeof i === 'string' ? { value: i.trim(), label: utils.keyToLabel(i) } : i;
			if (!_.isObject(op)) {
				op = { label: `${i}`, value: `${i}` };
			}
			if (this.options.numeric && !_.isNumber(op.value)) {
				op.value = Number(op.value);
			}
			return op;
		});
		this.map = utils.optionsMap(this.ops);
		this.labels = utils.optionsMap(this.ops, 'label');
		this.values = _.map(this.ops, 'value');

		this.paths = {
			data: this.options.dataPath || `${this.path}Data`,
			label: this.options.labelPath || `${this.path}Label`,
			options: this.options.optionsPath || `${this.path}Options`,
			map: this.options.optionsMapPath || `${this.path}OptionsMap`,
		};
		schema.path(this.path, _.defaults({
			type: this._nativeType,
			enum: this.values,
			set: function (val) {
				return (val === '' || val === null || val === false) ? undefined : val;
			},
		}, this.options));
		schema.virtual(this.paths.data).get(function () {
			return field.map[this.get(field.path)];
		});
		schema.virtual(this.paths.label).get(function () {
			return field.labels[this.get(field.path)];
		});
		schema.virtual(this.paths.options).get(function () {
			return field.ops;
		});
		schema.virtual(this.paths.map).get(function () {
			return field.map;
		});
		this.bindUnderscoreMethods();
	}

	/**
	 * Returns a key value from the selected option
	 */
	pluck (item, property, _default) {
		const option = item.get(this.paths.data);
		return (option) ? option[property] : _default;
	}

	/**
	 * Retrieves a shallow clone of the options array
	 */
	cloneOps () {
		return _.map(this.ops, _.clone);
	}

	/**
	 * Retrieves a shallow clone of the options map
	 */
	cloneMap () {
		return utils.optionsMap(this.ops, true);
	}

	/**
	 * Add filters to a query
	 */
	addFilterToQuery (filter) {
		const query = {};
		if (!Array.isArray(filter.value)) {
			if (filter.value) {
				filter.value = [filter.value];
			} else {
				filter.value = [];
			}
		}
		if (filter.value.length > 1) {
			query[this.path] = (filter.inverted) ? { $nin: filter.value } : { $in: filter.value };
		} else if (filter.value.length === 1) {
			query[this.path] = (filter.inverted) ? { $ne: filter.value[0] } : filter.value[0];
		} else {
			query[this.path] = (filter.inverted) ? { $nin: ['', null] } : { $in: ['', null] };
		}
		return query;
	}

	/**
	 * Asynchronously confirms that the provided value is valid
	 */
	validateInput (data, callback) {
		let value = this.getValueFromData(data);
		if (typeof value === 'string' && this.numeric) {
			value = utils.number(value);
		}
		const result = value === undefined || value === null || value === '' || (value in this.map) ? true : false;
		utils.defer(callback, result);
	}

	/**
	 * Asynchronously confirms that the provided value is present
	 */
	validateRequiredInput (item, data, callback) {
		const value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if (item.get(this.path)) {
				result = true;
			}
		} else if (value) {
			if (value !== '') {
				if (value in this.map) {
					result = true;
				}
			}
		}
		utils.defer(callback, result);
	}

	/**
	 * Validates that a valid option has been provided in a data object
	 *
	 * Deprecated
	 */
	inputIsValid (data, required, item) {
		if (data[this.path]) {
			return (data[this.path] in this.map) ? true : false;
		} else {
			return (!required || (!(this.path in data) && item && item.get(this.path))) ? true : false;
		}
	}

	/**
	 * Formats the field value
	 */
	format (item) {
		return this.labels[item.get(this.path)] || '';
	}
}

select.properName = 'Select';

/* Export Field Type */
module.exports = select;
