const keystone = require('../../index.js');
const request = require('supertest');
const _ = require('lodash');
const { exec } = require('child_process');

const testApp = (request, page, server, done) => {
	server = server || keystone.httpServer;
	request
		.get(page || '/')
		.expect(200)
		.end((err, res) => {
			if (err) return done(err);
			server.close();
			done();
		});
};

const routes = (app) => {
	app.get('*', (req, res) => {
		res.sendStatus(200);
	});
};

exports.startHttp = (cb) => {
	keystone.app = false;
	keystone.mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'auth': false,
		'port': '4000',
	})
	.set('routes', routes)
	.start({
		onStart () {
			if (typeof cb === 'function') {
				testApp(request('http://@:4000'), false, keystone.httpServer, (err) => {
					if (err) {
						console.log(err);
						return cb(false);
					}
					return cb(true);
				});
			}
		},
	});
};

exports.startHttps = (cb) => {
	keystone.app = false;
	keystone.mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'ssl': 'only',
		'ssl key': './certs/server.ca.key',
		'ssl cert': './certs/server.crt',
		'auth': false,
		'ssl port': '4001',
	})
	.set('routes', routes)
	.start({
		onStart () {
			if (typeof cb === 'function') {
				testApp(request('https://@:4001'), '/', keystone.httpsServer, (err) => {
					if (err) {
						return cb(false);
					}
					return cb(true);
				});
			}
		},
	});
};

exports.startSocket = (cb) => {
	keystone.app = false;
	keystone.mongoose = false;
	keystone.init({
		'cookie secret': 'test',
		'unix socket': '/tmp/testKeystoneUnixSocket',
		'auth': false,
		'name': 'Test Site',
	})
	.set('routes', routes)
	.start({
		onStart () {
			testApp(request(keystone.app), '/', keystone.httpServer, (err) => {
				if (err) {
					return cb(false);
				}
				return cb(true);
			});
		},
	});
};
