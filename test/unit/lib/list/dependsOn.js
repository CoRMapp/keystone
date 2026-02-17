const keystone = require('../../../../index.js');
const demand = require('must');

keystone.mongoose = require('../../../helpers/getMongooseConnection.js');

keystone.import('../models');

const DependsOn = keystone.list('DependsOn');

describe('Test dependsOn and required', function () {

	it('Ignore required if evalDependsOn is not `true` by setting `state` to `draft`', async function () {
		await DependsOn.model.deleteMany({});

		const newPost = new DependsOn.model({
			title: 'new post',
			state: 'draft',
		});

		await newPost.save();
	});

	it('Save will fail if `state` set to `published` and `publishedDate` is not defined', async function () {
		await DependsOn.model.deleteMany({});

		// suppressing console log output
		const backupLog = console.error;
		console.error = () => null;

		const newPost = new DependsOn.model({
			title: 'new post',
			state: 'published',
			publishedDate: undefined,
		});

		try {
			await newPost.save();
			throw new Error('Expected validation error');
		} catch (err) {
			demand(err).be.a.object();
			console.error = backupLog;
		}
	});

	it('Save will succeed if `state` set to `published` and `publishedDate` is defined', async function () {
		await DependsOn.model.deleteMany({});

		const newPost = new DependsOn.model({
			title: 'new post',
			state: 'published',
			publishedDate: new Date(),
		});
		await newPost.save();
	});

	after(async function () {
		await DependsOn.model.deleteMany({});
	});
});
