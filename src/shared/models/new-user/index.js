export default class NewUser {
  constructor(newUser) {
    if (!newUser || typeof newUser !== 'object') {
      throw new TypeError(`newUser must be an object. Value provided ${newUser}`);
    }
    if (!newUser.email || typeof newUser.email !== 'string') {
      throw new TypeError(`newUser.email must be a string. Value provided ${newUser.email}`);
    }
    if (!newUser.sponsorshipId || typeof newUser.sponsorshipId !== 'number') {
      throw new TypeError(`newUser.sponsorshipId must be a number. Value provided ${newUser.sponsorshipId}`);
    }

    this.email = newUser.email;
    this.sponsorshipId = newUser.sponsorshipId;

    Object.freeze(this);
  }
}