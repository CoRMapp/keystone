var serializeModelConfig = require('./serialize');

function normalizeModelsInput(models) {
	if (Array.isArray(models)) {
		return models.reduce(function (acc, model) {
			if (!model || !model.key) return acc;

			acc[model.key] = {
				optimizedCounter: !!model.optimizedCounter,
			};

			return acc;
		}, {});
	}

	return models || {};
}

module.exports = function (req, res) {
	var modelConfigList = req.keystone.list('ModelConfig');

	if (!modelConfigList || !modelConfigList.model || typeof modelConfigList.model.getSingleton !== 'function') {
		return res.status(404).json({ error: 'ModelConfig list is not available' });
	}

	modelConfigList.model.getSingleton()
		.then(function (doc) {
			var models = normalizeModelsInput(req.body.models);
			var buildModelsConfig = modelConfigList.model.buildModelsConfig || function (value) { return value; };

			doc.models = buildModelsConfig(models);
			doc.markModified('models');

			return doc.save();
		})
		.then(function (doc) {
			return res.json({
				models: serializeModelConfig(req.keystone, doc),
			});
		})
		.catch(function (err) {
			return res.apiError('database error', err);
		});
};
