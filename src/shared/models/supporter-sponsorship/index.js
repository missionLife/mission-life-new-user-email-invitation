export default class SupporterSponsorship {
  constructor(supporterEmail, sponsorshipId) {
    if (!supporterEmail || typeof supporterEmail !== 'string') {
      throw new TypeError(`supporterEmail SupporterSponsorship in  must be a string. Value provided ${supporterEmail}`);
    }
    if (!sponsorshipId || typeof sponsorshipId !== 'number' ) {
      throw new TypeError(`supporterEmail SupporterSponsorship in  must be a string. Value provided ${supporterEmail}`);
    }

    this.supporterEmail = supporterEmail;
    this.sponsorshipId = sponsorshipId;

    Object.freeze(this);
  }
}