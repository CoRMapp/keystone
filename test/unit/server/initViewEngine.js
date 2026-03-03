const express = require('express');
const demand = require('must');

const ReactEngine = require('react-engine');
const view = require('react-engine/lib/expressView');

const engine = ReactEngine.server.create({});

const init = require('../../../server/initViewEngine.js');

const options = {
	'name': 'foo',
	'brand': 'foo',

	'less': 'public',
	'static': 'public',
	'favicon': 'public/favicon.ico',
	'views': 'templates/views',
	'view engine': '.jsx',
	'custom engine': engine,
	'view': view,

	'auto update': true,
	'session': true,
	'auth': true,
	'user model': 'User',
	'cookie secret': 'Secret',
};

describe("initViewEngine", function () {
	const keystone = require('../../../index.js');
	const app = express();
	keystone.init(options);
	keystone.set('app', app);
	it("should set view", function () {
		demand(typeof app.get('view')).must.be('function');
	});
});
