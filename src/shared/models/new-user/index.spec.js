import NewUser from './index';

describe('New User', () => {
  it('should exist', () => {
    expect(NewUser).toEqual(jasmine.any(Function));
  });

  describe('constructor', () => {
    let newUser;

    beforeEach(() => {
      newUser = {
        email: 'newUser@email.com',
        sponsorshipId: 123,
        foundation: 'Formavida'
      }
    });

    it('should throw if newUser is not a object', () => {
      expect(() => new NewUser(null)).toThrowError(/newUser/);
    });
    it('should throw if newUser is not a object', () => {
      expect(() => new NewUser(undefined)).toThrowError(/newUser/);
    });
    it('should throw if newUser is not a object', () => {
      expect(() => new NewUser(12345)).toThrowError(/newUser/);
    });

    it('should throw if newUser.email is not a string', () => {
      newUser.email = {};
      expect(() => new NewUser(newUser)).toThrowError(/newUser.email/);
    });
    it('should throw if newUser.email is not a string', () => {
      newUser.email = true;
      expect(() => new NewUser(newUser)).toThrowError(/newUser.email/);
    });
    it('should throw if newUser.email is not a string', () => {
      newUser.email = 123;
      expect(() => new NewUser(newUser)).toThrowError(/newUser.email/);
    });

    it('should throw if newUser.sponsorshipId is not a number', () => {
      newUser.sponsorshipId = {};
      expect(() => new NewUser(newUser)).toThrowError(/newUser.sponsorshipId/);
    });
    it('should throw if newUser.sponsorshipId is not a number', () => {
      newUser.sponsorshipId = true;
      expect(() => new NewUser(newUser)).toThrowError(/newUser.sponsorshipId/);
    });
    it('should throw if newUser.sponsorshipId is not a number', () => {
      newUser.sponsorshipId = '123';
      expect(() => new NewUser(newUser)).toThrowError(/newUser.sponsorshipId/);
    });

    it('should throw if newUser.foundation is not a string', () => {
      newUser.foundation = {};
      expect(() => new NewUser(newUser)).toThrowError(/newUser.foundation/);
    });
    it('should throw if newUser.foundation is not a string', () => {
      newUser.foundation = true;
      expect(() => new NewUser(newUser)).toThrowError(/newUser.foundation/);
    });
    it('should throw if newUser.foundation is not a string', () => {
      newUser.foundation = 123;
      expect(() => new NewUser(newUser)).toThrowError(/newUser.foundation/);
    });


    it('should have properties that are frozen', () => {
      const newUserObject = new NewUser(newUser);

      expect(() => newUserObject.email = 'aSecondUserEmail@email.com').toThrowError(/email/);
    });
  });
});