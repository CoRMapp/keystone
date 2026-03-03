const FieldType = require('../Type');
const NumberType = require('../number/NumberType');
const numeral = require('numeral');

/**
 * Money FieldType Constructor
 * @extends Field
 * @api public
 */
class money extends FieldType {

	get _nativeType () { return Number; }
	get _underscoreMethods () { return ['format']; }

	constructor (list, path, options) {
		if (options.currency) {
			throw new Error('The currency option from money has been deprecated. Provide a formatString instead');
		}
		super(list, path, options);
		this._properties = ['currency'];
		this._fixedSize = 'small';
		this._formatString = (options.format === false) ? false : (options.format || '$0,0.00');
		if (this._formatString && typeof this._formatString !== 'string') {
			throw new Error('FieldType.Money: options.format must be a string.');
		}
	}

	/**
	 * Formats the field value
	 */
	format (item, format) {
		if (format || this._formatString) {
			return (typeof item.get(this.path) === 'number') ? numeral(item.get(this.path)).format(format || this._formatString) : '';
		} else {
			return item.get(this.path) || '';
		}
	}

}

money.properName = 'Money';

money.prototype.validateInput = NumberType.prototype.validateInput;
money.prototype.validateRequiredInput = NumberType.prototype.validateRequiredInput;
money.prototype.updateItem = NumberType.prototype.updateItem;
money.prototype.inputIsValid = NumberType.prototype.inputIsValid;
money.prototype.addFilterToQuery = NumberType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = money;
