import type { LpapiCollectionsResponse, LpapiListRequest } from "./types";
import type { WTCatalog } from "./catalogs";
import { lpapi } from "./lpapi";

/**
 * Утилита для получения списка коллекций через lpapi.html
 */
export async function fetchCollections<T = LpapiCollectionsResponse>(
  baseUrl: string,
  catalogName?: WTCatalog,
  requestInit?: RequestInit
): Promise<T> {
  const payload = {
    action: 'get_collection_list',
    catalog_name: catalogName
  } as LpapiListRequest;
  return lpapi(baseUrl, payload, requestInit);
}
