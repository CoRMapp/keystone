const _ = require('lodash');

module.exports = (doc, ret) => {
	if (doc._populatedRelationships) {
		_.forEach(doc._populatedRelationships, (on, key) => {
			if (!on) return;
			ret[key] = doc[key];
		});
	}
};
