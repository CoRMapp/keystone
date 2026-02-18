const debug = require('debug')('keystone:core:closeDatabaseConnection');

module.exports = function closeDatabaseConnection (callback) {
	this.mongoose.disconnect(() => {
		debug('mongo connection closed');
		callback && callback();
	});
	return this;
};
