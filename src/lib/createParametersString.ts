/**
 * Преобразует объект параметров в строку вида key1=val1;key2=val2
 */
export function createParametersString(params: Record<string, string | number>): string {
  return Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
    .join(';');
}
