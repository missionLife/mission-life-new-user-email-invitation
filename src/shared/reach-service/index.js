
const REACH_URL = 'https://missionlife.reachapp.co/api/v1';
const HTTP_OPTIONS = {
  headers: {
    Authorization: 'Basic NDBiNjg5ODk0ZTRhZGNjOGFjNzcxMjk4MzRlYzMzY2Q6OWYwNGVhZGUxMzc5NjgwZGM0YmVjOTJlMjMyMTVmOWQ0NDNiZWU0Z' +
      'WVkMDljOTRkYzg0MjQwZGZkM2UzZTM5MA=='
  }
};


export class ReachService {
  constructor() { }

  getAllSponsorships() {
    const sponsorships = [];
    const result = [];

    this.getSponsorships(1, sponsorships, () => {
      result.next(sponsorships);
    });

    return result;
  }

  getSupporters(sponsorship) {
    return this.http.get(`${REACH_URL}/sponsorships/${sponsorship.id}/sponsors`, HTTP_OPTIONS);
  }

  getSponsorships(pageNumber, sponsorships, callback) {
    return this.http.get(`${REACH_URL}/sponsorships?page=${pageNumber}&per_page=200`, HTTP_OPTIONS).then(results => {
      if (results.length > 0) {
        sponsorships.push(...results);
        this.getSponsorships(pageNumber + 1, sponsorships, callback);
      } else {
        callback();
      }
    });
  }
}