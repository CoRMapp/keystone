const demand = require('must');
const PasswordType = require('../PasswordType');

exports.initList = (List) => {
	List.add({
		password: PasswordType,
	});
};

exports.getTestItems = () => [
	{},
	{ password: '' },
	{ password: ' ' },
	{ password: null },
	{ password: 'abc123' },
	{ password: 'ABC123' },
];

exports.testFilters = (List, filter) => {
	it('should filter for existance', (done) => {
		filter({
			password: {
				exists: true,
			},
		}, 'password', (results) => {
			demand(results.length).eql(3);
			// Make sure the passwords are hashed by checking that the length
			// of the returned strings is above the longest password specified
			// above
			demand(results[0].length).above(6);
			demand(results[1].length).above(6);
			demand(results[2].length).above(6);
			done();
		});
	});

	it('should filter for non-existance', (done) => {
		filter({
			password: {
				exists: false,
			},
		}, 'password', (results) => {
			demand(results.length).eql(3);
			demand(results[0]).be.undefined();
			demand(results[1]).be.undefined();
			demand(results[2]).be.undefined();
			done();
		});
	});
};
