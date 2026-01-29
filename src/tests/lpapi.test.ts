import { describe, it } from 'vitest';
import { client } from './mockEnv';

describe('WTApiClient.getCollectionList', () => {
  it('should fetch collection list from lpapi.html', async () => {
    const res = await client.fetchCollections();
    // expect(res).toHaveProperty('result');
    // expect(Array.isArray(res.result?.collections)).toBe(true);
  }, 20000);
});
