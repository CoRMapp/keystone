const demand = require('must');
const TextareaType = require('../TextareaType');
const TextType = require('../../text/TextType');

exports.initList = (List) => {
	List.add({
		text: TextareaType,
		nested: {
			text: TextareaType,
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
				testItem.nested.text = undefined;
				done();
			});
		});

		it('should update nested fields with flat paths', (done) => {
			const testItem = new List.model();
			List.fields['nested.text'].updateItem(testItem, {
				'nested.text': 'value',
			}, () => {
				demand(testItem.nested.text).be('value');
				testItem.nested.text = undefined;
				done();
			});
		});
	});

	it('should use the common text input validator', () => {
		demand(List.fields.text.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', () => {
		demand(List.fields.text.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', () => {
		demand(List.fields.text.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', () => {
		it('should format to HTML', () => {
			const testItem = new List.model({
				text: 'hello\nworld',
			});
			demand(testItem._.text.format()).be('hello<br>world');
		});
	});

	describe('crop', () => {
		it('should truncate text with a length', () => {
			const testItem = new List.model({
				text: 'helloworld',
			});
			demand(testItem._.text.crop(7)).be('hellowo');
		});

		it('should truncate text with a length and custom append string', () => {
			const testItem = new List.model({
				text: 'helloworld',
			});
			demand(testItem._.text.crop(7, '$')).be('hellowo$');
		});

		it('should truncate text with and preserve words with a length, custom append string', () => {
			const testItem = new List.model({
				text: 'hello world something',
			});
			demand(testItem._.text.crop(7, '...', true)).be('hello world...');
		});
	});
};
