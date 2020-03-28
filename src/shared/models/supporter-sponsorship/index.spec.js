import SupporterSponsorship from './index';

describe('Supporter Sponsorship', () => {
  it('should exist', () => {
    expect(SupporterSponsorship).toEqual(jasmine.any(Function));
  });

  describe('constructor', () => {
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship(null, 123, 'aFoundation')).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship(undefined, 123, 'aFoundation')).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship(12345, 123, 'aFoundation')).toThrowError(/supporterEmail/);
    });
    it('should throw if supporterEmail is not a string', () => {
      expect(() => new SupporterSponsorship([], 123, 'aFoundation')).toThrowError(/supporterEmail/);
    });

    it('should throw if sponsorshipId is not a number', () => {
      expect(() => new SupporterSponsorship('aUserEmail@email.com', 'notAnId', 'aFoundation')).toThrowError(/supporterEmail/);
    });
    it('should throw if sponsorshipId is not a number', () => {
      expect(() => new SupporterSponsorship('aUserEmail@email.com', [], 'aFoundation')).toThrowError(/supporterEmail/);
    });
    it('should throw if sponsorshipId is not a number', () => {
      expect(() => new SupporterSponsorship('aUserEmail@email.com', true, 'aFoundation')).toThrowError(/supporterEmail/);
    });

    it('should throw if foundation is not a string', () => {
      expect(() => new SupporterSponsorship('aString', 123, null)).toThrowError(/foundation/);
    });
    it('should throw if foundation is not a string', () => {
      expect(() => new SupporterSponsorship('aString', 123, 12314)).toThrowError(/foundation/);
    });
    it('should throw if foundation is not a string', () => {
      expect(() => new SupporterSponsorship('aString', 123, [])).toThrowError(/foundation/);
    });
    it('should throw if foundation is not a string', () => {
      expect(() => new SupporterSponsorship('aString', 123, {})).toThrowError(/foundation/);
    });

    it('should have properties that are frozen', () => {
      const supporterSponsorship = new SupporterSponsorship('aUserEmail@email.com', 123, 'aFoundation');

      expect(() => supporterSponsorship.supporterEmail = 'aSecondUserEmail@email.com').toThrowError(/supporterEmail/);
    });
  });
});