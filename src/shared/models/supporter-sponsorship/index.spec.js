import SupporterSponsorship from './index';

describe('Supporter Sponsorship', () => {
  it('should exist', () => {
    expect(SupporterSponsorship).toEqual(jasmine.any(Function));
  });

  describe('constructor', () => {

    let options;

    beforeEach(() => {
      options = {
        supporterEmail: 'aSupporterEmail@email.com',
        supporterName: 'aSupporterName',
        sponsorshipId: 123,
        foundation: 'aFoundation'
      }
    })
    it('should throw if supporterEmail is not a string', () => {
      options.supporterEmail = null;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      options.supporterEmail = undefined;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      options.supporterEmail = 12345;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      options.supporterEmail = [];
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });

    it('should throw if supporterName is not a string', () => {
      options.supporterName = null;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterName/);
    });
    it('should throw if supporterName is not a string', () => {
      options.supporterName = undefined;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterName/);
    });
    it('should throw if supporterName is not a string', () => {
      options.supporterName = 12345;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterName/);
    });
    it('should throw if supporterName is not a string', () => {
      options.supporterName = [];
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterName/);
    });

    it('should throw if sponsorshipId is not a number', () => {
      options.sponsorshipId = 'notAnId';
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });
    it('should throw if sponsorshipId is not a number', () => {
      options.sponsorshipId = [];
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });
    it('should throw if sponsorshipId is not a number', () => {
      options.sponsorshipId = true;
      expect(() => new SupporterSponsorship(options)).toThrowError(/supporterEmail/);
    });

    it('should throw if foundation is not a string', () => {
      options.foundation = null;
      expect(() => new SupporterSponsorship(options)).toThrowError(/foundation/);
    });
    it('should throw if foundation is not a string', () => {
      options.foundation = 12343;
      expect(() => new SupporterSponsorship(options)).toThrowError(/foundation/);
    });
    it('should throw if foundation is not a string', () => {
      options.foundation = [];
      expect(() => new SupporterSponsorship(options)).toThrowError(/foundation/);
    });
    it('should throw if foundation is not a string', () => {
      options.foundation = {};
      expect(() => new SupporterSponsorship(options)).toThrowError(/foundation/);
    });

    it('should have properties that are frozen', () => {
      const supporterSponsorship = new SupporterSponsorship(options);

      expect(() => supporterSponsorship.supporterEmail = 'aSecondUserEmail@email.com').toThrowError(/supporterEmail/);
    });
  });
});