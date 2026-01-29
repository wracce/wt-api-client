import type { LpapiObjectRequest, LpapiResponse } from "./types";
import { lpapi } from "./lpapi";

/**
 * Утилита для получения коллекции через lpapi.html
 */
export async function fetchCollection<T = LpapiResponse>(
  baseUrl: string,
  objectId?: string,
  requestInit?: RequestInit
): Promise<T> {
  const payload = {
    action: 'get_collection',
    object_id: objectId
  } as LpapiObjectRequest;
  return lpapi(baseUrl, payload, requestInit);
}
