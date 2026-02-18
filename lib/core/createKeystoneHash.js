const crypto = require('crypto');
const forEach = require('lodash/forEach');

function createKeystoneHash () {
	const hash = crypto.createHash('md5');
	hash.update(this.version);

	forEach(this.lists, (list, key) => {
		hash.update(JSON.stringify(list.getOptions()));
	});

	return hash.digest('hex').slice(0, 6);
}

module.exports = createKeystoneHash;
