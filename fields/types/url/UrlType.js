const FieldType = require('../Type');
const TextType = require('../text/TextType');

/**
 * Remove the protocol prefix from url
 */
const removeProtocolPrefix = (url) => url.replace(/^[a-zA-Z]+\:\/\//, '');

/**
 * URL FieldType Constructor
 * @extends Field
 * @api public
 */
class url extends FieldType {
	get _nativeType () { return String; }
	get _underscoreMethods () { return ['format']; }

	/**
	 * Formats the field value using either a supplied format function or default
	 * which strips the leading protocol from the value for simpler display
	 */
	format (item) {
		const value = item.get(this.path) || '';
		if (this.options.format === false) {
			return value;
		} else if (typeof this.options.format === 'function') {
			return this.options.format(value);
		} else {
			return removeProtocolPrefix(value);
		}
	}
}

url.properName = 'Url';

url.prototype.validateInput = TextType.prototype.validateInput;
url.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
url.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = url;
