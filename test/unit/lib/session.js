const keystone = require('../../../index.js');
const sinon = require('sinon');
const demand = require('must');

describe('Keystone.session', function () {

	describe('keystone.session.signinWithUser()', function () {
		// mock args for signinWithUser(user, req, res, onSuccess)
		const res = { cookie: sinon.stub() };
		const onSuccess = sinon.stub();
		let user;
		let req;

		function resetMocks () {
			user = {
				id: 'USERID',
				password: 'PASSWORD',
			};
			req = {
				user: null,
				session: {
					userId: null,
					regenerate: function (callback) {
						callback();
					},
				},
			};
		}

		before(function () {
			keystone.get('cookie secret', 'SECRET');
			keystone.set('user model', 'User');
		});

		beforeEach(function () {
			resetMocks();
			sinon.spy(req.session, 'regenerate');
		});

		afterEach(function () {
			req.session.regenerate.resetHistory();
			res.cookie.resetHistory();
			onSuccess.resetHistory();
		});

		describe('with valid args, "cookie signin" on', function () {

			it('should regenerate session, set user, session.userId, and res.cookie', function () {
				keystone.set('cookie signin', true);
				keystone.session.signinWithUser(user, req, res, onSuccess);

				sinon.assert.calledOnce(req.session.regenerate);

				req.user.must.equal(user);
				req.session.userId.must.equal(user.id);

				sinon.assert.calledOnce(res.cookie);
				sinon.assert.calledWith(res.cookie, 'keystone.uid');

				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});

		});

		describe('with valid args, "cookie signin" off', function () {

			it('should regenerate session, set user, session.userId', function () {
				keystone.set('cookie signin', false);
				keystone.session.signinWithUser(user, req, res, onSuccess);

				sinon.assert.calledOnce(req.session.regenerate);

				req.user.must.equal(user);
				req.session.userId.must.equal(user.id);

				sinon.assert.callCount(res.cookie, 0);

				sinon.assert.calledOnce(onSuccess);
				sinon.assert.calledWithExactly(onSuccess, user);
			});

		});

		describe('with invalid args', function () {
			it('should error when called less then 4 args', function () {
				function callWithNoArgs () {
					keystone.session.signinWithUser();
				}
				callWithNoArgs.must.throw('keystone.session.signinWithUser requires user, req and res objects, and an onSuccess callback.');

				function callWithOneArg () {
					keystone.session.signinWithUser(user);
				}
				callWithOneArg.must.throw('keystone.session.signinWithUser requires user, req and res objects, and an onSuccess callback.');

				function callWithTwoArgs () {
					keystone.session.signinWithUser(user, req);
				}
				callWithTwoArgs.must.throw('keystone.session.signinWithUser requires user, req and res objects, and an onSuccess callback.');

				function callWithThreeArgs () {
					keystone.session.signinWithUser(user, req, res);
				}
				callWithThreeArgs.must.throw('keystone.session.signinWithUser requires user, req and res objects, and an onSuccess callback.');
			});

			it('should error when user arg is not an object', function () {
				function callWithInvalidUser () {
					keystone.session.signinWithUser('user', req, res, onSuccess);
				}
				callWithInvalidUser.must.throw('keystone.session.signinWithUser requires user to be an object.');
			});

			it('should error when req arg is not an object', function () {
				function callWithInvalidReq () {
					keystone.session.signinWithUser(user, 'req', res, onSuccess);
				}
				callWithInvalidReq.must.throw('keystone.session.signinWithUser requires req to be an object.');
			});

			it('should error when res arg is not an object', function () {
				function callWithInvalidRes () {
					keystone.session.signinWithUser(user, req, 'res', onSuccess);
				}
				callWithInvalidRes.must.throw('keystone.session.signinWithUser requires res to be an object.');
			});

			it('should error when onSuccess arg is not a function', function () {
				function callWithInvalidCallback () {
					keystone.session.signinWithUser(user, req, res, 'onSuccess');
				}
				callWithInvalidCallback.must.throw('keystone.session.signinWithUser requires onSuccess to be a function.');
			});

		});

	});

	// TODO: need more test for keystone.session.signin()
	describe('keystone.session.signin()', function () {

		describe('case-insensitive email lookup', function () {

			before(function () {
				const self = this;
				this.onSuccess = sinon.stub();
				this.onFailure = sinon.stub();

				// simulate User model - findOne must return a thenable (Mongoose 7+)
				this.User = {
					model: {
						findOne: sinon.spy(function (query) {
							self.query = query;
							const email = 'test@test.com';
							self.query.match = self.query.email.test(email);
							if (self.query.match) {
								return Promise.resolve(self.user);
							}
							return Promise.resolve(null);
						}),
					},
				};

				// simulate user instance
				this.user = {
					_: {
						password: {
							compare: sinon.spy(function (password, callback) {
								callback(null, true);
							}),
						},
					},
				};

				keystone.set('user model', 'User');
				sinon.stub(keystone, 'list').withArgs('User').returns(this.User);
				sinon.stub(keystone.session, 'signinWithUser').callsArg(3);
			});

			after(function () {
				keystone.list.restore();
				keystone.session.signinWithUser.restore();
			});

			afterEach(function () {
				delete this.query;

				this.User.model.findOne.resetHistory();
				this.onSuccess.resetHistory();
				this.onFailure.resetHistory();

				keystone.list.resetHistory();
				keystone.session.signinWithUser.resetHistory();
			});

			it('should match email with mixed case', function (done) {
				const lookup = { email: 'Test@Test.Com', password: 'password' };
				keystone.session.signin(lookup, null, null, function () {
					// make sure .findOne() is called with a regular expression
					sinon.assert.calledOnce(this.User.model.findOne);
					this.User.model.findOne.getCall(0).args[0].email.must.be.instanceof(RegExp);
					// make sure .signinWithUser() is called on successful match
					sinon.assert.calledOnce(keystone.session.signinWithUser);
					done();
				}.bind(this), this.onFailure);

			});

			it('should not match email when invalid', function (done) {
				const lookup = { email: 'xxx', password: 'password' };
				keystone.session.signin(lookup, null, null, this.onSuccess, function (err) {
					// make sure .findOne() was not called
					sinon.assert.notCalled(this.User.model.findOne);
					err.must.be.an.instanceof(Error);
					// make sure .signinWithUser() is NOT called on failed match
					sinon.assert.notCalled(keystone.session.signinWithUser);
					done();
				}.bind(this));
			});

			it('should not match email when just a regex', function (done) {
				const lookup = { email: '\\.', password: 'password' };
				keystone.session.signin(lookup, null, null, this.onSuccess, function (err) {
					// make sure .findOne() was not called
					sinon.assert.notCalled(this.User.model.findOne);
					err.must.be.an.instanceof(Error);
					// make sure .signinWithUser() is NOT called on failed match
					sinon.assert.notCalled(keystone.session.signinWithUser);
					done();
				}.bind(this));
			});

		});

	});

	describe('keystone.session.signout()', function () {

		const res = { cookie: sinon.stub(), clearCookie: sinon.stub() };
		let user;
		let req;

		function resetMocks () {
			user = {
				id: 'USERID',
				password: 'PASSWORD',
			};
			req = {
				user: null,
				session: {
					userId: null,
					regenerate: function (callback) {
						// Simulate express-session regenerate: clear session data
						var regenerate = this.regenerate;
						for (var key in req.session) {
							if (key !== 'regenerate') {
								delete req.session[key];
							}
						}
						req.session.regenerate = regenerate;
						callback();
					},
				},
			};
		}

		before(function () {
			keystone.get('cookie secret', 'SECRET');
			keystone.set('user model', 'User');
		});

		beforeEach(function () {
			resetMocks();
			sinon.spy(req.session, 'regenerate');
		});

		afterEach(function () {
			req.session.regenerate.resetHistory();
			res.cookie.resetHistory();
			res.clearCookie.resetHistory();
		});

		it('should unset user, session.userId and cookie', function (done) {
			keystone.set('cookie signin', true);
			keystone.session.signinWithUser(user, req, res, function () {
				keystone.session.signout(req, res, function () {
					try {
						demand(req.user).be.null();
						demand(req.session.userId).be.undefined();

						sinon.assert.calledOnce(res.clearCookie);
						sinon.assert.calledWith(res.clearCookie, 'keystone.uid');
						done();
					} catch (err) {
						done(err);
					}
				});
			});
		});

	});

	// TODO: test keystone.session.persist()
	// describe('keystone.session.persist()');

	// TODO: test keystone.session.keystoneAuth()
	// describe('keystone.session.keystoneAuth()');

});
