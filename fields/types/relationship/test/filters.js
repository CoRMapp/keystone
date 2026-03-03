const demand = require('must');
const RelationshipType = require('../RelationshipType');

exports.initList = function (List) {
	List.add({
		single: { type: RelationshipType, ref: List.key },
	});
};

let items;

exports.getTestItems = function (List, callback) {
	const data = {
		jed: new List.model({ name: 'Jed' }),
		max: new List.model({ name: 'Max' }),
	};

	Promise.all([
		data.jed.save(),
		data.max.save(),
	]).then(function (results) {
		items = {
			jed: String(results[0].id),
			max: String(results[1].id),
		};
		callback(null, [
			{ single: items.jed },
			{ single: items.max },
		]);
	}).catch(callback);
};

exports.testFilters = function (List, filter) {
	describe('match', function () {
		it('should find exact matches', function (done) {
			filter({
				single: {
					value: items.jed,
				},
			}, 'single', true, function (results) {
				demand(results).eql([items.jed]);
				done();
			});
		});

		it('should invert exact matches', function (done) {
			filter({
				single: {
					inverted: true,
					value: items.jed,
				},
			}, 'single', true, function (results) {
				demand(results).eql([undefined, undefined, items.max]);
				done();
			});
		});

		it.skip('should find multiple matches', function (done) {
			filter({
				single: {
					value: [items.jed, items.max],
				},
			}, 'single', true, function (results) {
				demand(results).eql([items.jed, items.max]);
				done();
			});
		});

		it('should find empty relationships', function (done) {
			filter({
				single: {
					value: '',
				},
			}, 'single', true, function (results) {
				demand(results).eql([undefined, undefined]);
				done();
			});
		});
	});
};
