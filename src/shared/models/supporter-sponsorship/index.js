export default class SupporterSponsorship {
  constructor({ supporterEmail, supporterName, sponsorshipId, foundation }) {
    if (!supporterEmail || typeof supporterEmail !== "string") {
      throw new TypeError(
        `supporterEmail in SupporterSponsorship must be a string. Value provided ${supporterEmail}`
      );
    }
    if (!supporterName || typeof supporterName !== "string") {
      throw new TypeError(
        `supporterName in SupporterSponsorship must be a string. Value provided ${supporterName}`
      );
    }
    if (!sponsorshipId || typeof sponsorshipId !== "number") {
      throw new TypeError(
        `supporterEmail in SupporterSponsorship must be a string. Value provided ${supporterEmail}`
      );
    }
    if (!foundation || typeof foundation !== "string") {
      throw new TypeError(
        `foundation in SupporterSponsorship must be a string. Value provided ${foundation}`
      );
    }

    this.supporterEmail = supporterEmail;
    this.supporterName = supporterName;
    this.sponsorshipId = sponsorshipId;
    this.foundation = foundation;

    Object.freeze(this);
  }
}
