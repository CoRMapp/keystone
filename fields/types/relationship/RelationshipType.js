const _ = require('lodash');
const FieldType = require('../Type');
const keystone = require('../../../');
const utils = require('keystone-utils');
const definePrototypeGetters = require('../../utils/definePrototypeGetters');

/**
 * Relationship FieldType Constructor
 * @extends Field
 * @api public
 */
class relationship extends FieldType {

	get _nativeType () { return keystone.mongoose.Schema.Types.ObjectId; }
	get _underscoreMethods () { return ['format', 'getExpandedData']; }

	constructor (list, path, options) {
		super(list, path, options);
		this.many = (options.many) ? true : false;
		this.filters = options.filters;
		this.createInline = (options.createInline) ? true : false;
		this._defaultSize = 'full';
		this._properties = ['isValid', 'many', 'filters', 'createInline'];
	}

	/**
	 * Get client-side properties to pass to react field.
	 */
	getProperties () {
		const refList = this.refList;
		return {
			refList: {
				singular: refList.singular,
				plural: refList.plural,
				path: refList.path,
				key: refList.key,
			},
		};
	}

	/**
	 * Gets id and name for the related item(s) from populated values
	 */
	getExpandedData (item) {
		const value = item.get(this.path);
		if (this.many) {
			if (!value || !Array.isArray(value)) return [];
			return value.map((i) => expandRelatedItemData.call(this, i)).filter(truthy);
		} else {
			return expandRelatedItemData.call(this, value);
		}
	}

	/**
	 * Registers the field on the List's Mongoose Schema.
	 */
	addToSchema (schema) {
		const def = {
			type: this._nativeType,
			ref: this.options.ref,
			index: (this.options.index ? true : false),
			required: (this.options.required ? true : false),
			unique: (this.options.unique ? true : false),
		};
		schema.path(this.path, this.many ? [def] : def);
	}

	/**
	 * Gets the field's data from an Item, as used by the React components
	 */
	getData (item) {
		const value = item.get(this.path);
		if (this.many) {
			return Array.isArray(value) ? value : [];
		} else {
			return value;
		}
	}

	/**
	 * Add filters to a query
	 */
	addFilterToQuery (filter) {
		const query = {};
		if (!Array.isArray(filter.value)) {
			if (typeof filter.value === 'string' && filter.value) {
				filter.value = [filter.value];
			} else {
				filter.value = [];
			}
		}
		if (filter.value.length) {
			query[this.path] = (filter.inverted) ? { $nin: filter.value } : { $in: filter.value };
		} else {
			if (this.many) {
				query[this.path] = (filter.inverted) ? { $not: { $size: 0 } } : { $size: 0 };
			} else {
				query[this.path] = (filter.inverted) ? { $ne: null } : null;
			}
		}
		return query;
	}

	/**
	 * Formats the field value
	 */
	format (item) {
		const value = item.get(this.path);
		return this.many ? value.join(', ') : `${value || ''}`;
	}

	/**
	 * Asynchronously confirms that the provided value is valid
	 */
	validateInput (data, callback) {
		let value = this.getValueFromData(data);
		let result = false;
		if (value === undefined || value === null || value === '') {
			result = true;
		} else {
			if (this.many) {
				if (!Array.isArray(value) && typeof value === 'string' && value.length) {
					value = [value];
				}
				if (Array.isArray(value)) {
					result = true;
				}
			} else {
				if (typeof value === 'string' && value.length) {
					result = true;
				}
				if (typeof value === 'object' && value.id) {
					result = true;
				}
			}
		}
		utils.defer(callback, result);
	}

	/**
	 * Asynchronously confirms that the provided value is present
	 */
	validateRequiredInput (item, data, callback) {
		let value = this.getValueFromData(data);
		let result = false;
		if (value === undefined) {
			if (this.many) {
				if (item.get(this.path).length) {
					result = true;
				}
			} else {
				if (item.get(this.path)) {
					result = true;
				}
			}
		} else if (this.many) {
			if (!Array.isArray(value) && typeof value === 'string' && value.length) {
				value = [value];
			}
			if (Array.isArray(value) && value.length) {
				result = true;
			}
		} else {
			if (value) {
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
		if (!required) return true;
		if (!(this.path in data) && item && ((this.many && item.get(this.path).length) || item.get(this.path))) return true;
		if (typeof data[this.path] === 'string') {
			return (data[this.path].trim()) ? true : false;
		} else {
			return (data[this.path]) ? true : false;
		}
	}

	/**
	 * Updates the value for this field in the item from a data object.
	 */
	updateItem (item, data, callback) {
		if (item.populated(this.path)) {
			throw new Error('fieldTypes.relationship.updateItem() Error - You cannot update populated relationships.');
		}

		const value = this.getValueFromData(data);
		if (value === undefined) {
			return process.nextTick(callback);
		}

		if (this.many) {
			const arr = item.get(this.path);
			const _old = arr.map((i) => String(i));
			let _new = value;
			if (!utils.isArray(_new)) {
				_new = String(_new || '').split(',');
			}
			_new = _.compact(_new);
			if (!_.isEqual(_old, _new)) {
				item.set(this.path, _new);
			}
		} else {
			if (value && value !== item.get(this.path)) {
				item.set(this.path, value);
			} else if (!value && item.get(this.path)) {
				item.set(this.path, null);
			}
		}
		process.nextTick(callback);
	}

}

relationship.properName = 'Relationship';

function expandRelatedItemData (item) {
	if (!item || !item.id) return undefined;
	return {
		id: item.id,
		name: this.refList.getDocumentName(item),
	};
}

const truthy = (value) => value;

definePrototypeGetters(relationship, {
	isValid: function () {
		return keystone.list(this.options.ref) ? true : false;
	},
	refList: function () {
		return keystone.list(this.options.ref);
	},
	hasFilters: function () {
		return (this.filters && _.keys(this.filters).length);
	},
});

/* Export Field Type */
module.exports = relationship;
