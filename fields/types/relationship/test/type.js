const demand = require('must');
const RelationshipType = require('../RelationshipType');

exports.initList = function (List) {
	// We can use relationships that refer to the same List to test
	List.add({
		single: { type: RelationshipType, ref: List.key },
		many: { type: RelationshipType, ref: List.key, many: true },
	});
};

exports.testFieldType = function (List) {

	let relatedItem = new List.model();
	before(async function () {
		relatedItem = await relatedItem.save();
	});

	describe('single', function () {
		it('should validate id input', function (done) {
			List.fields.single.validateInput({ single: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.single.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty input', function (done) {
			List.fields.single.validateInput({ single: '' }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.single.validateInput({ single: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate boolean input', function (done) {
			List.fields.single.validateInput({ single: true }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate item objects (object with id property)', function (done) {
			List.fields.single.validateInput({ single: relatedItem }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate object input without id', function (done) {
			List.fields.single.validateInput({ single: {} }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate array input', function (done) {
			List.fields.single.validateInput({ single: [] }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate required present input', function (done) {
			const testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate required present input with item', function (done) {
			const testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate required present input with existing value', function (done) {
			const testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, { single: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate required not present input', function (done) {
			const testItem = new List.model();
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should validate required input with existing value', function (done) {
			const testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, {}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate required blank input with existing value', function (done) {
			const testItem = new List.model({
				single: relatedItem.id,
			});
			List.fields.single.validateRequiredInput(testItem, { single: '' }, function (result) {
				demand(result).be.false();
				done();
			});
		});

		it('should save the provided value', async function () {
			const testItem = new List.model();
			await new Promise(function (resolve, reject) {
				List.fields.single.updateItem(testItem, { single: relatedItem.id }, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(String(persistedData.single)).equal(String(relatedItem.id));
		});

		it('should save the provided value with an item object', async function () {
			const testItem = new List.model();
			await new Promise(function (resolve, reject) {
				List.fields.single.updateItem(testItem, { single: relatedItem }, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(String(persistedData.single)).equal(String(relatedItem.id));
		});

		it('should clear the current value when provided null', async function () {
			const testItem = new List.model({
				single: relatedItem.id,
			});
			await testItem.save();
			await new Promise(function (resolve, reject) {
				List.fields.single.updateItem(testItem, { single: null }, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(persistedData.single).be.null();
		});

		it('should clear the current value when provided ""', async function () {
			const testItem = new List.model({
				single: relatedItem.id,
			});
			await testItem.save();
			await new Promise(function (resolve, reject) {
				List.fields.single.updateItem(testItem, { single: '' }, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(persistedData.single).be.null();
		});

		it('should not clear the current value when data object does not contain the field', async function () {
			const testItem = new List.model({
				single: relatedItem.id,
			});
			await testItem.save();
			await new Promise(function (resolve, reject) {
				List.fields.single.updateItem(testItem, {}, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(String(persistedData.single)).equal(String(relatedItem.id));
		});
	});

	describe('many', function () {
		it('should validate id input', function (done) {
			List.fields.many.validateInput({ many: relatedItem.id }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate empty array input', function (done) {
			List.fields.many.validateInput({ many: [] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', function (done) {
			List.fields.many.validateInput({ many: null }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate array input with ids', function (done) {
			List.fields.many.validateInput({ many: [relatedItem.id] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate arrays of item objects (object with id property)', function (done) {
			List.fields.many.validateInput({ many: [relatedItem] }, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined input', function (done) {
			List.fields.many.validateInput({}, function (result) {
				demand(result).be.true();
				done();
			});
		});

		it('should not clear the current values when data object does not contain the field', async function () {
			const testItem = new List.model({
				many: [relatedItem.id, relatedItem.id],
			});
			await testItem.save();
			await new Promise(function (resolve, reject) {
				List.fields.many.updateItem(testItem, {}, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(persistedData.many.length).equal(2);
			demand(String(persistedData.many[0])).equal(String(relatedItem.id));
			demand(String(persistedData.many[1])).equal(String(relatedItem.id));
		});

		it('should update the current values with the new values from the data object', async function () {
			const testItem = new List.model({
				many: [relatedItem.id, relatedItem.id, relatedItem.id],
			});
			await testItem.save();
			await new Promise(function (resolve, reject) {
				List.fields.many.updateItem(testItem, { many: [relatedItem.id, relatedItem.id] }, function (err) {
					if (err) return reject(err);
					resolve();
				});
			});
			const updatedItem = await testItem.save();
			const persistedData = await List.model.findById(updatedItem.id);
			demand(String(persistedData.many)).to.eql(String([relatedItem.id, relatedItem.id]));
		});
	});

	describe('addFilterToQuery', function () {
		it('should filter arrays', function () {
			const result = List.fields.single.addFilterToQuery({
				value: ['Some', 'strings'],
			});
			demand(result.single).eql({
				$in: ['Some', 'strings'],
			});
		});

		it('should convert a single string to an array and filter that', function () {
			const result = List.fields.single.addFilterToQuery({
				value: 'a string',
			});
			demand(result.single).eql({
				$in: ['a string'],
			});
		});

		it('should support inverted filtering with an array', function () {
			const result = List.fields.single.addFilterToQuery({
				value: ['Some', 'strings'],
				inverted: true,
			});
			demand(result.single).eql({
				$nin: ['Some', 'strings'],
			});
		});

		it('should filter by existance if no value is specified', function () {
			const result = List.fields.single.addFilterToQuery({});
			demand(result.single).be.null();
		});

		it('should filter by non-existance if no value is specified', function () {
			const result = List.fields.single.addFilterToQuery({
				inverted: true,
			});
			demand(result.single).eql({
				$ne: null,
			});
		});

		it('should filter by emptiness if many is true and no value is specified', function () {
			const result = List.fields.many.addFilterToQuery({});
			demand(result.many).eql({
				$size: 0,
			});
		});

		it('should filter by non-emptiness if many is true and no value is specified', function () {
			const result = List.fields.many.addFilterToQuery({
				inverted: true,
			});
			demand(result.many).eql({
				$not: {
					$size: 0,
				},
			});
		});
	});
};
