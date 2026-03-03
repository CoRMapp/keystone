const compression = require('compression');
const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const morgan = require('morgan');

const language = require('../lib/middleware/language');

module.exports = function createApp (keystone, express) {

	if (!keystone.app) {
		if (!express) {
			express = require('express');
		}
		keystone.app = express();
	}

	const app = keystone.app;
	require('./initLetsEncrypt')(keystone, app);
	require('./initSslRedirect')(keystone, app);

	keystone.initDatabaseConfig();
	keystone.initExpressSession(keystone.mongoose);

	require('./initTrustProxy')(keystone, app);
	require('./initViewEngine')(keystone, app);
	require('./initViewLocals')(keystone, app);
	require('./bindIPRestrictions')(keystone, app);

	// Compress response bodies
	if (keystone.get('compress')) {
		app.use(compression());
	}

	// Pre static config
	if (typeof keystone.get('pre:static') === 'function') {
		keystone.get('pre:static')(app);
	}
	app.use((req, res, next) => {
		keystone.callHook('pre:static', req, res, next);
	});

	// Serve static assets

	if (keystone.get('favicon')) {
		app.use(favicon(keystone.getPath('favicon')));
	}

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Static Router for public resources
	if (!keystone.get('headless')) {
		app.use(`/${keystone.get('admin path')}`, require('../admin/server').createStaticRouter(keystone));
	}

	require('./bindLessMiddleware')(keystone, app);
	require('./bindSassMiddleware')(keystone, app);
	require('./bindStylusMiddleware')(keystone, app);
	require('./bindStaticMiddleware')(keystone, app);
	require('./bindSessionMiddleware')(keystone, app);

	// Log dynamic requests
	app.use((req, res, next) => {
		keystone.callHook('pre:logger', req, res, next);
	});
	// Bind default logger (morgan)
	if (keystone.get('logger')) {
		const loggerOptions = keystone.get('logger options');
		if (loggerOptions && typeof loggerOptions.tokens === 'object') {
			for (const [key, value] of Object.entries(loggerOptions.tokens)) {
				if (typeof value === 'function') {
					morgan.token(key, value);
				}
			}
		}

		app.use(morgan(keystone.get('logger'), loggerOptions));
	}
	// Bind custom logging middleware
	if (keystone.get('logging middleware')) {
		app.use(keystone.get('logging middleware'));
	}

	// unless the headless option is set (which disables the Admin UI),
	// bind the Admin UI's Dynamic Router
	if (!keystone.get('headless')) {
		if (typeof keystone.get('pre:admin') === 'function') {
			keystone.get('pre:admin')(app);
		}
		app.use((req, res, next) => {
			keystone.callHook('pre:admin', req, res, next);
		});
		app.use(`/${keystone.get('admin path')}`, require('../admin/server').createDynamicRouter(keystone));
	}

	// Pre bodyparser middleware
	if (typeof keystone.get('pre:bodyparser') === 'function') {
		keystone.get('pre:bodyparser')(app);
	}
	app.use((req, res, next) => {
		keystone.callHook('pre:bodyparser', req, res, next);
	});

	require('./bindBodyParser')(keystone, app);
	app.use(methodOverride());

	// Set language preferences
	const languageOptions = keystone.get('language options') || {};
	if (!languageOptions.disable) {
		app.use(language(keystone));
	}

	// Add 'X-Frame-Options' to response header for ClickJacking protection
	if (keystone.get('frame guard')) {
		app.use(require('../lib/security/frameGuard')(keystone));
	}

	// Pre route config
	if (typeof keystone.get('pre:routes') === 'function') {
		keystone.get('pre:routes')(app);
	}
	app.use((req, res, next) => {
		keystone.callHook('pre:routes', req, res, next);
	});

	// Configure application routes
	const appRouter = keystone.get('routes');
	if (typeof appRouter === 'function') {
		if (appRouter.length === 3) {
			app.use(appRouter);
		} else {
			appRouter(app);
		}
	}


	require('./bindRedirectsHandler')(keystone, app);

	// Error config
	if (typeof keystone.get('pre:error') === 'function') {
		keystone.get('pre:error')(app);
	}
	app.use((req, res, next) => {
		keystone.callHook('pre:error', req, res, next);
	});
	require('./bindErrorHandlers')(keystone, app);

	return app;

};
