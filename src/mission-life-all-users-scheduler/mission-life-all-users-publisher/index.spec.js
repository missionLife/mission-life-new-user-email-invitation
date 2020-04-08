import MissionLifeAllUsersPublisher from './index';
import SupporterSponsorship from '../shared/models/supporter-sponsorship';

describe('MissionLifeAllUsersPublisher', () => {
  it('should exist', () => {
    expect(MissionLifeAllUsersPublisher).toEqual(jasmine.any(Function));
  });

  let options;
  let sqsSpy;
  beforeEach(() => {

    sqsSpy = jasmine.createSpyObj('sqsSpy', ['sendMessageBatch']);
    sqsSpy.sendMessageBatch.and.callFake((messages) => {
      return Promise.resolve({});
    });

    options = {
      batchSize: 10,
      sqs: sqsSpy
    };
  });

  describe('constructor', () => {
    it('should throw if batchSize is not a number', () => {
      options.batchSize = '10'
      expect(() => new MissionLifeAllUsersPublisher(options)).toThrowError(/batchSize/);
    });

    it('should throw if sqs is not an object', () => {
      options.sqs = '10'
      expect(() => new MissionLifeAllUsersPublisher(options)).toThrowError(/sqs/);
    });
  });

  describe('publishSupporterSponsorships', () => {
    let supporterSponsorships = [
      new SupporterSponsorship({
        supporterEmail: 'aSupporterEmail@email.com',
        supporterName: 'aSupporterName',
        sponsorshipId: 123,
        foundation: 'aFoundation'
      }),
      new SupporterSponsorship({
        supporterEmail: 'aSupporterEmail2@email.com',
        supporterName: 'aSupporterName',
        sponsorshipId: 456,
        foundation: 'aFoundation'
      })
    ];

    it('should publish supporter sponsorships to SQS', async () => {
      const missionLifeAllUsersPublisher = new MissionLifeAllUsersPublisher(options);

      await missionLifeAllUsersPublisher.publishSupporterSponsorships(supporterSponsorships);

      expect(sqsSpy.sendMessageBatch).toHaveBeenCalledTimes(1);
    });
  });
});