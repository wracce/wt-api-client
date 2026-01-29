import type { LpapiObjectRequest, LpapiResponse } from "./types";
import { lpapi } from "./lpapi";

/**
 * Утилита для получения действия через lpapi.html
 */
export async function fetchAction<T = LpapiResponse>(
  baseUrl: string,
  objectId?: string,
  requestInit?: RequestInit
): Promise<T> {
  const payload = {
    action: 'get_action',
    object_id: objectId
  } as LpapiObjectRequest;
  return lpapi(baseUrl, payload, requestInit);
}
