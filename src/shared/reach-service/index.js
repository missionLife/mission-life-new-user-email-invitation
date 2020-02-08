import fetchWrapper from '../fetch-wrapper';

const HTTP_OPTIONS = {
  headers: {
    Authorization: process.env.REACH_AUTHORIZATION_TOKEN
  }
};

export default class ReachService {
  constructor() { }

  async getSupporters(sponsorship) {

    if (!sponsorship || !Array.isArray(sponsorship)) {
      throw new TypeError(`Reach Service Error - getSupporters: sponsorship must be an array.  Value Provided: ${sponsorship}`);
    }

    return fetchWrapper(`${process.env.REACH_BASE_URL}/sponsorships/${sponsorship.id}/sponsors`, HTTP_OPTIONS);
  }

  async getAllSponsorships(pageNumber, sponsorships) {
    
    if (typeof pageNumber !== 'number') {
      throw new TypeError(`Reach Service Error - getAllSponsorships: pageNumber must be a number.  Value Provided: ${pageNumber}`);
    }

    if (!sponsorships || !Array.isArray(sponsorships)) {
      throw new TypeError(`Reach Service Error - getAllSponsorships: sponsorships must be an array.  Value Provided: ${sponsorships}`);
    }

    const fetchedSponsorships = await fetchWrapper(
      `${process.env.REACH_BASE_URL}/sponsorships?page=${pageNumber}&per_page=200`,
      HTTP_OPTIONS
    );

    
    const allSponsorShips = sponsorships.concat(fetchedSponsorships);

    if (fetchedSponsorships.length > 0) {
      return this.getAllSponsorships(pageNumber + 1, allSponsorShips);
    } else {
      return allSponsorShips;
    }
  }
  
}