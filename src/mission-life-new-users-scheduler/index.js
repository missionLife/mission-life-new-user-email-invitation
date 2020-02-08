import ReachService from './shared/reach-service';

async function getNewUsers(event, context) {
  const reachService = new ReachService();

  const allSponsorships = await reachService.getAllSponsorships(1, []);

  console.log('######## ALL SPONSORSHIPS ######### - ', allSponsorships);

  return allSponsorships;
};

exports.handler = async (event, context) => {
  try {
    return await getNewUsers(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life New Users Scheduler Lambda: ${error.message}`);
  }
};