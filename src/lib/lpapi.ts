import type { LpapiRequest, LpapiResponse } from "./types";
import { WTApiError } from "./error";
import { log } from "./logger";

/**
 * Общая утилита для работы с lpapi.html
 */
export async function lpapi<T = LpapiResponse>(baseUrl: string, payload: LpapiRequest, requestInit?: RequestInit): Promise<T> {
    const url = baseUrl + '/lpapi.html';
    const formData = new FormData();
    formData.append('action', JSON.stringify(payload));
    const res = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        ...(requestInit || {})
    });
    if (!res.ok) {
        throw new WTApiError(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    if (data.error) {
        log('Error in lpapi response:', data);
        throw new WTApiError(data.error.message || 'Unknown lpapi error', data.error.code);
    }
    return data as T;
}
