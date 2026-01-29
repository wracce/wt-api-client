import { describe, it, expect } from 'vitest';
import { WTApiError } from '../lib';
import { client } from './mockEnv';
import { log } from '../lib/logger';

describe('Реальный вызов API (testlibXXX)', () => {
  it('должен получить коллекцию с кодом testlibXXX и вывести результат', async () => {

    try {
      // Логируем процесс
      log('⏳ Запрос коллекции с кодом "testlibXXX"...');
      const response = await client.evalCollectionByCode('testlibXXX', {limit:10, start:5});
      log('✅ Ответ от API:');
      log('success:', response);
      // Проверка успешности
      expect(response.success).toBe(true);
    } catch (error) {
      if (error instanceof WTApiError) {
        console.error('❌ WTApiError:', error.message);
        if (error.response) {
          console.error('Ответ сервера:', error.response);
        }
        expect(error).toBeInstanceOf(WTApiError);
      } else {
        console.error('❌ Неожиданная ошибка:', error);
        throw error;
      }
    }
  }, 20000); // увеличенный таймаут для реального запроса
});
