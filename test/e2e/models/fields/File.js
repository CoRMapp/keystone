const keystone = require('../../../../index.js');
const Types = keystone.Field.Types;

const File = new keystone.List('File', {
	autokey: {
		path: 'key',
		from: 'name',
		unique: true,
	},
	track: true,
});

const localStorage = new keystone.Storage({
	adapter: keystone.Storage.Adapters.FS,
	fs: {
		path: 'data/files',
		publicPath: '/files',
	},
});

File.add({
	name: {
		type: String,
		initial: true,
		required: true,
		index: true,
	},
	fieldA: {
		type: Types.File,
		storage: localStorage,
	},
	fieldB: {
		type: Types.File,
		storage: localStorage,
	},
});

File.defaultColumns = 'name, fieldA, fieldB';
File.register();

module.exports = File;
