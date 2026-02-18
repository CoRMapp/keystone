const _ = require('lodash');

/**
 * Retrieves orphaned lists (those not in a nav section)
 */

function getOrphanedLists () {
	if (!this.nav) {
		return [];
	}
	return _.filter(this.lists, (list, key) => {
		if (list.get('hidden')) return false;
		return (!this.nav.by.list[key]) ? list : false;
	});
}

module.exports = getOrphanedLists;
