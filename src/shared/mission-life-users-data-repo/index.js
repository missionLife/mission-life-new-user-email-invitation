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
      KeyConditionExpression: '#email = :e AND #sponsorshipId = :s',
      ExpressionAttributeNames: {
        '#email': 'EMAIL',
        '#sponsorshipId': 'SPONSORSHIP_ID'
      },
      ExpressionAttributeValues: {
        ':e': `${supporterSponsorship.supporterEmail}`,
        ':s': `${supporterSponsorship.sponsorshipId}`
      },
      Select: 'COUNT'
    };

    const data = await this.documentClient.query(params).promise();
    
    return data.Count > 0;
  }

  async addNewUsers(newUsers) {
    let putItemPromises = [];

    for (let i = 0; i < newUsers.length; i++) {
      const newUser = newUsers[i];
      let putItemParams = {
        TableName: 'MISSION_LIFE_USERS',
        Item: {
          'EMAIL': newUser.email,
          'NAME': newUser.name,
          'SPONSORSHIP_ID': newUser.sponsorshipId,
          'FOUNDATION': newUser.foundation
        }
      }



      putItemPromises.push(this.documentClient.put(putItemParams).promise());
    }

    return Promise.all(putItemPromises);
  }
}
