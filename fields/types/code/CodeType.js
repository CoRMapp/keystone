const FieldType = require('../Type');
const TextType = require('../text/TextType');

/**
 * Code FieldType Constructor
 * @extends Field
 * @api public
 */
class code extends FieldType {
	get _nativeType () { return String; }

	constructor (list, path, options) {
		super(list, path, options);
		this._defaultSize = 'full';
		this.height = options.height || 180;
		this.lang = options.lang || options.language;
		this._properties = ['editor', 'height', 'lang'];
		this.codemirror = options.codemirror || {};
		this.editor = Object.assign({ mode: this.lang }, this.codemirror);
	}
}

code.properName = 'Code';

code.prototype.validateInput = TextType.prototype.validateInput;
code.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
code.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = code;
