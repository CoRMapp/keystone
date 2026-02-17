const demand = require('must');
const sinon = require('sinon');
const assign = require('object-assign');
const language = require('../../../../lib/middleware/language');

const COOKIE_NAME_ARG = 0;
const COOKIE_LANGUAGE_ARG = 1;
const COOKIE_OPTIONS_ARG = 2;

const getNoop = () => function noop () {};

const mockRequest = function (acceptLanguage, storedLanguage) {
	const args = [].slice.call(arguments);
	const options = typeof args[0] === 'object' ? args[0] : {};

	if (Object.keys(options).length) {
		acceptLanguage = options.acceptLanguage;
	}

	return assign({
		locals: {},
		headers: {
			'accept-language': acceptLanguage
		},
		cookies: {
			language: storedLanguage
		},
		query: {},
		cookie: getNoop()
	}, options);
};

const mockResponse = () => ({
	redirect: sinon.spy(),
	cookie: sinon.spy()
});

const keystoneOptions = (options) => {
	options = assign({}, options);

	return {
		get: (key) => options[key]
	};
};

const mockApp = () => ({
	use: sinon.spy()
});

const getCookieName = (res) => res.cookie.getCall(0).args[COOKIE_NAME_ARG];

const getCookieLanguage = (res) => res.cookie.getCall(0).args[COOKIE_LANGUAGE_ARG];

const getCookieOptions = (res, option) => res.cookie.getCall(0).args[COOKIE_OPTIONS_ARG][option];

describe('language', function () {
	it('must allow Accept-Language selection', function () {
		const keystone = keystoneOptions({
			'language options': {
				'supported languages': ['en-US', 'zh-CN']
			}
		});
		const expected = 'zh-CN';
		const req = mockRequest({
			acceptLanguage: 'zh-CN;q=1,en-US;q=0.8'
		});
		const res = mockResponse();
		const middleware = language(keystone);

		middleware(req, res, getNoop());

		demand(getCookieLanguage(res)).eql(expected);
	});

	describe('must set language', function () {
		describe('with default options', function () {

			it('must create a language cookie', function (done) {

				const keystone = keystoneOptions();
				const res = mockResponse();
				const expected = 'en-US';

				language(keystone)(mockRequest(), res, (err) => {
					demand(err).be(undefined);
					demand(getCookieLanguage(res)).eql(expected);
					done();
				});
			});

		});

		describe('with custom cookie name', function () {
			it('must create a custom language cookie', function (done) {

				const keystone = keystoneOptions({
					'language options': {
						'language cookie': 'locale'
					}
				});
				const res = mockResponse();
				const expected = 'locale';

				language(keystone)(mockRequest(), res, (err) => {
					demand(err).be(undefined);
					demand(getCookieName(res)).eql(expected);
					done();
				});
			});

		});

		describe('with custom cookie options', function () {
			it('must create a custom language cookie', function (done) {
				const keystone = keystoneOptions({
					'language options': {
						'language cookie options': {
							maxAge: 24*3600*1000,
							secure: true
						}
					}
				});
				const res = mockResponse();
				const expectedSecure = true;
				const expectedMaxAge = 86400000;

				language(keystone)(mockRequest(), res, (err) => {
					demand(err).be(undefined);
					demand(getCookieOptions(res, 'secure')).eql(expectedSecure);
					demand(getCookieOptions(res, 'maxAge')).eql(expectedMaxAge);
					done();
				});
			});

		});
	});

	describe('must create language route', function () {
		describe('with default options', function () {
			it('must create /language route to change language', function () {

				const keystone = keystoneOptions();
				const req = mockRequest({
					acceptLanguage: 'zh-CN;q=0.8,en-US;q=1',
					storedLanguage: 'zh-CN',
					url: '/languages/en-US'
				});
				const res = mockResponse();
				const middleware = language(keystone);
				const expected = 'en-US';

				middleware(req, res, getNoop());

				demand(res.redirect.calledOnce).eql(true);
				demand(res.cookie.calledOnce).eql(true);
				demand(getCookieLanguage(res)).eql(expected);
			});
		});

		describe('with default options', function () {
			it('must create custom route to change language', function () {

				const keystone = keystoneOptions({
					'language options': {
						'language select url': '/locale/{language}'
					}
				});
				const req = mockRequest({
					acceptLanguage: 'zh-CN;q=0.8,en-US;q=1',
					storedLanguage: 'zh-CN',
					url: '/locale/en-US'
				});
				const res = mockResponse();
				const middleware = language(keystone);
				const expected = 'en-US';

				middleware(req, res, getNoop());

				demand(res.redirect.calledOnce).eql(true);
				demand(res.cookie.calledOnce).eql(true);
				demand(getCookieLanguage(res)).eql(expected);
			});
		});
	});

	describe('query string language setting', function () {
		describe('with default query name', function () {
			it('must allow query string language setting', function () {
				const keystone = keystoneOptions({
					'language options': {
						'supported languages': ['en-US', 'zh-CN']
					}
				});
				const expected = 'en-US';
				const req = mockRequest({
					acceptLanguage: 'zh-CN;1,en-US;q=0.8',
					query: {
						language: 'en-US'
					}
				});
				const res = mockResponse();
				const middleware = language(keystone);

				middleware(req, res, getNoop());

				demand(getCookieLanguage(res)).eql(expected);
			});
		});

		describe('with custom query name', function () {
			it('must allow query string language setting', function () {
				const keystone = keystoneOptions({
					'language options': {
						'supported languages': ['en-US', 'zh-CN'],
						'language query name': 'locale'
					}
				});
				const expected = 'en-US';
				const req = mockRequest({
					acceptLanguage: 'zh-CN;1,en-US;q=0.8',
					query: {
						locale: 'en-US'
					}
				});
				const res = mockResponse();
				const middleware = language(keystone);

				middleware(req, res, getNoop());

				demand(getCookieLanguage(res)).eql(expected);
			});
		});
	});
});
