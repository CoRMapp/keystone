module.exports = function serializeModelConfig(keystone, doc) {
	var models = doc && doc.models ? doc.models : {};

	return Object.keys(models)
		.sort()
		.map(function (key) {
			var list = keystone.list(key);

			return {
				key: key,
				label: list ? list.label : key,
				path: list ? list.path : null,
				optimizedCounter: !!models[key].optimizedCounter,
			};
		});
};
