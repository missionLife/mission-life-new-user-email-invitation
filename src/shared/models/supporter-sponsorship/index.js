export default class SupporterSponsorship {
  constructor(supporterEmail, sponsorshipId, foundation) {
    if (!supporterEmail || typeof supporterEmail !== 'string') {
      throw new TypeError(`supporterEmail in SupporterSponsorship must be a string. Value provided ${supporterEmail}`);
    }
    if (!sponsorshipId || typeof sponsorshipId !== 'number' ) {
      throw new TypeError(`supporterEmail in SupporterSponsorship must be a string. Value provided ${supporterEmail}`);
    }
    if (!foundation || typeof foundation !== 'string') {
      throw new TypeError(`foundation in SupporterSponsorship must be a string. Value provided ${foundation}`);
    }

    this.supporterEmail = supporterEmail;
    this.sponsorshipId = sponsorshipId;
    this.foundation = foundation;

    Object.freeze(this);
  }
}