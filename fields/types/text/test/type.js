const demand = require('must');

exports.initList = (List) => {
	List.add({
		text: String,
		nested: {
			text: String,
		},
		maxChar: {
			type: String,
			max: 55,
		},
		minChar: {
			type: String,
			min: 10,
		},
	});
};

exports.testFieldType = (List) => {
	describe('updateItem', () => {
		it('should update top level fields', (done) => {
			const testItem = new List.model();
			List.fields.text.updateItem(testItem, {
				text: 'value',
			}, () => {
				demand(testItem.text).be('value');
				done();
			});
		});

		it('should update nested fields', (done) => {
			const testItem = new List.model();
			List.fields['nested.text'].updateItem(testItem, {
				nested: {
					text: 'value',
				},
			}, () => {
				demand(testItem.nested.text).be('value');
				done();
			});
		});

		it('should truncate text with a length', () => {
			const testItem = new List.model({
				text: 'hello world',
			});
			demand(testItem._.text.crop(8)).be('hello wo');
		});

		it('should update nested fields with flat paths', (done) => {
			const testItem = new List.model();
			List.fields['nested.text'].updateItem(testItem, {
				'nested.text': 'value',
			}, () => {
				demand(testItem.nested.text).be('value');
				done();
			});
		});
	});

	describe('validateInput', () => {
		it('should validate string input', (done) => {
			List.fields.text.validateInput({ text: 'a' }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate emtpy string input', (done) => {
			List.fields.text.validateInput({ text: '' }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', (done) => {
			List.fields.text.validateInput({}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', (done) => {
			List.fields.text.validateInput({ text: null }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numeric input', (done) => {
			List.fields.text.validateInput({ text: 1 }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate object input', (done) => {
			List.fields.text.validateInput({ text: { things: 'stuff' } }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', (done) => {
			List.fields.text.validateInput({ text: [1, 2, 3] }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate Boolean input', (done) => {
			List.fields.text.validateInput({ text: true }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate function input', (done) => {
			List.fields.text.validateInput({ text: function () {} }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate regexp input', (done) => {
			List.fields.text.validateInput({ text: /foo/ }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate date input', (done) => {
			List.fields.text.validateInput({ text: Date.now() }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate string over max characters', (done) => {
			List.fields.maxChar.validateInput({ maxChar: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate string shorter than min characters', (done) => {
			List.fields.minChar.validateInput({ minChar: 'Short' }, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', () => {
		it('should validate input present', (done) => {
			const testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: 'a' }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined', (done) => {
			const testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: undefined }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a previous value exists', (done) => {
			const testItem = new List.model({
				text: 'a',
			});
			List.fields.text.validateRequiredInput(testItem, { text: undefined }, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate empty string', (done) => {
			const testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: '' }, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null', (done) => {
			const testItem = new List.model();
			List.fields.text.validateRequiredInput(testItem, { text: null }, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('addFilterToQuery', () => {
		it('should return a regex with the "i" flag set', () => {
			const result = List.fields.text.addFilterToQuery({
				value: 'abc',
			});
			demand(result.text).eql(/abc/i);
		});

		it('should allow case sensitive matching', () => {
			const result = List.fields.text.addFilterToQuery({
				value: 'abc',
				caseSensitive: true,
			});
			demand(result.text).eql(/abc/);
		});

		it('should allow inverted matching', () => {
			const result = List.fields.text.addFilterToQuery({
				value: 'abc',
				inverted: true,
			});
			demand(result.text).eql({
				$not: /abc/i,
			});
		});

		it('should allow exact matching', () => {
			const result = List.fields.text.addFilterToQuery({
				value: 'abc',
				mode: 'exactly',
			});
			demand(result.text).eql(/^abc$/i);
		});

		it('should allow matching the end', () => {
			const result = List.fields.text.addFilterToQuery({
				value: 'abc',
				mode: 'endsWith',
			});
			demand(result.text).eql(/abc$/i);
		});

		it('should allow matching the start', () => {
			const result = List.fields.text.addFilterToQuery({
				value: 'abc',
				mode: 'beginsWith',
			});
			demand(result.text).eql(/^abc/i);
		});

		it('should allow matching empty values in exact mode', () => {
			const result = List.fields.text.addFilterToQuery({
				mode: 'exactly',
			});
			demand(result.text).eql({
				$in: ['', null],
			});
		});

		it('should allow matching non-empty values in exact mode with the inverted option', () => {
			const result = List.fields.text.addFilterToQuery({
				mode: 'exactly',
				inverted: true,
			});
			demand(result.text).eql({
				$nin: ['', null],
			});
		});
	});
};
