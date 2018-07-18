var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	async.each(keystone.lists, function (list, next) {
		if (req.user.isTenant) {
			list.model.find({ app: req.applicationId }).countDocuments(function (err, count) {
				counts[list.key] = count;
				next(err);
			});
		} else {
			list.model.countDocuments(function (err, count) {
				counts[list.key] = count;
				next(err);
			});
		}
	}, function (err) {
		if (err) return res.apiError('database error', err);
		return res.json({
			counts: counts,
		});
	});
};
