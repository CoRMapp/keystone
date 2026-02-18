const _ = require('lodash');
const utils = require('keystone-utils');

/**
 * Adds one or more fields to the List
 * Based on Mongoose's Schema.add
 */
function add () {
	const addObj = function (obj, prefix) {
		prefix = prefix || '';
		const keys = Object.keys(obj);
		for (let i = 0; i < keys.length; ++i) {
			const key = keys[i];
			if (!obj[key]) {
				throw new Error(
					`Invalid value for schema path \`${prefix}${key}\` in \`${this.key}\`.\n`
					+ 'Did you misspell the field type?\n'
				);
			}
			if (utils.isObject(obj[key]) && (!obj[key].constructor || obj[key].constructor.name === 'Object') && (!obj[key].type || obj[key].type.type)) {
				if (Object.keys(obj[key]).length) {
					// nested object, e.g. { last: { name: String }}
					// matches logic in mongoose/Schema:add
					this.schema.nested[prefix + key] = true;
					addObj(obj[key], `${prefix}${key}.`);
				} else {
					addField(prefix + key, obj[key]); // mixed type field
				}
			} else {
				addField(prefix + key, obj[key]);
			}
		}
	}.bind(this);

	const addField = function (path, options) {
		if (this.isReserved(path)) {
			throw new Error(`Path ${path} on list ${this.key} is a reserved path`);
		}
		this.uiElements.push({
			type: 'field',
			field: this.field(path, options),
		});
	}.bind(this);

	const args = Array.prototype.slice.call(arguments);

	_.forEach(args, (def) => {
		this.schemaFields.push(def);
		if (typeof def === 'string') {
			if (def === '>>>') {
				this.uiElements.push({
					type: 'indent',
				});
			} else if (def === '<<<') {
				this.uiElements.push({
					type: 'outdent',
				});
			} else {
				this.uiElements.push({
					type: 'heading',
					heading: def,
					options: {},
				});
			}
		} else {
			if (def.heading && typeof def.heading === 'string') {
				this.uiElements.push({
					type: 'heading',
					heading: def.heading,
					options: def,
				});
			} else {
				addObj(def);
			}
		}
	});

	return this;
}

module.exports = add;
