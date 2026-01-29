import { describe, it } from "vitest";
import { client } from './mockEnv';
import { log } from "../lib/logger";

describe('fetchCollection', () => {

    it('should return collection on success (real fetch)', async () => {
        const result = await client.fetchCollection("7008035568091649799");
        log(result);
    }, 20000);
});
