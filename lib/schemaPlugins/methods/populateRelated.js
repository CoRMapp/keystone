const _ = require('lodash');

module.exports = function populateRelated (rel, callback) {

	const item = this;

	if (typeof callback !== 'function') {
		throw new Error('List.populateRelated(rel, callback) requires a callback function.');
	}

	this.getRelated(rel, (err, results) => {
		_.forEach(results, (data, key) => {
			item[key] = data;
		});
		callback(err, results);
	}, true);

};
