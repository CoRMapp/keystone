const keystone = require('../../../../index.js');
const assert = require('assert');
const _ = require('lodash');

keystone.import('../models');

const Post = keystone.list('Post');

// Test data for Post(s)
const testData = {
	posts: [{
		title: 'Test Post 1',
		content: 'keyword',
	}, {
		title: 'Test Post 2',
		content: 'keyword keyword',
	}, {
		title: 'Test Post 3',
		content: 'keyword keyword keyword',
	}, {
		title: 'Test Post 4',
		content: 'keyword keyword keyword keyword',
	}, {
		title: 'Test Post 5',
		content: 'keyword keyword keyword keyword keyword',
	}, {
		title: 'Test Post 6',
		content: 'keyword keyword keyword keyword keyword keyword',
	}, {
		title: 'Test Post 7',
		content: 'keyword keyword keyword keyword keyword keyword keyword',
	}],
};

describe('When paginating results', function () {
	beforeEach(async function () {
		await Post.model.deleteMany({});
		for (const post of testData.posts) {
			const newPost = new Post.model(post);
			await newPost.save();
		}
	});

	after(async function () {
		await Post.model.deleteMany({});
	});

	// regression test for pagination after adding `options.optionalExpression`
	describe('without an optional expression', function () {
		it('should return results plus pagination metadata', function (done) {
			const regressionTestData = _.extend(testData, {
				expectedPages: [1, 2, 3, 4],
				perPage: 2,
			});

			let completed = 0;
			const total = regressionTestData.expectedPages.length;

			regressionTestData.expectedPages.forEach(function (pageNumber) {
				Post.paginate({
					page: pageNumber,
					perPage: regressionTestData.perPage,
					select: 'title',
				}).sort({
					title: 'asc',
				}).exec(function (error, results) {
					if (error) return done(error);

					assert.equal(results.currentPage, pageNumber);
					assert.equal(results.totalPages, regressionTestData.expectedPages.length);
					assert.deepStrictEqual(results.pages, regressionTestData.expectedPages);

					if (_.first(regressionTestData.expectedPages) === pageNumber) {
						assert(!results.previous);
						assert(results.next);
					} else if (_.last(regressionTestData.expectedPages) === pageNumber) {
						assert(results.previous);
						assert(!results.next);
					} else {
						assert(results.previous);
						assert(results.next);
					}

					assert(results.results.length <= regressionTestData.perPage);

					completed++;
					if (completed === total) done();
				});
			});
		});
	});

	describe('with an optional expression', function () {
		it('should return results plus query metadata and pagination metadata', function (done) {
			const searchTestData = _.extend(testData, {
				expectedPages: [1, 2],
				perPage: 5,
			});

			let completed = 0;
			const total = searchTestData.expectedPages.length;

			searchTestData.expectedPages.forEach(function (pageNumber) {
				Post.paginate({
					page: pageNumber,
					perPage: searchTestData.perPage,
					filters: {
						$text: { $search: 'keyword' },
					},
					optionalExpression: {
						score: { $meta: 'textScore' },
					},
				}).sort({
					score: { $meta: 'textScore' },
				}).exec(function (error, results) {
					if (error) return done(error);

					_.each(results.results, function (result) {
						const score = result.get('score');
						assert.notEqual(score, undefined);
					});

					assert.equal(results.currentPage, pageNumber);
					assert.equal(results.totalPages, searchTestData.expectedPages.length);
					assert.deepStrictEqual(results.pages, searchTestData.expectedPages);

					if (_.first(searchTestData.expectedPages) === pageNumber) {
						assert(!results.previous);
						assert(results.next);
					} else if (_.last(searchTestData.expectedPages) === pageNumber) {
						assert(results.previous);
						assert(!results.next);
					} else {
						assert(results.previous);
						assert(results.next);
					}

					assert(results.results.length <= searchTestData.perPage);

					completed++;
					if (completed === total) done();
				});
			});
		});
	});
});
