import { describe, it } from "vitest";
import { client } from './mockEnv';
import { log } from "../lib/logger";

describe('fetchObjectFields', () => {

    it('should return object fields on success (real fetch)', async () => {
        const result = await client.fetchObjectFields("collaborator");
        log(result);
    }, 20000);
});
