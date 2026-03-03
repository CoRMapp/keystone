const keystone = require('../../../index.js');
const User = require('./User');

const Member = new keystone.List('Member', {
	inherits: User,
	track: true,
});

Member.register();

module.exports = Member;
