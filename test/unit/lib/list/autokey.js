const keystone = require('../../../../index.js');
const demand = require('must');
const utils = require('keystone-utils');

keystone.mongoose = require('../../../helpers/getMongooseConnection.js');

keystone.import('../models');

const Post = keystone.list('Post');

describe('Test autokey', function () {

	it('generate an autokey value from another field', async function () {
		const post = new Post.model({
			title: 'Foo Bar',
			content: 'Foo bar bar baz bar bar',
		});

		await post.save();
		const found = await Post.model.findOne({ title: 'Foo Bar' });
		demand(found.slug).be(utils.slug('Foo Bar'));
	});

	it('not try to generate an autokey value if from field is not selected', async function () {
		const post = new Post.model({
			title: 'Foo Bar 2',
			content: 'Foo bar bar baz bar bar',
		});

		await post.save();
		const found = await Post.model.findOne({ title: 'Foo Bar 2' }).select('content');
		demand(found.title).be(undefined);
		found.content = 'narf narf narf';

		await found.save();
		const updated = await Post.model.findOne({ slug: utils.slug('Foo Bar 2') });
		demand(updated).be.a.object();
		demand(updated.slug).be(utils.slug('Foo Bar 2'));
	});

	after(async function () {
		await Post.model.deleteMany({});
	});
});
