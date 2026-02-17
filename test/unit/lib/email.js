const demand = require('must');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('Email', function () {
	/**
	 * SETUP
	 */
	let keystoneEmail;
	let Email;

	beforeEach(function () {
		// Make the tests work no matter if keystone-email is installed or not, spying on the mocked
		// keystone-email
		keystoneEmail = sinon.spy();
		Email = proxyquire('../../../lib/email', { 'keystone-email': keystoneEmail });
	});

	/**
	 * TESTS
	 */
	it('should require options to be passed in', function () {
		demand(Email).throw(/requires a templateName or options argument/);
	});
});
