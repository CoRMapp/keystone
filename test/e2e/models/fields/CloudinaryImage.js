const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const CloudinaryImage = new keystone.List('CloudinaryImage', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

CloudinaryImage.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.CloudinaryImage,
	},
	fieldB: {
		type: Types.CloudinaryImage,
	},
});

CloudinaryImage.defaultColumns = 'name, fieldA, fieldB';
CloudinaryImage.register();

module.exports = CloudinaryImage;
