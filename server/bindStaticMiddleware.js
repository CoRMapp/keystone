const express = require('express');

module.exports = function bindStaticMiddleware (keystone, app) {
	// the static option can be a single path, or array of paths
	// when set, we configure the express static middleware

	let staticPaths = keystone.get('static');
	const staticOptions = keystone.get('static options');

	if (typeof staticPaths === 'string') {
		staticPaths = [staticPaths];
	}

	if (Array.isArray(staticPaths)) {
		staticPaths.forEach((value) => {
			app.use(express.static(keystone.expandPath(value), staticOptions));
		});
	}
};
