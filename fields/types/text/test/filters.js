const demand = require('must');

exports.initList = (List) => {
	List.add({
		text1: String,
		text2: String,
	});
};

exports.getTestItems = () => [
	{},
	{ text1: '' },
	{ text1: ' ' },
	{ text1: 'abc' },
	{ text1: 'ABCD' },
	{ text1: 'abcd', text2: '123' },
	{ text1: 'Ab Cd', text2: '1 2 3' },
	{ text1: 'a/b\c@d' },
];

exports.testFilters = (List, filter) => {
	describe('match', () => {
		it('should find exact string matches', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					value: 'abc',
				},
			}, 'text1', (results) => {
				demand(results).eql(['abc']);
				done();
			});
		});

		it('should invert exact string matches', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					inverted: true,
					value: 'abc',
				},
			}, 'text1', (results) => {
				demand(results).eql([
					undefined,
					'',
					' ',
					'ABCD',
					'abcd',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});

		it('should find empty and null string matches', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					value: '',
				},
			}, 'text1', (results) => {
				demand(results).eql([undefined, '']);
				done();
			});
		});

		it('should invert empty and null string matches', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					inverted: true,
					value: '',
				},
			}, 'text1', (results) => {
				demand(results).eql([
					' ',
					'abc',
					'ABCD',
					'abcd',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});

		it('should find whitespace matches', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					value: ' ',
				},
			}, 'text1', (results) => {
				demand(results).eql([' ']);
				done();
			});
		});

		it('should work with special characters', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					value: 'a/b\c@d',
				},
			}, 'text1', (results) => {
				demand(results).eql(['a/b\c@d']);
				done();
			});
		});

		it('should be case insensitive by default', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					value: 'abcd',
				},
			}, 'text1', (results) => {
				demand(results).eql(['ABCD', 'abcd']);
				done();
			});
		});

		it('should allow case sensitivity', (done) => {
			filter({
				text1: {
					caseSensitive: true,
					mode: 'exactly',
					value: 'abcd',
				},
			}, 'text1', (results) => {
				demand(results).eql(['abcd']);
				done();
			});
		});

		it('should combine correctly', (done) => {
			filter({
				text1: {
					mode: 'exactly',
					value: 'abcd',
				},
				text2: {
					mode: 'exactly',
					value: '123',
				},
			}, 'text1', (results) => {
				demand(results).eql(['abcd']);
				done();
			});
		});
	});

	describe('beginsWith', () => {
		it('should match the start of strings', (done) => {
			filter({
				text1: {
					mode: 'beginsWith',
					value: 'abc',
				},
			}, 'text1', (results) => {
				demand(results).eql([
					'abc',
					'ABCD',
					'abcd',
				]);
				done();
			});
		});

		it('should invert correctly', (done) => {
			filter({
				text1: {
					mode: 'beginsWith',
					inverted: true,
					value: 'abc',
				},
			}, 'text1', (results) => {
				demand(results).eql([
					undefined,
					'',
					' ',
					'Ab Cd',
					'a/b\c@d',
				]);
				done();
			});
		});
	});

	describe('endsWith', () => {
		it('should match the end of strings', (done) => {
			filter({
				text1: {
					mode: 'endsWith',
					value: 'cd',
				},
			}, 'text1', (results) => {
				demand(results).eql([
					'ABCD',
					'abcd',
					'Ab Cd',
				]);
				done();
			});
		});

		it('should invert correctly', (done) => {
			filter({
				text1: {
					mode: 'endsWith',
					inverted: true,
					value: 'cd',
				},
			}, 'text1', (results) => {
				demand(results).eql([
					undefined,
					'',
					' ',
					'abc',
					'a/b\c@d',
				]);
				done();
			});
		});
	});
};
