import { describe, it } from "vitest";
import { client } from './mockEnv';
import { log } from "../lib/logger";

describe('fetchAction', () => {

    it('should return action on success (real fetch)', async () => {
        const result = await client.fetchAction("5709302381483599564");
        log(result);
    }, 20000);
});
