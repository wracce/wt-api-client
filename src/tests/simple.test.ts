/**
 * Простые тесты для WT API Wrapper с Vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WTApiClient, WTApiError } from '../lib';
import { client } from './mockEnv';

// Мокаем fetch
(globalThis as any).fetch = vi.fn();



describe('WTApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('должен создавать клиент с настройками по умолчанию', () => {
    const client = new WTApiClient();
    expect(client).toBeInstanceOf(WTApiClient);
  });

  it('должен создавать клиент с пользовательскими настройками', () => {
    expect(client).toBeInstanceOf(WTApiClient);
  });

  it('должен успешно выполнить запрос getByCode', async () => {
    const mockResponse = {
      success: true,
      messageText: '',
      results: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
      ],
      total: 2
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const client = new WTApiClient();
    const result = await client.evalCollectionByCode('users_list');

    expect(result).toEqual(mockResponse);
    expect(fetch).toHaveBeenCalledWith(
      '/pp/Ext5/extjs_json_collection_data.html',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      })
    );
    // Проверяем что FormData содержит правильные данные
    const call = (fetch as any).mock.calls[0];
    const formData = call[1].body as FormData;
    const entries = Array.from(formData.entries());
    const get = (key: string) => entries.find(([k]) => k === key)?.[1];
    expect(get('collection_code')).toBe('users_list');
  });

  it('должен обрабатывать ошибку API с success: false', async () => {
    const mockErrorResponse = {
      success: false,
      messageText: 'Data source not found',
      results: []
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockErrorResponse)
    });

    const client = new WTApiClient();

    await expect(client.evalCollectionByCode('non_existent_collection')).rejects.toThrow('Data source not found');
  });

  it('должен обрабатывать сетевые ошибки', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const client = new WTApiClient();

    await expect(client.evalCollectionByCode('test_collection')).rejects.toThrow('Network error');
  });

  it('должен правильно формировать запрос с параметрами', async () => {
    const mockResponse = {
      success: true,
      messageText: '',
      results: [],
      total: 0
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    });

    const client = new WTApiClient();

    const parameters = {
      department: 'IT',
      active: "1"
    };

    await client.evalCollectionByCode('filtered_users', {
      parameters,
      limit: 50,
      start: 0
    });

    expect(fetch).toHaveBeenCalledWith(
      '/pp/Ext5/extjs_json_collection_data.html',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      })
    );

    // Проверяем что FormData содержит правильные данные
    const call = (fetch as any).mock.calls[0];
    const formData = call[1].body as FormData;
    const entries = Array.from(formData.entries());
    const get = (key: string) => entries.find(([k]) => k === key)?.[1];
    expect(get('collection_code')).toBe('filtered_users');
    expect(get('parameters')).toBe('department=IT;active=1');
    expect(get('limit')).toBe('50');
    expect(get('start')).toBe('0');
  });
});

describe('WTApiError', () => {
  it('должен создавать ошибку с сообщением', () => {
    const error = new WTApiError('Test error message');

    expect(error).toBeInstanceOf(Error);
    expect(error.message).toBe('Test error message');
    expect(error.name).toBe('WTApiError');
  });

  it('должен создавать ошибку с ответом сервера', () => {
    const response = {
      success: false,
      messageText: 'Server error',
      results: []
    };

    const error = new WTApiError('API Error', response, 500);

    expect(error.message).toBe('API Error');
    expect(error.response).toEqual(response);
    expect(error.status).toBe(500);
    expect(error.name).toBe('WTApiError');
  });
});


