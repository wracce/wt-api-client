import { describe, it } from "vitest";
import { client } from './mockEnv';
import { log } from "console";

describe('getCollectionListUtil', () => {

    it('should return collections on success (real fetch)', async () => {
        const result = await client.fetchCollections("collaborator");
        log(result);
        // expect(result).toHaveProperty('collections');
        // Можно добавить дополнительные проверки, если известна структура ответа
    
    }, 20000);
});
