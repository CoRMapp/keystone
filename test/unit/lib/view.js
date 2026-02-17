const demand = require('must');
const request = require('supertest');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const keystone = require('../../../index.js');

const getApp = () => {
	const app = keystone.express();
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true,
	}));
	app.use(methodOverride());
	return app;
};

describe('Keystone.View', function () {

	describe('new', function () {
		it('must be an instance of View', function (done) {
			const app = getApp();
			app.get('/', (req, res) => {
				const view = new keystone.View(req, res);
				view.must.be.an.instanceof(keystone.View);
				res.send('OK');
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});
	});

	describe('.render(callback)', function () {
		it('must call the callback function', function (done) {
			const app = getApp();
			app.get('/', (req, res) => {
				const view = new keystone.View(req, res);
				view.render(() => {
					res.send('OK');
				});
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});
	});

	describe('.render(callback)', function () {
		it('must pass (err, req, res) to the callback', function (done) {
			const app = getApp();
			app.get('/', (req, res) => {
				const view = new keystone.View(req, res);
				view.render((err, req2, res2) => {
					demand(err).not.exist();
					req2.must.equal(req);
					res2.must.equal(res);
					res.send('OK');
				});
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});
	});

	describe('.on(event, [match,] fn)', function () {

		it('must call init methods first', function (done) {
			const app = getApp();
			app.get('/', (req, res) => {
				const view = new keystone.View(req, res);
				let status = 'NOT OK';
				view.on('init', (next) => {
					status = 'OK';
					next();
				});
				view.render(() => {
					res.send(status);
				});
			});
			request(app)
				.get('/')
				.expect('OK', done);
		});

		const getApp_getAndPost = () => {
			const app = getApp();
			app.all('/', (req, res) => {
				const view = new keystone.View(req, res);
				let status = 'OK';
				view.on('get', (next) => {
					status = 'OK GET';
					next();
				});
				view.on('post', (next) => {
					status = 'OK POST';
					next();
				});
				view.render(() => {
					res.send(status);
				});
			});
			return app;
		};

		it('must call get actions correctly', function (done) {
			request(getApp_getAndPost())
				.get('/')
				.expect('OK GET', done);
		});

		it('must call post actions correctly', function (done) {
			request(getApp_getAndPost())
				.post('/')
				.expect('OK POST', done);
		});

		const getApp_conditionalGet = () => {
			const app = getApp();
			app.get('/', (req, res) => {
				const view = new keystone.View(req, res);
				let status = 'OK';
				view.on('get', { test: 'yes' }, (next) => {
					status = 'OK GET';
					next();
				});
				view.render(() => {
					res.send(status);
				});
			});
			return app;
		};

		it('must invoke get actions with matching query parameters', function (done) {
			request(getApp_conditionalGet())
				.get('/?test=yes')
				.expect('OK GET', done);
		});

		it('must skip get actions without matching query parameters', function (done) {
			request(getApp_conditionalGet())
				.get('/')
				.expect('OK', done);
		});

		const getApp_conditionalPostValue = () => {
			const app = getApp();
			app.post('/', (req, res) => {
				const view = new keystone.View(req, res);
				let status = 'OK';
				view.on('post', { test: 'yes' }, (next) => {
					status = 'OK POST';
					next();
				});
				view.render(() => {
					res.send(status);
				});
			});
			return app;
		};

		it('must invoke post actions with matching body data', function (done) {
			request(getApp_conditionalPostValue())
				.post('/')
				.send({ test: 'yes' })
				.expect('OK POST', done);
		});

		it('must skip post actions with non-matching body data', function (done) {
			request(getApp_conditionalPostValue())
				.post('/')
				.send({ test: 'no' })
				.expect('OK', done);
		});

		const getApp_conditionalPostTruthy = () => {
			const app = getApp();
			app.post('/', (req, res) => {
				const view = new keystone.View(req, res);
				let status = 'OK';
				view.on('post', { test: true }, (next) => {
					status = 'OK POST';
					next();
				});
				view.render(() => {
					res.send(status);
				});
			});
			return app;
		};

		it('must invoke post actions with body data present', function (done) {
			request(getApp_conditionalPostTruthy())
				.post('/')
				.send({ test: 'yes' })
				.expect('OK POST', done);
		});

		it('must skip post actions without matching body data', function (done) {
			request(getApp_conditionalPostTruthy())
				.post('/')
				.expect('OK', done);
		});

		const getApp_extRequest = () => {
			const app = getApp();
			app.get('/', (req, res) => {
				req.ext = { prop: 'value' };
				const view = new keystone.View(req, res);
				let status = 'NOT OK';
				view.on({ 'ext.prop': 'value' }, (next) => {
					status = 'OK';
					next();
				});
				view.render(() => {
					res.send(status);
				});
			});
			return app;
		};

		it('must invoke actions based on req properties', function (done) {
			request(getApp_extRequest())
				.get('/')
				.expect('OK', done);
		});

	});

});
