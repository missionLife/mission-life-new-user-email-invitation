import AWS from 'aws-sdk';
import SupporterSponsorship from './shared/models/supporter-sponsorship';
import MissionLifeAllUsersPublisher from './mission-life-all-users-publisher';
import ReachService from './shared/reach-service';
import SQS from './shared/sqs';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const missionLifeAllUsersQueue = new SQS({
  awsRegion: process.env.AWS_REGION,
  queueUrl: process.env.MISSION_LIFE_ALL_USERS_QUEUE_URL
});

async function getUsers(event, context) {
  const supporterSponsorships = [];
  const reachService = new ReachService();

  const allSponsorships = await reachService.getAllSponsorships(1, []);

  console.log('######## ALL SPONSORSHIPS COUNT ######### - ', allSponsorships.length);

  for (let sponsorship of allSponsorships) {
    const supporters = await reachService.getSupporters(sponsorship);

    for (let supporterData of supporters) {
      console.log('####### THE SUPPORTER DATA WITH SPONSORSHIP ######## - ', supporterData);
      supporterSponsorships.push(
        new SupporterSponsorship(
          supporterData.supporter.email,
          sponsorship.id,
          supporterData.sponsorship.place.title
        )
      );
    }
  }

  const missionLifeAllUsersPublisher = new MissionLifeAllUsersPublisher({
    sqs: missionLifeAllUsersQueue,
    batchSize: 10
  })

  return missionLifeAllUsersPublisher.publishSupporterSponsorships(supporterSponsorships);
};

exports.handler = async (event, context) => {
  try {
    return await getUsers(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life All Users Scheduler Lambda: ${error.message}`);
  }
};