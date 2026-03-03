const FieldType = require('../Type');
const TextType = require('../text/TextType');

/**
 * Color FieldType Constructor
 * @extends Field
 * @api public
 */
class color extends FieldType {

	get _nativeType () { return String; }

}

color.properName = 'Color';

color.prototype.validateInput = TextType.prototype.validateInput;
color.prototype.validateRequiredInput = TextType.prototype.validateRequiredInput;
color.prototype.addFilterToQuery = TextType.prototype.addFilterToQuery;

/* Export Field Type */
module.exports = color;
