import ReachService from './shared/reach-service';

async function getUsers(event, context) {
  const supporterSponsorships = [];
  const reachService = new ReachService();

  const allSponsorships = await reachService.getAllSponsorships(1, []);

  console.log('######## ALL SPONSORSHIPS COUNT ######### - ', allSponsorships.length);

  for (let sponsorship of allSponsorships) {
    const supporters = await reachService.getSupporters(sponsorship);

    console.log('####### THE SUPPORTER ######## - ', supporters);

    for (let supporter of supporters) {
      supporterSponsorships.push(`${supporter.email}___${sponsorship.id}`);
    }
  }

  console.log('####### THE SUPPORTER_SPONSORSHIP KEY PAIRS ######## - ', supporterSponsorships);

  return supporterSponsorships;
};

exports.handler = async (event, context) => {
  try {
    return await getUsers(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life New Users Scheduler Lambda: ${error.message}`);
  }
};