import AWS from 'aws-sdk';
import SupporterSponsorship from './shared/models/supporter-sponsorship';
import MissionLifeUsersDataRepo from './shared/mission-life-users-data-repo';
import MissionLifeNewUsersPublisher from './mission-life-new-users-publisher';
import SQS from './shared/sqs';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const missionLifeNewUsersQueue = new SQS({
  awsRegion: process.env.AWS_REGION,
  queueUrl: process.env.MISSION_LIFE_NEW_USERS_QUEUE_URL
});
const missionLifeNewUsers = new MissionLifeNewUsersPublisher({
  batchSize: 10,
  sqs: missionLifeNewUsersQueue
})
const documentClient = new AWS.DynamoDB.DocumentClient();
const missionLifeUsersDataRepo = new MissionLifeUsersDataRepo(documentClient);

async function processMessageBatch(messages) {
  const batchPromises = [];
  for (let i = 0; i < messages.length; i++) {
    const supporterSponsorshipMessage = JSON.parse(messages[i].body);
    
    const supporterSponsorship = new SupporterSponsorship({
      supporterEmail: supporterSponsorshipMessage.email,
      supporterName: supporterSponsorshipMessage.name,
      sponsorshipId: supporterSponsorshipMessage.sponsorshipId,
      foundation: supporterSponsorshipMessage.foundation
    });
    
    batchPromises.push({
      exists: await missionLifeUsersDataRepo.checkIfUserExists(supporterSponsorship),
      email: supporterSponsorship.supporterEmail,
      name: supporterSponsorship.supporterName,
      sponsorshipId: supporterSponsorship.sponsorshipId,
      foundation: supporterSponsorship.foundation
    });
  }
  
  return publishNewUsers(batchPromises);
}

async function publishNewUsers(allCheckedUsers) {
  console.log('ALL USERS: ', JSON.stringify(allCheckedUsers, null, 2));
  console.log('ALL USERS Length: ', allCheckedUsers.length);
  const newUsers = [];

  for (let i = 0; i < allCheckedUsers.length; i++) {
    const checkedUser = allCheckedUsers[i];
    if (!checkedUser.exists) {
      newUsers.push(checkedUser);
    }
  }
  
  if (newUsers.length > 0) {
    await missionLifeUsersDataRepo.addNewUsers(allCheckedUsers);
    return missionLifeNewUsers.publishNewUsers(newUsers);
  } else {
    return null;
  }
}

async function consume(event, context) {
  return processMessageBatch(event.Records);
};

exports.handler = async (event, context) => {
  try {
    return await consume(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life New Users Producer Lambda: ${error.message}`);
  }
};