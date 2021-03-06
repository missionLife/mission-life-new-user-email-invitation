import AWS from 'aws-sdk';

export default class MissionLifeNewUsersPublisher {
  constructor(options) {
    
    if (!options) {
      throw new TypeError(
        `MissionLifeNewUsersPublisher - options must be an object. Value Provided: ${options}`
      );
    }
    if (options.batchSize && typeof options.batchSize !== 'number') {
      throw new TypeError(
        `MissionLifeNewUsersPublisher - options.batchSize must be a number. Value Provided: ${options.batchSize}`
      );
    }

    if (!options.sqs || typeof options.sqs !== 'object') {
      throw new TypeError(
        `MissionLifeNewUsersPublisher - options.sqs must be an object. Value Provided: ${options.sqs}`
      );
    }

    this.batchSize = options.batchSize || 10;
    this.sqs = options.sqs;
  }

  async publishNewUsers(newUsers) {
    let batchPromises = [],
      formattedMessages = [];

    for (const newUser of newUsers) {
      const message = {
        email: newUser.email,
        sponsorshipId: newUser.sponsorshipId,
        foundation: newUser.foundation
      };
      formattedMessages.push(message);

      if (formattedMessages.length === this.batchSize) {
        batchPromises.push(this.sqs.sendMessageBatch(formattedMessages));
        formattedMessages = [];
      }
    }

    if (formattedMessages.length > 0) {
      batchPromises.push(this.sqs.sendMessageBatch(formattedMessages));
    }

    return Promise.all(batchPromises);
  }
}
