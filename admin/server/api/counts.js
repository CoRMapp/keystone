var async = require('async');

module.exports = function (req, res) {
	var keystone = req.keystone;
	var counts = {};
	var modelConfigList = keystone.list('ModelConfig');
	var configMapPromise = modelConfigList && modelConfigList.model && typeof modelConfigList.model.getConfigMap === 'function'
		? modelConfigList.model.getConfigMap()
		: Promise.resolve({});

	configMapPromise
		.then(function (configMap) {
			async.each(
				keystone.lists,
				function (list, next) {
					list.getCount({}, { configMap: configMap })
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
		})
		.catch(function (err) {
			return res.apiError('database error', err);
		});
};
