/**
 * Configures and starts a Keystone app in encapsulated mode.
 *
 * Connects to the database, runs updates and listens for incoming requests.
 *
 * Events are fired during initialisation to allow customisation, including:
 *
 *   - onMount
 *   - onStart
 *   - onHttpServerCreated
 *   - onHttpsServerCreated
 *
 * If the events argument is a function, it is assumed to be the started event.
 *
 * @api public
 */

const async = require('async');

const dashes = '\n------------------------------------------------\n';

function start (events) {

	if (typeof events === 'function') {
		events = { onStart: events };
	}
	if (!events) events = {};

	const fireEvent = (name) => {
		if (typeof events[name] === 'function') {
			events[name]();
		}
	};

	process.on('uncaughtException', (e) => {
		if (e.code === 'EADDRINUSE') {
			console.log(`${dashes}${keystone.get('name')} failed to start: address already in use\nPlease check you are not already running a server on the specified port.\n`);
			process.exit();
		} else {
			console.log(e.stack || e);
			process.exit(1);
		}
	});

	this.initExpressApp();

	const keystone = this;
	const app = keystone.app;

	this.openDatabaseConnection(() => {

		fireEvent('onMount');

		const ssl = keystone.get('ssl');
		const unixSocket = keystone.get('unix socket');
		const startupMessages = [`KeystoneJS v${keystone.version} started:`];

		async.parallel([
			// HTTP Server
			(done) => {
				if (ssl === 'only' || unixSocket) return done();
				require('../../server/startHTTPServer')(keystone, app, (err, msg) => {
					fireEvent('onHttpServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
			// HTTPS Server
			(done) => {
				if (!ssl || unixSocket) return done();
				require('../../server/startSecureServer')(keystone, app, () => {
					fireEvent('onHttpsServerCreated');
				}, (err, msg) => {
					startupMessages.push(msg);
					done(err);
				});
			},
			// Unix Socket
			(done) => {
				if (!unixSocket) return done();
				require('../../server/startSocketServer')(keystone, app, (err, msg) => {
					fireEvent('onSocketServerCreated');
					startupMessages.push(msg);
					done(err);
				});
			},
		], (err, messages) => {
			if (keystone.get('logger')) {
				console.log(`${dashes}${startupMessages.join('\n')}${dashes}`);
			}
			fireEvent('onStart');
		});
	});

	return this;
}

module.exports = start;
