const keystone = require('../../index.js');
const demand = require('must');
const path = require('path');
const getExpressApp = require('../helpers/getExpressApp');

describe('Keystone "module root" setting', function () {
	before(function () {
		getExpressApp();
	});

	describe('default', function () {
		it('should be set to the path where keystone was required', function () {
			demand(keystone.get('module root')).to.be(__dirname);
		});

		it('should be used by keystone.getPath()', function () {
			const viewsPath = 'relative/path/to/views';
			keystone.set('views', viewsPath);
			demand(keystone.getPath('views')).to.be(path.resolve(__dirname, viewsPath));
		});
	});

	describe('custom with relative path', function () {
		const customPath = '../..';

		before(function () {
			keystone.set('module root', customPath);
		});

		it('should return the custom configured path', function () {
			demand(keystone.get('module root')).to.be(path.resolve(__dirname, customPath));
		});

		it('should be used by keystone.getPath() to resolve relative paths', function () {
			const viewsPath = 'relative/path/to/views';
			keystone.set('views', viewsPath);
			demand(keystone.getPath('views')).to.be(path.resolve(__dirname, customPath, viewsPath));
		});
	});

	describe('custom with absolute path', function () {
		const customPath = path.resolve(__dirname, '../..');

		before(function () {
			keystone.set('module root', customPath);
		});

		it('should return the custom configured path', function () {
			demand(keystone.get('module root')).to.be(customPath);
		});

		it('should be used by keystone.getPath() to resolve relative paths', function () {
			const viewsPath = 'relative/path/to/views';
			keystone.set('views', viewsPath);
			demand(keystone.getPath('views')).to.be(path.resolve(customPath, viewsPath));
		});
	});
});
