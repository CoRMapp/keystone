const demand = require('must');
const TextArrayType = require('../TextArrayType');

exports.initList = (List) => {
	List.add({
		textarr: TextArrayType,
	});
};

exports.getTestItems = () => [
	{},
	{ textarr: [] },
	{ textarr: [''] },
	{ textarr: ['', ''] },
	{ textarr: [' '] },
	{ textarr: ['a', 'b', 'c'] },
	{ textarr: ['A', 'B', 'C'] },
	{ textarr: ['abc', 'def'] },
	{ textarr: ['ace', 'gik'] },
	{ textarr: [1, 2, 3] },
];

exports.testFilters = (List, filter) => {
	describe('no presence specified', () => {
		it('should filter a string', (done) => {
			filter({
				textarr: {
					value: 'a',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter case sensitively', (done) => {
			filter({
				textarr: {
					value: 'a',
					caseSensitive: true,
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['a', 'b', 'c'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter a number', (done) => {
			filter({
				textarr: {
					value: 1,
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['1', '2', '3'],
				]);
				done();
			});
		});

		it('should filter a string exactly', (done) => {
			filter({
				textarr: {
					value: 'a',
					mode: 'exactly',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
				]);
				done();
			});
		});

		it('should filter for strings beginning with something', (done) => {
			filter({
				textarr: {
					value: 'ab',
					mode: 'beginsWith',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter for strings ending with something', (done) => {
			filter({
				textarr: {
					value: 'bc',
					mode: 'endsWith',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter arrays with empty values', (done) => {
			filter({
				textarr: {},
			}, 'textarr', (results) => {
				demand(results.length).be(4);
				done();
			});
		});
	});

	describe('"none" present', () => {
		it('should not filter empty fields out', (done) => {
			filter({
				textarr: {
					presence: 'none',
					value: 'a',
				},
			}, 'textarr', (results) => {
				demand(results.length).be(6);
				done();
			});
		});

		it('should filter for non-empty fields', (done) => {
			filter({
				textarr: {
					presence: 'none',
				},
			}, 'textarr', (results) => {
				demand(results.length).be(6);
				done();
			});
		});

		// The rest of the function is already tested with the other presences
	});

	// Should behave exactly like no presence specified
	describe('"some" present', () => {
		it('should filter a string', (done) => {
			filter({
				textarr: {
					presence: 'some',
					value: 'a',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter case sensitively', (done) => {
			filter({
				textarr: {
					presence: 'some',
					value: 'a',
					caseSensitive: true,
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['a', 'b', 'c'],
					['abc', 'def'],
					['ace', 'gik'],
				]);
				done();
			});
		});

		it('should filter a number', (done) => {
			filter({
				textarr: {
					presence: 'some',
					value: 1,
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['1', '2', '3'],
				]);
				done();
			});
		});

		it('should filter a string exactly', (done) => {
			filter({
				textarr: {
					presence: 'some',
					value: 'a',
					mode: 'exactly',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['a', 'b', 'c'],
					['A', 'B', 'C'],
				]);
				done();
			});
		});

		it('should filter for strings beginning with something', (done) => {
			filter({
				textarr: {
					presence: 'some',
					value: 'ab',
					mode: 'beginsWith',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter for strings ending with something', (done) => {
			filter({
				textarr: {
					presence: 'some',
					value: 'bc',
					mode: 'endsWith',
				},
			}, 'textarr', (results) => {
				demand(results).eql([
					['abc', 'def'],
				]);
				done();
			});
		});

		it('should filter arrays with empty values', (done) => {
			filter({
				textarr: {
					presence: 'some',
				},
			}, 'textarr', (results) => {
				demand(results.length).be(4);
				done();
			});
		});
	});
};
