const demand = require('must');
const PasswordType = require('../PasswordType');

exports.initList = (List) => {
	List.add({
		password: PasswordType,
		minChar: {
			type: PasswordType,
			min: 6,
		},

		maxFalse: {
			type: PasswordType,
			max: false,
		},

		digitChar: {
			type: PasswordType,
			complexity: {
				digitChar: true,
			},
		},

		spChar: {
			type: PasswordType,
			complexity: {
				spChar: true,
			},
		},

		asciiChar: {
			type: PasswordType,
			complexity: {
				asciiChar: true,
			},
		},

		lowChar: {
			type: PasswordType,
			complexity: {
				lowChar: true,
			},
		},

		upperChar: {
			type: PasswordType,
			complexity: {
				upperChar: true,
			},
		},
	});
};

exports.testFieldType = (List) => {
	describe('updateItem', () => {
		it('should update password if specified', (done) => {
			const testItem = new List.model();
			List.fields.password.updateItem(testItem, {
				password: 'asdf',
			}, () => {
				demand(testItem.password).be('asdf');
				done();
			});
		});

		it('should update password with hash if specified', (done) => {
			const testItem = new List.model();
			List.fields.password.updateItem(testItem, {
				password_hash: '12asdf34',
			}, () => {
				demand(testItem.password).be('12asdf34');
				done();
			});
		});

		it('should update password if both password and hash specified', (done) => {
			const testItem = new List.model();
			List.fields.password.updateItem(testItem, {
				password: 'asdf',
				password_hash: '12asdf34',
			}, () => {
				demand(testItem.password).be('asdf');
				done();
			});
		});

		it('should clear password if passed password is null', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password: null,
			}, () => {
				demand(testItem.password).be.null();
				done();
			});
		});

		it('should clear password if passed hash is null', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password_hash: null,
			}, () => {
				demand(testItem.password).be.null();
				done();
			});
		});

		it('should clear password if passed password is empty string', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password: '',
			}, () => {
				demand(testItem.password).be('');
				done();
			});
		});

		it('should clear password if passed hash is empty string', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.updateItem(testItem, {
				password_hash: '',
			}, () => {
				demand(testItem.password).be('');
				done();
			});
		});

		it('should not update if neither password nor hash specified', (done) => {
			const testItem = new List.model();
			List.fields.password.updateItem(testItem, {}, () => {
				demand(testItem.password).be.undefined();
				done();
			});
		});
	});

	describe('validateInput', () => {
		it('should validate a matching password and confirm value', (done) => {
			List.fields.password.validateInput({
				password: 'vasjdhb273r8ywbfeuygr2834ryfhwubsudfih',
				password_confirm: 'vasjdhb273r8ywbfeuygr2834ryfhwubsudfih',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate empty string input', (done) => {
			List.fields.password.validateInput({
				password: '',
				password_confirm: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate undefined input', (done) => {
			List.fields.password.validateInput({}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate null input', (done) => {
			List.fields.password.validateInput({
				password: null,
				password_confirm: null,
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined confirmation value', (done) => {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: undefined,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate empty string confirmation value', (done) => {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate null confirmation value', (done) => {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: null,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should validate password longer than 72 characters when max is set to false', (done) => {
			List.fields.maxFalse.validateInput({
				password: 'CheckOutThisRidiculouslyLongPasswordLoremipsumdolorsitametconsecteturadipiscingelitPraesentetnibhpretiumvestibulumdoloratsuscipitmiClassaptenttacitisociosquadlitoratorquentperconubianostraperinceptoshimenaeosIntegerquisduinonnuncegestaspretiumeuetanteInplaceratacmisitametsollicitudin',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one digit when digits are required', (done) => {
			List.fields.digitChar.validateInput({
				digitChar: 'digits123',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one special char when spchars are required', (done) => {
			List.fields.spChar.validateInput({
				spChar: 'specialchars!&',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with ASCII chars only when ASCII only is required', (done) => {
			List.fields.asciiChar.validateInput({
				asciiChar: 'asciionly',
			}, (result, detail) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one lowercase char when lowercase is required', (done) => {
			List.fields.lowChar.validateInput({
				lowChar: 'lowercase123',
			}, (result, detail) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate password with at least one uppercase char when uppercase is required', (done) => {
			List.fields.upperChar.validateInput({
				upperChar: 'UpperCase',
			}, (result, detail) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate mismatching values', (done) => {
			List.fields.password.validateInput({
				password: 'something',
				password_confirm: 'notsomething',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate empty string password value', (done) => {
			List.fields.password.validateInput({
				password: '',
				password_confirm: 'something',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null password value', (done) => {
			List.fields.password.validateInput({
				password: null,
				password_confirm: 'something',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate undefined password value', (done) => {
			List.fields.password.validateInput({
				password: undefined,
				password_confirm: 'something',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate true password value', (done) => {
			List.fields.password.validateInput({
				password: true,
				password_confirm: 'something',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate false password value', (done) => {
			List.fields.password.validateInput({
				password: false,
				password_confirm: 'something',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate password shorter than min characters', (done) => {
			List.fields.minChar.validateInput({
				minChar: '1234',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate password longer than 72 characters', (done) => {
			List.fields.password.validateInput({
				password: 'CheckOutThisRidiculouslyLongPasswordLoremipsumdolorsitametconsecteturadipiscingelitPraesentetnibhpretiumvestibulumdoloratsuscipitmiClassaptenttacitisociosquadlitoratorquentperconubianostraperinceptoshimenaeosIntegerquisduinonnuncegestaspretiumeuetanteInplaceratacmisitametsollicitudin',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate password with no digits when digits are required', (done) => {
			List.fields.digitChar.validateInput({
				digitChar: 'nodigits',
			}, (result, detail) => {
				demand(result).be.false();
				demand(detail).be('enter at least one digit');
				done();
			});
		});

		it('should invalidate password with no special characters when spchars are required', (done) => {
			List.fields.spChar.validateInput({
				spChar: 'nospecialchars',
			}, (result, detail) => {
				demand(result).be.false();
				demand(detail).be('enter at least one special character');
				done();
			});
		});

		it('should invalidate password with non-ASCII chars when ASCII is required', (done) => {
			List.fields.asciiChar.validateInput({
				asciiChar: 'םגפשבך',
			}, (result, detail) => {
				demand(result).be.false();
				demand(detail).be('Password must be longer than 8 characters. \nonly ASCII characters are allowed');
				done();
			});
		});

		it('should invalidate password with no lowercase chars when lowercase is required', (done) => {
			List.fields.lowChar.validateInput({
				lowChar: 'NOLOWERCASE',
			}, (result, detail) => {
				demand(result).be.false();
				demand(detail).be('use at least one lower case character');
				done();
			});
		});

		it('should invalidate password with no uppercase chars when uppercase is required', (done) => {
			List.fields.upperChar.validateInput({
				upperChar: 'nouppercase',
			}, (result, detail) => {
				demand(result).be.false();
				demand(detail).be('use at least one upper case character');
				done();
			});
		});
	});

	describe('validateRequiredInput', () => {
		it('should validate a hash value', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password_hash: '12asdf34',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a password value', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: 'asdf',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate a password and hash value', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: 'asdf',
				password_hash: '12asdf34',
			}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should validate undefined password and hash values if a value exists already', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {}, (result) => {
				demand(result).be.true();
				done();
			});
		});

		it('should invalidate undefined password and hash values', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty password value', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty hash value', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password_hash: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty hash and password value', (done) => {
			const testItem = new List.model();
			List.fields.password.validateRequiredInput(testItem, {
				password: '',
				password_hash: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate an empty hash and password value even if a value exists', (done) => {
			const testItem = new List.model({
				password: 'blabla',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password: '',
				password_hash: '',
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null password value even if a value exists', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password: null,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null hash value even if a value exists', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password_hash: null,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});

		it('should invalidate null password and hash value even if a value exists', (done) => {
			const testItem = new List.model({
				password: 'asdf',
			});
			List.fields.password.validateRequiredInput(testItem, {
				password: null,
				password_hash: null,
			}, (result) => {
				demand(result).be.false();
				done();
			});
		});
	});

	describe('addFilterToQuery', () => {
		it('should filter for existing values', () => {
			const result = List.fields.password.addFilterToQuery({
				exists: true,
			});
			demand(result.password).eql({
				$ne: null,
			});
		});

		it('should filter for non-existing values', () => {
			const result = List.fields.password.addFilterToQuery({
				exists: false,
			});
			demand(result.password).be.null();
		});
	});

	describe('invalid complexity options', () => {
		it('should throw an error when non-existing complexity options are passed', (done) => {
			try {
				List.add({
					doesntExist: {
						type: PasswordType,
						complexity: {
							doesntExist: true,
						},
					},
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Password: options.complexity - option does not exist.');
				done();
			}
		});
		it('should throw an error when a non-boolean value is passed for complexity options', (done) => {
			try {
				List.add({
					doesntExist: {
						type: PasswordType,
						complexity: {
							spChar: 'squirrel',
						},
					},
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Password: options.complexity - Value must be boolean.');
				done();
			}
		});
	});

	describe('max less than min', () => {
		it('should throw an error when max value is set lower than min', (done) => {
			try {
				List.add({
					minmax: {
						type: PasswordType,
						min: 20,
						max: 12,
					},
				});
			} catch (err) {
				demand(err.message).eql('FieldType.Password: options - maximum password length cannot be less than the minimum length.');
				done();
			}
		});
	});
};
