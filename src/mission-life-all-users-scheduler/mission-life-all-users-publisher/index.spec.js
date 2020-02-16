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
      new SupporterSponsorship(
        'aUserEmail@email.com',
        123
      ),
      new SupporterSponsorship(
        'aUserEmail2@email.com',
        456
      )
    ];

    it('should publish supporter sponsorships to SQS', async () => {
      const missionLifeAllUsersPublisher = new MissionLifeAllUsersPublisher(options);

      await missionLifeAllUsersPublisher.publishSupporterSponsorships(supporterSponsorships);

      expect(sqsSpy.sendMessageBatch).toHaveBeenCalledTimes(1);
    });
  });
});