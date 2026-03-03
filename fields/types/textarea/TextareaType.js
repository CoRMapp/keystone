const FieldType = require('../Type');
const TextType = require('../text/TextType');
const utils = require('keystone-utils');

/**
 * Textarea FieldType Constructor
 * @extends Field
 * @api public
 */
class textarea extends FieldType {

	get _nativeType () { return String; }
	get _underscoreMethods () { return ['format', 'crop']; }

	constructor (list, path, options) {
		super(list, path, options);
		this.height = options.height || 90;
		this.multiline = true;
		this._properties = ['height', 'multiline'];
	}

	/**
	 * Formats the field value
	 * @api public
	 */
	format (item) {
		return utils.textToHTML(item.get(this.path));
	}

}

textarea.properName = 'Textarea';

textarea.prototype.validateInput = TextType.prototype.validateInput;
textarea.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
textarea.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;
textarea.prototype.crop = TextType.prototype.crop;

/* Export Field Type */
module.exports = textarea;
