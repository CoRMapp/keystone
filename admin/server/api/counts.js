const async = require('async');

module.exports = function (req, res) {
	const keystone = req.keystone;
	const counts = {};
	async.each(
		keystone.lists,
		function (list, next) {
			list.model
				.countDocuments()
				.then(function (count) {
					counts[list.key] = count;
					next();
				})
				.catch(next);
		},
		function (err) {
			if (err) return res.apiError('database error', err);
			return res.json({
				counts: counts,
			});
		}
	);
};
