const _ = require('lodash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const debug = require('debug')('keystone:core:initExpressSession');
const safeRequire = require('../safeRequire');

module.exports = function initExpressSession (mongoose) {

	if (this.expressSession) return this;

	// Initialise and validate session options
	if (!this.get('cookie secret')) {
		console.error('\nKeystoneJS Configuration Error:\n\nPlease provide a `cookie secret` value for session encryption.\n');
		process.exit(1);
	}
	let sessionOptions = this.get('session options');

	if (typeof sessionOptions !== 'object') {
		sessionOptions = {};
	}
	if (!sessionOptions.key) {
		sessionOptions.key = 'this.sid';
	}
	if (!sessionOptions.resave) {
		sessionOptions.resave = false;
	}
	if (!sessionOptions.saveUninitialized) {
		sessionOptions.saveUninitialized = false;
	}
	if (!sessionOptions.secret) {
		sessionOptions.secret = this.get('cookie secret');
	}

	sessionOptions.cookieParser = cookieParser(this.get('cookie secret'));

	let sessionStore = this.get('session store');

	if (typeof sessionStore === 'function') {
		sessionOptions.store = sessionStore(session);
	} else if (sessionStore) {

		const sessionStoreOptions = this.get('session store options') || {};

		// Perform any session store specific configuration or exit on an unsupported session store

		if (sessionStore === 'mongo') {
			sessionStore = 'connect-mongo';
		} else if (sessionStore === 'redis') {
			sessionStore = 'connect-redis';
		}

		switch (sessionStore) {
			case 'connect-mongo':
				debug('using connect-mongo session store');
				_.defaults(sessionStoreOptions, {
					collectionName: 'app_sessions',
					client: mongoose.connection.getClient(),
				});
				break;

			case 'connect-redis':
				debug('using connect-redis session store');
				break;

			default:
				console.error(
					`\nERROR: unsupported session store ${sessionStore}.`
					+ '\n'
					+ '\nSee http://thisjs.com/docs/configuration#options-database for details.'
					+ '\n');
				process.exit(1);
				break;
		}

		// Initialize the session store
		if (sessionStore === 'connect-mongo') {
			const MongoStore = safeRequire('connect-mongo', `${this.get('session store')} as a \`session store\` option`);
			sessionOptions.store = MongoStore.create(sessionStoreOptions);
		} else {
			const SessionStore = safeRequire(sessionStore, `${this.get('session store')} as a \`session store\` option`)(session);
			sessionOptions.store = new SessionStore(sessionStoreOptions);
		}
	}

	// expose initialised session and options
	this.set('session options', sessionOptions);
	this.expressSession = session(sessionOptions);

	return this;
};
