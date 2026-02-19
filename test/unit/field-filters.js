const _ = require('lodash');
const fs = require('fs');
const keystone = require('../../index.js');
const path = require('path');

keystone.init();

const typesLoc = path.resolve('fields/types');
const types = fs.readdirSync(typesLoc);

function stringifyValue (value) {
	if (Array.isArray(value)) {
		return value.map(stringifyValue);
	}
	return value !== undefined ? String(value) : value;
}

types.forEach(function (name) {
	const filtersTestPath = typesLoc + '/' + name + '/test/filters.js';
	if (!fs.existsSync(filtersTestPath)) return;

	const listKey = name + 'FiltersTest';

	// nocreate option prevents warnings for required / not initial fields
	const List = keystone.List(listKey, { nocreate: true });
	const test = require(filtersTestPath);

	test.initList(List);
	List.register();

	const filter = function (filters, prop, stringify, callback) {
		if (typeof stringify === 'function' && !callback) {
			callback = stringify;
			stringify = false;
		}
		if (typeof prop === 'function' && !callback) {
			callback = prop;
			prop = null;
		}
		const where = List.addFiltersToQuery(filters);
		List.model.find(where).then(function (results) {
			if (prop) {
				results = _.map(results, prop);
				if (stringify) {
					results = results.map(stringifyValue);
				}
			}
			callback(results);
		});
	};

	describe('FieldType: ' + name.slice(0, 1).toUpperCase() + name.slice(1) + ': Filter', function () {
		before(async function () {
			await List.model.deleteMany({});
			const testItems = {};
			if (test.getTestItems.length < 2) {
				testItems[listKey] = test.getTestItems(List);
				return new Promise(function (resolve, reject) {
					keystone.createItems(testItems, function (err) {
						if (err) return reject(err);
						resolve();
					});
				});
			} else {
				const data = await new Promise(function (resolve, reject) {
					test.getTestItems(List, function (err, data) {
						if (err) return reject(err);
						resolve(data);
					});
				});
				testItems[listKey] = data;
				return new Promise(function (resolve, reject) {
					keystone.createItems(testItems, function (err) {
						if (err) return reject(err);
						resolve();
					});
				});
			}
		});
		test.testFilters(List, filter);
	});
});
