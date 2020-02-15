import AWS from 'aws-sdk';
import SupporterSponsorship from './shared/models/supporter-sponsorship';
import MissionLifeNewUsersPublisher from './mission-life-new-users-publisher';
import ReachService from './shared/reach-service';
import SQS from './shared/sqs';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const missionLifeNewUsersQueue = new SQS({
  awsRegion: process.env.AWS_REGION,
  queueUrl: process.env.MISSION_LIFE_NEW_USERS_QUEUE_URL
})

async function getUsers(event, context) {
  const supporterSponsorships = [];
  const reachService = new ReachService();

  const allSponsorships = await reachService.getAllSponsorships(1, []);

  console.log('######## ALL SPONSORSHIPS COUNT ######### - ', allSponsorships.length);

  for (let sponsorship of allSponsorships) {
    const supporters = await reachService.getSupporters(sponsorship);

    console.log('####### THE SUPPORTER ######## - ', supporters);

    for (let supporterData of supporters) {
      supporterSponsorships.push(
        new SupporterSponsorship(
          supporterData.supporter.email,
          sponsorship.id
        )
      );
    }
  }

  console.log('####### THE SUPPORTER_SPONSORSHIP KEY PAIRS ######## - ', supporterSponsorships);

  const missionLifeNewUsersPublisher = new MissionLifeNewUsersPublisher({
    sqs: missionLifeNewUsersQueue,
    batchSize: 10
  })

  return missionLifeNewUsersPublisher.publishSupporterSponsorships(supporterSponsorships);
};

exports.handler = async (event, context) => {
  try {
    return await getUsers(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life New Users Scheduler Lambda: ${error.message}`);
  }
};