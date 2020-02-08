import fetchWrapper from './index';

describe('Fetch Wrapper', () => {
  it('should exist', () => {
    expect(fetchWrapper).toEqual(jasmine.any(Function));
  });

  it('should throw if url is not a string', async () => {

    try {
      await fetchWrapper([],{})
    } catch (error) {
      expect(error.message).toContain('string');
    }
    
    try {
      await fetchWrapper(123,{})
    } catch (error) {
      expect(error.message).toContain('string');
    }
    
    try {
      await fetchWrapper(true,{})
    } catch (error) {
      expect(error.message).toContain('string');
    }
    
  });

  it('should throw if options is not an object', async () => {
    try {
      await fetchWrapper('aUrl2', 123);
    } catch (error) {
      expect(error.message).toContain('object');
    }
    
    try {
      await fetchWrapper('aUrl3', true);
    } catch (error) {
      expect(error.message).toContain('object');
    }
  });
});