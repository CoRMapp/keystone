const demand = require('must');
const UrlType = require('../UrlType');
const TextType = require('../../text/TextType');

const customFormat = (url) => url.toUpperCase();

exports.initList = (List) => {
	List.add({
		url: UrlType,
		nested: {
			url: UrlType,
		},
		customFormat: { type: UrlType, format: customFormat },
	});
};

exports.testFieldType = (List) => {
	describe('updateItem', () => {
		it('should update top level fields', (done) => {
			const testItem = new List.model();
			List.fields.url.updateItem(testItem, {
				url: 'value',
			}, () => {
				demand(testItem.url).be('value');
				done();
			});
		});

		it('should update nested fields', (done) => {
			const testItem = new List.model();
			List.fields['nested.url'].updateItem(testItem, {
				nested: {
					url: 'value',
				},
			}, () => {
				demand(testItem.nested.url).be('value');
				done();
			});
		});

		it('should update nested fields with flat paths', (done) => {
			const testItem = new List.model();
			List.fields['nested.url'].updateItem(testItem, {
				'nested.url': 'value',
			}, () => {
				demand(testItem.nested.url).be('value');
				done();
			});
		});
	});

	it('should use the common text input validator', () => {
		demand(List.fields.url.validateInput === TextType.prototype.validateInput);
	});

	it('should use the common text required validator', () => {
		demand(List.fields.url.validateRequiredInput === TextType.prototype.validateRequiredInput);
	});

	it('should use the common text addFilterToQuery method', () => {
		demand(List.fields.url.addFilterToQuery === TextType.prototype.addFilterToQuery);
	});

	describe('format', () => {
		it('should strip the protocol when formatting', (done) => {
			const testItem = new List.model();
			List.fields.url.updateItem(testItem, {
				url: 'http://www.keystonejs.com',
			}, () => {
				demand(testItem._.url.format()).be('www.keystonejs.com');
				done();
			});
		});

		it('should call custom format methods', (done) => {
			const testItem = new List.model();
			List.fields.customFormat.updateItem(testItem, {
				customFormat: 'http://www.keystonejs.com',
			}, () => {
				demand(testItem._.customFormat.format()).be('HTTP://WWW.KEYSTONEJS.COM');
				done();
			});
		});
	});
};
