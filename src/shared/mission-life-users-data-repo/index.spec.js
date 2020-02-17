import MissionLifeUsersDataRepo from "./index";
import SupporterSponsorship from "../models/supporter-sponsorship";

describe("Mission Life Users Data Repo", () => {
  it("should exist", () => {
    expect(MissionLifeUsersDataRepo).toEqual(jasmine.any(Function));
  });

  let documentClientSpy;
  let supporterSponsorship;

  beforeEach(() => {
    documentClientSpy = jasmine.createSpyObj("documentClientSpy", ["query"]);
    supporterSponsorship = new SupporterSponsorship("aUser@email.com", 123);
  });

  describe("checkIfUserExists", () => {
    it("Should return true if a user exists", async () => {
      documentClientSpy.query.and.returnValue({
        promise: () => Promise.resolve({ Count: 1 })
      });

      const missionLifeUsersDataRepo = new MissionLifeUsersDataRepo(
        documentClientSpy
      );

      const usersExists = await missionLifeUsersDataRepo.checkIfUserExists(
        supporterSponsorship
      );

      expect(usersExists).toEqual(true);
    });
    
    it("Should return false if a user does NOT exist", async () => {
      documentClientSpy.query.and.returnValue({
        promise: () => Promise.resolve({ Count: 0 })
      });

      const missionLifeUsersDataRepo = new MissionLifeUsersDataRepo(
        documentClientSpy
      );

      const usersExists = await missionLifeUsersDataRepo.checkIfUserExists(
        supporterSponsorship
      );

      expect(usersExists).toEqual(false);
    });
  });
});
