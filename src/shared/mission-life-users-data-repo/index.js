import SupporterSponsorship from '../models/supporter-sponsorship';
export default class MissionLifeUsersDataRepo {
  constructor(documentClient) {
    this.documentClient = documentClient;
  }

  async checkIfUserExists(supporterSponsorship) {
    if (!supporterSponsorship instanceof SupporterSponsorship) {
      throw new TypeError(
        `MissionLifeUsersDataRepo - checkIfUserExists - supporterSponsorship must 
        be an instance of SupporterSponsorship. Value provided: ${supporterSponsorship}`
      );
    }

    const params = {
      TableName: 'MISSION_LIFE_USERS',
      KeyConditionExpression: '#email = :e',
      ExpressionAttributeNames: {
        '#email': 'EMAIL'
      },
      ExpressionAttributeValues: {
        ':e': `${supporterSponsorship.supporterEmail}`
      },
      Select: 'COUNT'
    };

    const data = await this.documentClient.query(params).promise();
    
    return data.Count > 0;
  }
}
