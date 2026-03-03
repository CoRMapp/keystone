var serializeModelConfig = require('./serialize');

module.exports = function (req, res) {
	var modelConfigList = req.keystone.list('ModelConfig');

	if (!modelConfigList || !modelConfigList.model || typeof modelConfigList.model.getSingleton !== 'function') {
		return res.status(404).json({ error: 'ModelConfig list is not available' });
	}

	modelConfigList.model.getSingleton()
		.then(function (doc) {
			return res.json({
				models: serializeModelConfig(req.keystone, doc),
			});
		})
		.catch(function (err) {
			return res.apiError('database error', err);
		});
};
