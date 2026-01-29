import { describe, it } from "vitest";
import { client } from './mockEnv';
import { log } from "../lib/logger";

describe('fetchActions', () => {

    it('should return actions on success (real fetch)', async () => {
        const result = await client.fetchActions("collaborator");
        log(result);
    }, 20000);
});
