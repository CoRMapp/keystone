const async = require('async');
const keystone = require('../..');
const ReactEngine = require('react-engine');
const engine = ReactEngine.server.create({});
const request = require('superagent');
const moment = require('moment');
const mongoose = require('mongoose');
const path = require('path');
const keystoneNightwatchE2e = require('keystone-nightwatch-e2e');

// Set app-specific env for nightwatch session
process.env.KNE_TEST_PATHS = 'test/e2e/adminUI/tests';
process.env.KNE_EXCLUDE_TEST_PATHS = 'test/e2e/adminUI/tests/group006Fields/commonFieldTestUtils.js,test/e2e/adminUI/tests/group999FixMe/*';

// determine the mongo uri and database name
const dbName = `/e2e${process.env.KEYSTONEJS_PORT || 3000}`;
const mongoUri = `mongodb://${process.env.KEYSTONEJS_HOST || 'localhost'}:27017${dbName}`;

// Function that drops the test database before starting testing
function dropTestDatabase (done) {
	console.log(`${moment().format('HH:mm:ss:SSS')} e2e: dropping test database: ${mongoUri}`);

	mongoose.connect(mongoUri)
		.then(() => {
			return mongoose.connection.db.dropDatabase();
		})
		.then(() => {
			console.log(`${moment().format('HH:mm:ss:SSS')} e2e: dropped test database: ${mongoUri}`);
			return mongoose.connection.close();
		})
		.then(() => {
			done();
		})
		.catch((err) => {
			console.error(`${moment().format('HH:mm:ss:SSS')} e2e: failed to connect to mongo: ${err}`);
			done(err);
		});
}

// Function that checks if keystone is ready before starting testing
function checkKeystoneReady (done) {
	async.retry({
		times: 10,
		interval: 3000,
	}, (done, result) => {
		console.log(`${moment().format('HH:mm:ss:SSS')} e2e: checking if KeystoneJS ready for request`);
		request
			.get(`http://${keystone.get('host')}:${keystone.get('port')}/keystone`)
			.end(done);
	}, (err, result) => {
		if (!err) {
			console.log(`${moment().format('HH:mm:ss:SSS')} e2e: KeystoneJS Ready!`);
			done();
		} else {
			console.log(`${moment().format('HH:mm:ss:SSS')} e2e: KeystoneJS does not appear ready!`);
			done(err);
		}
	});
}

// Function that starts the e2e common framework
function runE2E (options, done) {
	console.log(`${moment().format('HH:mm:ss:SSS')} e2e: starting tests...`);

	keystoneNightwatchE2e.startE2E(options, done);
}

// Function that starts keystone
function runKeystone (cb) {
	console.log(`${moment().format('HH:mm:ss:SSS')} e2e: starting KeystoneJS...`);

	// initialize keystone
	keystone.init({
		'name': 'e2e',
		'brand': 'e2e',

		'host': process.env.KEYSTONEJS_HOST || 'localhost',
		'port': process.env.KEYSTONEJS_PORT || 3000,

		'mongo': mongoUri,

		'static': 'frontend',
		'favicon': 'adminuiCustom/favicon.ico',
		'less': 'frontend',
		'views': 'frontend',
		'view engine': 'jade',

		'auto update': true,
		'session': true,
		'auth': true,
		'user model': 'User',
		'cookie secret': 'Secret',
		'adminui custom styles': 'adminuiCustom/styles.less',

		'cloudinary config': 'cloudinary://api_key:api_secret@cloud_name',
	});

	// import app models
	keystone.import('models');

	// setup any custom routes
	keystone.set('routes', require('./routes'));

	// setup application adminui navigation
	keystone.set('nav', {
		'access': [
			'users',
		],
		'fields': [
			'booleans',
			'cloudinary-images',
			'cloudinary-image-multiples',
			'codes',
			'colors',
			'dates',
			'date-arrays',
			'datetimes',
			'emails',
			'files',
			'geo-points',
			'htmls',
			'keys',
			'locations',
			'markdowns',
			'money',
			'names',
			'numbers',
			'number-arrays',
			'passwords',
			'relationships',
			'selects',
			'texts',
			'text-arrays',
			'textareas',
			'urls',
		],
		'Miscs': [
			'date-field-maps',
			'depends-ons',
			'no-default-columns',
			'inline-relationships',
			'many-relationships',
			'hidden-relationships',
			'source-relationships',
			'target-relationships',
		],
	});

	keystone.start({
		onMount: () => {
			console.log(`${moment().format('HH:mm:ss:SSS')} e2e: KeystoneJS mounted Successfuly`);
		},
		onStart: () => {
			console.log(`${moment().format('HH:mm:ss:SSS')} e2e: KeystoneJS Started Successfully`);
			cb();
		},
	});
}

// Function that bootstraps the e2e test service
function start () {
	const runTests = process.argv.indexOf('--notest') === -1;
	const dropDB = process.argv.indexOf('--nodrop') === -1;

	async.series([

		(cb) => {
			if (dropDB) {
				dropTestDatabase(cb);
			}	else {
				cb();
			}
		},

		(cb) => {
			runKeystone(cb);
		},

		(cb) => {
			checkKeystoneReady(cb);
		},

		(cb) => {
			if (runTests) {
				runE2E({
					keystone: keystone,
				}, cb);
			} else {
				cb();
			}
		},

	], (err) => {
		let exitProcess = false;
		let exitCode = 0;
		if (err) {
			console.error(`${moment().format('HH:mm:ss:SSS')} e2e: ${err}`);
			exitProcess = true;
			exitCode = 1;
		}
		if (runTests) {
			exitProcess = true;
		}
		if (exitProcess) {
			console.error(`${moment().format('HH:mm:ss:SSS')} e2e: exiting`);
			process.exit(exitCode);
		}
	});
}

start();
