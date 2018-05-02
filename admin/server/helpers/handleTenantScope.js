module.exports = function handleTenantScope (req, res, next) {
	if (req.user.isTenant) {
		var App = req.keystone.lists['App'];
		App.model.findOne({ tenant: req.user._id }).exec(function (err, app) {
			if (err) return next(err);
			req.applicationId = app._id;
			return next();
		});
	} else {
		next();
	}
};
