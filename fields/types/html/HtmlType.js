const FieldType = require('../Type');
const TextType = require('../text/TextType');

/**
 * HTML FieldType Constructor
 * @extends Field
 * @api public
 */
class html extends FieldType {

	get _nativeType () { return String; }

	constructor (list, path, options) {
		super(list, path, options);
		this._defaultSize = 'full';
		this.wysiwyg = options.wysiwyg || false;
		this.height = options.height || 180;
		this._properties = ['wysiwyg', 'height'];
	}

}

html.properName = 'Html';

html.prototype.validateInput = TextType.prototype.validateInput;
html.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
html.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = html;
