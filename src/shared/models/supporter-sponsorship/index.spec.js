import SupporterSponsorship from './index';

describe('Supporter Sponsorship', () => {
  it('should exist', () => {
    expect(SupporterSponsorship).toEqual(jasmine.any(Function));
  });

  describe('constructor', () => {
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship(null, 123)).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship(undefined, 123)).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship(12345, 123)).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship([], 123)).toThrowError(/supporterEmail/);
    });

    it('should throw if sponsorshipId is not a number', () => {
      expect(() => new SupporterSponsorship('aUserEmail@email.com', 'notAnId')).toThrowError(/supporterEmail/);
    });
    it('should throw if sponsorshipId is not a number', () => {
      expect(() => new SupporterSponsorship('aUserEmail@email.com', [])).toThrowError(/supporterEmail/);
    });
    it('should throw if sponsorshipId is not a number', () => {
      expect(() => new SupporterSponsorship('aUserEmail@email.com', true)).toThrowError(/supporterEmail/);
    });

    it('should have properties that are frozen', () => {
      const supporterSponsorship = new SupporterSponsorship('aUserEmail@email.com', 123);

      expect(() => supporterSponsorship.supporterEmail = 'aSecondUserEmail@email.com').toThrowError(/supporterEmail/);
    });
  });
});