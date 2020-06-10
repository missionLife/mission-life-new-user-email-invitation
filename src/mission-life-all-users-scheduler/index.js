import AWS from 'aws-sdk';
import SupporterSponsorship from './shared/models/supporter-sponsorship';
import MissionLifeAllUsersPublisher from './mission-life-all-users-publisher';
import ReachService from './shared/reach-service';
import SQS from './shared/sqs';

const betaUserEmails = {
  // 'pcarrollnh@gmail.com': true,
  // 'angel.galvis@missionlifechange.org': true,
  'ryanjgetchell@gmail.com': true,
  // 'hallej23@gmail.com': true,
  // 'hamiltons621@gmail.com': true,
  // 'evan_jill@yahoo.com': true,
  // 'm_mercer@hotmail.com': true,
  // '15gile@gmail.com': true,
  // 'jenn_oneill1@comcast.net': true,
  // 'chris@mattplumlee.org': true,
  // 'cristianrios222@hotmail.com': true,
  // 'hnvrios@gmail.com': true,
  // 'lisa.applewood@gmail.com': true,
  // 'greg@sherwinwebsolutions.com': true,
  // 'asperry1982@comcast.net': true,
  // 'soliveira.eliaphoto@gmail.com': true,
  // 'swalsh00@comcast.net': true,
  // 'carolinejwilkins@gmail.com': true,
};

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
      if (betaUserEmails[supporterData.supporter.email]) {
        console.log('BETA USER! - '. supporterData);
        supporterSponsorships.push(
          new SupporterSponsorship({
            supporterEmail: supporterData.supporter.email,
            supporterName: supporterData.supporter.name,
            sponsorshipId: sponsorship.id,
            foundation: supporterData.sponsorship.place.title
          })
        );
      }
    }
  }

  const missionLifeAllUsersPublisher = new MissionLifeAllUsersPublisher({
    sqs: missionLifeAllUsersQueue,
    batchSize: 10
  })

  console.log('THE FILTERED SUPPORTER SPONSORSHIPS: ', supporterSponsorships);
  return missionLifeAllUsersPublisher.publishSupporterSponsorships(supporterSponsorships);
};

exports.handler = async (event, context) => {
  try {
    return await getUsers(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life All Users Scheduler Lambda: ${error.message}`);
  }
};