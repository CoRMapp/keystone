const demand = require('must');
const SelectType = require('../SelectType');

exports.initList = (List) => {
	List.add({
		select: { type: SelectType, options: 'one, two, three' },
		nested: {
			select: { type: SelectType, options: 'one, two, three' },
		},
		extraProps: { type: SelectType, options: [
			{ value: 'one', label: 'One', custom: '1' },
			{ value: 'two', label: 'Two', custom: '2' },
		] },
		numeric: { type: SelectType, numeric: true, options: [
			{ value: 1, label: 'one' },
			{ value: 2, label: 'two' },
			{ value: 3, label: 'three' },
		] },
		emptyStringSelect: { type: SelectType, options: [
			{ value: '', label: '' },
			{ value: 'two', label: 'Two' },
		] },
	});
};

exports.testFieldType = (List) => {
	describe('invalid options', () => {
		it('should throw when no options are passed', (done) => {
			try {
				List.add({
					noOptions: { type: SelectType },
				});
			} catch (err) {
				demand(err.message).eql('Select fields require an options array.');
				done();
			}
		});
	});

	describe('validateInput', () => {
		it('should validate top level selects', (done) => {
			List.fields.select.validateInput({
				select: 'one',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate nested selects', (done) => {
			List.fields['nested.select'].validateInput({
				nested: {
					select: 'one',
				},
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', (done) => {
			List.fields.select.validateInput({
				select: undefined,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', (done) => {
			List.fields.select.validateInput({
				select: null,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an empty string', (done) => {
			List.fields.select.validateInput({
				select: '',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate an empty string if specified as an option', (done) => {
			List.fields.emptyStringSelect.validateInput({
				emptyStringSelect: '',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate numbers', (done) => {
			List.fields.select.validateInput({
				select: 1,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate numbers when numeric is set to true', (done) => {
			List.fields.numeric.validateInput({
				numeric: 1,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate number strings when numeric is set to true', (done) => {
			List.fields.numeric.validateInput({
				numeric: '1',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate non existing options', (done) => {
			List.fields.select.validateInput({
				select: 'four',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate two selected options', (done) => {
			List.fields.select.validateInput({
				select: 'one, two',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true', (done) => {
			List.fields.select.validateInput({
				select: true,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate false', (done) => {
			List.fields.select.validateInput({
				select: false,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('validateRequiredInput', () => {
		it('should validate a selected option', (done) => {
			const testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: 'one',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested select', (done) => {
			const testItem = new List.model();
			List.fields['nested.select'].validateRequiredInput(testItem, {
				nested: {
					select: 'one',
				},
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a nested select with a flat path', (done) => {
			List.fields.select.validateInput({
				'nested.select': ['a', 'b'],
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate an empty string', (done) => {
			const testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined', (done) => {
			const testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: undefined,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined if a value exists', (done) => {
			const testItem = new List.model({
				select: 'one',
			});
			List.fields.select.validateRequiredInput(testItem, {
				select: undefined,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate null', (done) => {
			const testItem = new List.model();
			List.fields.select.validateRequiredInput(testItem, {
				select: null,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty string even if specified as an option', (done) => {
			const testItem = new List.model();
			List.fields.emptyStringSelect.validateRequiredInput(testItem, {
				emptyStringSelect: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('updateItem', () => {
		it('should update top level fields', (done) => {
			const testItem = new List.model();
			List.fields.select.updateItem(testItem, {
				select: 'one',
			}, () => {
				demand(testItem.select).be('one');
				done();
			});
		});

		it('should update nested fields', (done) => {
			const testItem = new List.model();
			List.fields['nested.select'].updateItem(testItem, {
				nested: {
					select: 'one',
				},
			}, () => {
				demand(testItem.nested.select).be('one');
				done();
			});
		});

		it('should update nested fields with flat paths', (done) => {
			const testItem = new List.model();
			List.fields['nested.select'].updateItem(testItem, {
				'nested.select': 'one',
			}, () => {
				demand(testItem.nested.select).be('one');
				done();
			});
		});
	});

	describe('addFilterToQuery', () => {
		it('should filter by an array', () => {
			const result = List.fields.select.addFilterToQuery({
				value: ['Some', 'strings'],
			});
			demand(result.select).eql({
				$in: ['Some', 'strings'],
			});
		});

		it('should support inverted mode for an array', () => {
			const result = List.fields.select.addFilterToQuery({
				value: ['Some', 'strings'],
				inverted: true,
			});
			demand(result.select).eql({
				$nin: ['Some', 'strings'],
			});
		});

		it('should filter by a string', () => {
			const result = List.fields.select.addFilterToQuery({
				value: 'a string',
			});
			demand(result.select).eql('a string');
		});

		it('should support inverted mode for a string', () => {
			const result = List.fields.select.addFilterToQuery({
				value: 'a string',
				inverted: true,
			});
			demand(result.select).eql({
				$ne: 'a string',
			});
		});

		it('should filter by existance if no value exists', () => {
			const result = List.fields.select.addFilterToQuery({});
			demand(result.select).eql({
				$in: ['', null],
			});
		});

		it('should filter by non-existance if no value exists', () => {
			const result = List.fields.select.addFilterToQuery({
				inverted: true,
			});
			demand(result.select).eql({
				$nin: ['', null],
			});
		});
	});

	it('should format values with the label of the option', () => {
		const testItem = new List.model({
			select: 'one',
		});
		demand(List.fields.select.format(testItem)).be('One');
	});

	it('should pluck custom properties from the selected option', () => {
		const testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem._.extraProps.pluck('custom')).be('2');
	});

	it('should have the label in nameLabel', () => {
		const testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsLabel).be('Two');
	});

	it('should have the current data in nameData', () => {
		const testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsData).eql({
			value: 'two', label: 'Two', custom: '2',
		});
	});

	it('should have the options in nameOption', () => {
		const testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsOptions).eql([
			{ value: 'one', label: 'One', custom: '1' },
			{ value: 'two', label: 'Two', custom: '2' },
		]);
	});

	it('should have the options map in nameOptionsMap', () => {
		const testItem = new List.model({
			extraProps: 'two',
		});
		demand(testItem.extraPropsOptionsMap).eql({
			one: {
				value: 'one', label: 'One', custom: '1',
			},
			two: {
				value: 'two', label: 'Two', custom: '2',
			},
		});
	});

	it('should return a blank string when formatting an undefined value', () => {
		const testItem = new List.model();
		demand(List.fields.select.format(testItem)).be('');
	});

	it('should return a shallow clone of the options', () => {
		const clonedOps = List.fields.select.cloneOps();
		demand(clonedOps).eql(List.fields.select.ops);
		demand(clonedOps).not.equal(List.fields.select.ops);
	});
};
