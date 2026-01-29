import { describe, it, expect } from 'vitest';
import { createParametersString } from '../lib/createParametersString';

/**
 * Тесты для функции createParametersString, включая проверку русских символов.
 */
describe('createParametersString', () => {
    it('should convert a simple object to a parameter string', () => {
        const params = { a: '1', b: '2' };
        expect(createParametersString(params)).toBe('a=1;b=2');
    });

    it('should handle numbers as values', () => {
        const params = { x: 42, y: 7 };
        expect(createParametersString(params)).toBe('x=42;y=7');
    });

    it('should encode special characters in values', () => {
        const params = { q: 'hello world', s: 'a&b=c' };
        expect(createParametersString(params)).toBe('q=hello%20world;s=a%26b%3Dc');
    });

    it('should encode special characters in keys', () => {
        const params = { 'a b': 'value', 'x/y': 'test' };
        expect(createParametersString(params)).toBe('a b=value;x/y=test');
    });

    it('should handle an empty object', () => {
        expect(createParametersString({})).toBe('');
    });

    it('should handle single key-value pair', () => {
        expect(createParametersString({ key: 'value' })).toBe('key=value');
    });

    it('should handle numeric string values', () => {
        expect(createParametersString({ num: '123' })).toBe('num=123');
    });

    it('должна корректно кодировать русские символы в ключах и значениях', () => {
        const params = { 'ключ': 'значение', 'тест': 'пример' };
        expect(createParametersString(params)).toBe(
            `ключ=${encodeURIComponent('значение')};тест=${encodeURIComponent('пример')}`
        );
    });

    it('должна работать с русскими символами и спецсимволами', () => {
        const params = { 'имя пользователя': 'Иван Иванов', 'город': 'Москва&Питер' };
        expect(createParametersString(params)).toBe(
            `имя пользователя=${encodeURIComponent('Иван Иванов')};город=${encodeURIComponent('Москва&Питер')}`
        );
    });

    it('should handle mixed language keys and values', () => {
        const params = { 'name': 'Иван', 'город': 'Moscow' };
        expect(createParametersString(params)).toBe(
            `name=${encodeURIComponent('Иван')};город=${encodeURIComponent('Moscow')}`
        );
    });

    it('should handle empty string values', () => {
        const params = { a: '', b: 'тест' };
        expect(createParametersString(params)).toBe(`a=;b=${encodeURIComponent('тест')}`);
    });

    it('should handle keys and values with only spaces', () => {
        const params = { ' ': ' ', 'ключ': ' ' };
        expect(createParametersString(params)).toBe(
            ` =%20;ключ=%20`
        );
    });
});