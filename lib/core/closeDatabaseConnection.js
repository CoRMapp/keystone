const debug = require('debug')('keystone:core:closeDatabaseConnection');

module.exports = function closeDatabaseConnection (callback) {
	this.mongoose.disconnect()
		.then(() => {
			debug('mongo connection closed');
			callback && callback();
		})
		.catch((err) => {
			callback && callback(err);
		});
	return this;
};
