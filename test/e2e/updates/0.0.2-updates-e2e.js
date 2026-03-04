/*
	This updates finds the e2e Member and sets its isAdmin property to false.  
	e2e will check that setting in the admin UI.  
 */
const keystone = require('../../../index.js');

module.exports = function(done) {
	const Member = keystone.list('User');
	Member.model.findOneAndUpdate({isMember: true}, {$set: {isAdmin: false}}, {new: true})
		.then((member) => {
			if (!member) {
				console.error('***did not find a member');
			}
			done();
		})
		.catch((err) => {
			console.error(`***failed to read member: ${err}`);
			done(err);
		});
};
