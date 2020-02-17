import MissionLifeNewUsersPublisher from './index';

describe('MissionLifeNewUsersPublisher', () => {
  it('should exist', () => {
    expect(MissionLifeNewUsersPublisher).toEqual(jasmine.any(Function));
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
      expect(() => new MissionLifeNewUsersPublisher(options)).toThrowError(/batchSize/);
    });

    it('should throw if sqs is not an object', () => {
      options.sqs = '10'
      expect(() => new MissionLifeNewUsersPublisher(options)).toThrowError(/sqs/);
    });
  });

  describe('publishNewUsers', () => {
    let supporterSponsorships = [
      {
        exists: false,
        email: 'aEmail@email.com',
        sponsorshipId: 123
      }
    ];

    it('should publish supporter sponsorships to SQS', async () => {
      const missionLifeNewUsersPublisher = new MissionLifeNewUsersPublisher(options);

      await missionLifeNewUsersPublisher.publishNewUsers(supporterSponsorships);

      expect(sqsSpy.sendMessageBatch).toHaveBeenCalledTimes(1);
    });
  });
});