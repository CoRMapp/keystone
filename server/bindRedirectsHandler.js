module.exports = function bindRedirectsHandler (keystone, app) {
	if (Object.keys(keystone._redirects).length) {
		app.use((req, res, next) => {
			if (keystone._redirects[req.path]) {
				res.redirect(keystone._redirects[req.path]);
			} else {
				next();
			}
		});
	}
};
