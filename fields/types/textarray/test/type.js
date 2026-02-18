const demand = require('must');
const TextArrayType = require('../TextArrayType');

exports.initList = (List) => {
	List.add({
		textarr: TextArrayType,
		nested: {
			textarr: TextArrayType,
		},
		customSeparator: { type: TextArrayType, separator: ' * ' },
	});
};

exports.testFieldType = (List) => {
	it('should default to an empty array', () => {
		const testItem = new List.model();
		demand(testItem.get('textarr')).eql([]);
	});

	describe('validateInput', () => {
		it('should validate top level fields', (done) => {
			List.fields.textarr.validateInput({
				textarr: ['a', 'b'],
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields', (done) => {
			List.fields.textarr.validateInput({
				nested: {
					textarr: ['a', 'b'],
				},
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested fields with flat paths', (done) => {
			List.fields.textarr.validateInput({
				'nested.textarr': ['a', 'b'],
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		// A single string will be coerced to an array, so we let it pass
		it('should validate a single string value', (done) => {
			List.fields.textarr.validateInput({
				textarr: 'a',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		// An empty array clears the value, so we let it pass
		it('should validate an empty array', (done) => {
			List.fields.textarr.validateInput({ textarr: [] }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		// A blank string clears the value, so we let it pass
		it('should validate a blank string', (done) => {
			List.fields.textarr.validateInput({ textarr: '' }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		// null clears the value, so we let it pass
		it('should validate null', (done) => {
			List.fields.textarr.validateInput({ textarr: null }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		// undefined doesn't change anything, so we let it pass
		it('should validate undefined', (done) => {
			List.fields.textarr.validateInput({
				textarr: undefined,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate false', (done) => {
			List.fields.textarr.validateInput({ textarr: false }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true', (done) => {
			List.fields.textarr.validateInput({ textarr: true }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate a number', (done) => {
			List.fields.textarr.validateInput({ textarr: 1 }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array of numbers', (done) => {
			List.fields.textarr.validateInput({
				textarr: [1, 2, 3],
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with a numbers', (done) => {
			List.fields.textarr.validateInput({
				textarr: ['a', 2, 'b'],
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', () => {
		it('should validate an array of strings', (done) => {
			const testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: ['a', 'b'],
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of strings', (done) => {
			const testItem = new List.model();
			List.fields['nested.textarr'].validateRequiredInput(testItem, {
				nested: {
					textarr: ['a', 'b'],
				},
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested array of strings with a flat paths', (done) => {
			List.fields.textarr.validateInput({
				'nested.textarr': ['a', 'b'],
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate an empty string', (done) => {
			const testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined', (done) => {
			const testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: undefined,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a value exists', (done) => {
			const testItem = new List.model({
				textarr: ['a'],
			});
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: undefined,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null', (done) => {
			const testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: null,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with an empty string', (done) => {
			const testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: [''],
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an array with empty strings', (done) => {
			const testItem = new List.model();
			List.fields.textarr.validateRequiredInput(testItem, {
				textarr: ['a', 'b', ''],
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('updateItem', () => {
		it('should update top level fields', (done) => {
			const testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: ['a', 'b'],
			}, () => {
				demand(testItem.textarr).eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields', (done) => {
			const testItem = new List.model();
			List.fields['nested.textarr'].updateItem(testItem, {
				nested: {
					textarr: ['a', 'b'],
				},
			}, () => {
				demand(testItem.nested.textarr).eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields with flat paths', (done) => {
			const testItem = new List.model();
			List.fields['nested.textarr'].updateItem(testItem, {
				'nested.textarr': ['a', 'b'],
			}, () => {
				demand(testItem.nested.textarr).eql(['a', 'b']);
				done();
			});
		});

		it('should update nested fields non-empty arrays to empty arrays when the data is empty', (done) => {
			const testItem = new List.model();
			List.fields['nested.textarr'].updateItem(testItem, {
				'nested.textarr': ['a', 'b'],
			}, () => {
				List.fields['nested.textarr'].updateItem(testItem, {}, () => {
					demand(testItem.nested.textarr).eql([]);
					done();
				});
			});
		});

		it('should update non-empty arrays to empty arrays when the data is empty', (done) => {
			const testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: ['a', 'b'],
			}, () => {
				List.fields.textarr.updateItem(testItem, {}, () => {
					demand(testItem.textarr).eql([]);
					done();
				});
			});
		});

		it('should update empty arrays', (done) => {
			const testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: [],
			}, () => {
				demand(testItem.textarr).eql([]);
				done();
			});
		});

		it('should default on null', (done) => {
			const testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: null,
			}, () => {
				demand(testItem.textarr).eql([]);
				done();
			});
		});

		it('should allow a single string value', (done) => {
			const testItem = new List.model();
			List.fields.textarr.updateItem(testItem, {
				textarr: 'a',
			}, () => {
				demand(testItem.textarr).eql(['a']);
				done();
			});
		});

		it('should convert truthy values with toString methods to strings', (done) => {
			const testItem = new List.model();
			const time = new Date();
			List.fields.textarr.updateItem(testItem, {
				textarr: [1, 'a', true, false, null, undefined, [], {}, time],
			}, () => {
				demand(testItem.textarr).eql(['1', 'a', 'true', '[object Object]', String(time)]);
				done();
			});
		});
	});

	describe('addFilterToQuery', () => {
		describe('"some" present', () => {
			it('should return a regex with the "i" flag set', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/i,
					},
				});
			});

			it('should allow case sensitive matching', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					caseSensitive: true,
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/,
					},
				});
			});

			it('should allow exact matching', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'exactly',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc$/i,
					},
				});
			});

			it('should allow matching the end', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'endsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc$/i,
					},
				});
			});

			it('should allow matching the start', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
					value: 'abc',
					mode: 'beginsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc/i,
					},
				});
			});

			it('should allow matching empty values', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'some',
				});
				demand(result.textarr).eql({
					$size: 0,
				});
			});
		});

		describe('"none" present', () => {
			it('should return a regex with the "i" flag set', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
				});
				demand(result.textarr).eql({
					$not: /abc/i,
				});
			});

			it('should allow case sensitive matching', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					caseSensitive: true,
				});
				demand(result.textarr).eql({
					$not: /abc/,
				});
			});

			it('should allow exact matching', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'exactly',
				});
				demand(result.textarr).eql({
					$not: /^abc$/i,
				});
			});

			it('should allow matching the end', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'endsWith',
				});
				demand(result.textarr).eql({
					$not: /abc$/i,
				});
			});

			it('should allow matching the start', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
					value: 'abc',
					mode: 'beginsWith',
				});
				demand(result.textarr).eql({
					$not: /^abc/i,
				});
			});

			it('should allow matching non-empty values', () => {
				const result = List.fields.textarr.addFilterToQuery({
					presence: 'none',
				});
				demand(result.textarr).eql({
					$not: {
						$size: 0,
					},
				});
			});
		});

		// Presence undefined should behave exactly like presence === 'some'
		describe('no presence option', () => {
			it('should return a regex with the "i" flag set', () => {
				const result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/i,
					},
				});
			});

			it('should allow case sensitive matching', () => {
				const result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					caseSensitive: true,
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc/,
					},
				});
			});

			it('should allow exact matching', () => {
				const result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					mode: 'exactly',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc$/i,
					},
				});
			});

			it('should allow matching the end', () => {
				const result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					mode: 'endsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /abc$/i,
					},
				});
			});

			it('should allow matching the start', () => {
				const result = List.fields.textarr.addFilterToQuery({
					value: 'abc',
					mode: 'beginsWith',
				});
				demand(result.textarr).eql({
					$elemMatch: {
						$regex: /^abc/i,
					},
				});
			});

			it('should allow matching empty values in exact mode', () => {
				const result = List.fields.textarr.addFilterToQuery({});
				demand(result.textarr).eql({
					$size: 0,
				});
			});
		});
	});

	describe('format', () => {
		it('should use the default separator for formatting', () => {
			const testItem = new List.model({
				textarr: ['one', 'two', 'three'],
			});
			demand(testItem._.textarr.format()).be('one | two | three');
		});

		it('should use the provided separator for formatting', () => {
			const testItem = new List.model({
				textarr: ['one', 'two', 'three'],
			});
			demand(testItem._.textarr.format(', ')).be('one, two, three');
		});

		it('should use the specified separator for formatting', () => {
			const testItem = new List.model({
				customSeparator: ['one', 'two', 'three'],
			});
			demand(testItem._.customSeparator.format()).be('one * two * three');
		});
	});

	/* Deprecated inputIsValid Tests */

	it('should validate input', () => {
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a'],
		})).be.true();
		demand(List.fields.textarr.inputIsValid({
			textarr: ['a', 'b'],
		})).be.true();
	});

	it('should validate no input', () => {
		const testItem = new List.model();
		demand(List.fields.textarr.inputIsValid({})).be.true();
		demand(List.fields.textarr.inputIsValid({}, true)).be.false();
		testItem.textarr = ['a'];
		demand(List.fields.textarr.inputIsValid({}, true, testItem)).be.true();
	});

	it('should validate length when required', () => {
		demand(List.fields.textarr.inputIsValid({
			textarr: [],
		}, true)).be.false();
	});

	it('should invalidate arrays with complex values', () => {
		demand(List.fields.textarr.inputIsValid({
			textarr: [[]],
		}, true)).be.false();
	});
};
