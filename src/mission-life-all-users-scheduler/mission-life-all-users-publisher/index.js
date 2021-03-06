import AWS from 'aws-sdk';

export default class MissionLifeAllUsersPublisher {
  constructor(options) {
    
    if (!options) {
      throw new TypeError(
        `MissionLifeAllUsersPublisher - options must be an object. Value Provided: ${options}`
      );
    }
    if (options.batchSize && typeof options.batchSize !== 'number') {
      throw new TypeError(
        `MissionLifeAllUsersPublisher - options.batchSize must be a number. Value Provided: ${options.batchSize}`
      );
    }

    if (!options.sqs || typeof options.sqs !== 'object') {
      throw new TypeError(
        `MissionLifeAllUsersPublisher - options.sqs must be an object. Value Provided: ${options.sqs}`
      );
    }

    this.batchSize = options.batchSize || 10;
    this.sqs = options.sqs;
  }

  async publishSupporterSponsorships(supporterSponsorships) {
    let batchPromises = [],
      formattedMessages = [];

    for (const supporterSponsorship of supporterSponsorships) {
      const message = {
        email: supporterSponsorship.supporterEmail,
        name: supporterSponsorship.supporterName,
        sponsorshipId: supporterSponsorship.sponsorshipId,
        foundation: supporterSponsorship.foundation
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
