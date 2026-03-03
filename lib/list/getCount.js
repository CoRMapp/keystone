const MODEL_CONFIG_KEY = 'ModelConfig';

function hasFilters(filters) {
	return !!(filters && Object.keys(filters).length);
}

async function loadConfigMap(list) {
	const modelConfigList = list.keystone.list(MODEL_CONFIG_KEY);
	if (!modelConfigList || !modelConfigList.model) return {};

	if (typeof modelConfigList.model.getConfigMap === 'function') {
		return modelConfigList.model.getConfigMap();
	}

	const doc = await modelConfigList.model.findOne({ name: 'default' }).lean();
	return (doc && doc.models) || {};
}

async function getCount(filters, options) {
	options = options || {};

	const normalizedFilters = filters || {};
	const hasFilter = hasFilters(normalizedFilters);
	let useEstimatedCount = false;

	if (!hasFilter && this.key !== MODEL_CONFIG_KEY) {
		const configMap = options.configMap || await loadConfigMap(this);
		useEstimatedCount = !!(configMap[this.key] && configMap[this.key].optimizedCounter);
	}

	if (useEstimatedCount) {
		return this.model.estimatedDocumentCount();
	}

	return this.model.countDocuments(normalizedFilters);
}

module.exports = getCount;
