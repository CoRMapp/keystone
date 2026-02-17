const keystone = require('../../index.js');
const { Types } = keystone.Field;

// Simple model
const Post = new keystone.List('Post', {
	autokey: { path: 'slug', from: 'title', unique: true },
});

// Add index
Post.add({
	title: { type: String, required: true, default: '' },
	content: { type: Types.Text, default: '' },
});

Post.schema.index({
	title: 'text',
	content: 'text',
}, {
	name: 'searchIndex',
	weights: {
		content: 2,
		title: 1,
	},
});

Post.register();
