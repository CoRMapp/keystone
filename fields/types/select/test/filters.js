const demand = require('must');
const SelectType = require('../SelectType');

exports.initList = (List) => {
	List.add({
		textSelect: { type: SelectType, options: 'one, two, three' },
		numericSelect: { type: SelectType, numeric: true, options: [
			{ value: 0, label: 'Zero' },
			{ value: 1, label: 'One' },
			{ value: 2, label: 'Two' },
		] },
	});
};

exports.getTestItems = () => [
	{},
	{ textSelect: '', numericSelect: 0 },
	{ textSelect: 'one', numericSelect: 1 },
	{ textSelect: 'two', numericSelect: 2 },
	{ textSelect: 'three' },
];

exports.testFilters = (List, filter) => {
	describe('text values', () => {
		it('should find exact text matches', (done) => {
			filter({
				textSelect: {
					value: 'one',
				},
			}, 'textSelect', (results) => {
				demand(results).eql(['one']);
				done();
			});
		});

		it('should invert exact text matches', (done) => {
			filter({
				textSelect: {
					inverted: true,
					value: 'one',
				},
			}, 'textSelect', (results) => {
				demand(results).eql([undefined, undefined, 'two', 'three']);
				done();
			});
		});

		it('should find multiple text matches', (done) => {
			filter({
				textSelect: {
					value: ['one', 'two'],
				},
			}, 'textSelect', (results) => {
				demand(results).eql(['one', 'two']);
				done();
			});
		});

		it('should invert multiple text matches', (done) => {
			filter({
				textSelect: {
					inverted: true,
					value: ['one', 'two'],
				},
			}, 'textSelect', (results) => {
				demand(results).eql([undefined, undefined, 'three']);
				done();
			});
		});

		it('should find empty text matches', (done) => {
			filter({
				textSelect: {
					value: '',
				},
			}, 'textSelect', (results) => {
				demand(results).eql([undefined, undefined]);
				done();
			});
		});

		it('should invert empty text matches', (done) => {
			filter({
				textSelect: {
					inverted: true,
					value: '',
				},
			}, 'textSelect', (results) => {
				demand(results).eql(['one', 'two', 'three']);
				done();
			});
		});
	});

	describe('numeric values', () => {
		it('should find exact numeric matches', (done) => {
			filter({
				numericSelect: {
					value: 1,
				},
			}, 'numericSelect', (results) => {
				demand(results).eql([1]);
				done();
			});
		});

		it('should invert exact numeric matches', (done) => {
			filter({
				numericSelect: {
					inverted: true,
					value: 1,
				},
			}, 'numericSelect', (results) => {
				demand(results).eql([undefined, 0, 2, undefined]);
				done();
			});
		});

		it('should find multiple numeric matches', (done) => {
			filter({
				numericSelect: {
					value: [1, 2],
				},
			}, 'numericSelect', (results) => {
				demand(results).eql([1, 2]);
				done();
			});
		});

		it('should invert multiple numeric matches', (done) => {
			filter({
				numericSelect: {
					inverted: true,
					value: [1, 2],
				},
			}, 'numericSelect', (results) => {
				demand(results).eql([undefined, 0, undefined]);
				done();
			});
		});

		it('should find empty numeric matches', (done) => {
			filter({
				numericSelect: {
					value: '',
				},
			}, 'numericSelect', (results) => {
				demand(results).eql([undefined, undefined]);
				done();
			});
		});

		it('should invert empty numeric matches', (done) => {
			filter({
				numericSelect: {
					inverted: true,
					value: '',
				},
			}, 'numericSelect', (results) => {
				demand(results).eql([0, 1, 2]);
				done();
			});
		});
	});

	describe('combined values', () => {
		it('should find combined text and numeric matches', (done) => {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					value: 1,
				},
			}, 'textSelect', (results) => {
				demand(results).eql(['one']);
				done();
			});
		});

		it('should combine with inverted matches', (done) => {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					inverted: true,
					value: 2,
				},
			}, 'textSelect', (results) => {
				demand(results).eql(['one']);
				done();
			});
		});

		it('should combine with inverted negating matches', (done) => {
			filter({
				textSelect: {
					value: 'one',
				},
				numericSelect: {
					inverted: true,
					value: 1,
				},
			}, 'textSelect', (results) => {
				demand(results).eql([]);
				done();
			});
		});
	});
};
