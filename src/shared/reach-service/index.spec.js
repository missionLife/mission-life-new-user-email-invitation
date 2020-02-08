import ReachService from './index';
import * as fetchWrapper from '../fetch-wrapper';

describe('Reach Service', () => {

  it('should exist', () => {
    expect(ReachService).toEqual(jasmine.any(Function));
  });

  describe('Get Supporters', () => {
    beforeEach(() => {
      spyOn(fetchWrapper, 'default').and.returnValue(Promise.resolve([]));
    });

    it('should throw an error when sponsorships is not an array', async () => {
      try {
        const reachService = new ReachService();

        await reachService.getSupporters(123);
      } catch (error) {
        expect(error.message).toContain('object');
      }
    });
  });

  describe('Get Sponsorships', () => {
    beforeEach(() => {
      spyOn(fetchWrapper, 'default').and.returnValue(Promise.resolve([{}]));
    });

    it('should throw an error when pageNumber is not a number', async () => {
      try {
        const reachService = new ReachService();

        await reachService.getAllSponsorships([], []);
      } catch (error) {
        expect(error.message).toContain('number');
      }
    });

    it('should throw an error when sponsorships is not an array', async () => {
      try {
        const reachService = new ReachService();

        await reachService.getAllSponsorships(1, 123);
      } catch (error) {
        expect(error.message).toContain('array');
      }
    });
  });
});

