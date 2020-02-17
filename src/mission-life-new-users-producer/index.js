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
    
    const supporterSponsorship = new SupporterSponsorship(
      supporterSponsorshipMessage.email,
      supporterSponsorshipMessage.sponsorshipId
    );
    
    console.log('Mission Life New Users Producer - supporterSponsorship: ', supporterSponsorship);
    batchPromises.push({
      exists: await missionLifeUsersDataRepo.checkIfUserExists(supporterSponsorship),
      email: supporterSponsorship.supporterEmail,
      sponsorshipId: supporterSponsorship.sponsorshipId
    });
  }

  return publishNewUsers(batchPromises);
}

async function publishNewUsers(allCheckedUsers) {
  console.log('######## THE NEW USERS #######', allCheckedUsers)
  const newUsers = [];

  for (let i = 0; i < allCheckedUsers.length; i++) {
    const checkedUser = allCheckedUsers[i];
    if (!checkedUser.exists) {
      newUsers.push(checkedUser);
    }
  }
  console.log('######## THE NEW USERS LENGTH #######', newUsers.length)
  if (newUsers.length > 0) {
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