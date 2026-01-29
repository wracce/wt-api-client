import type { LpapiActionsResponse, LpapiListRequest } from "./types";
import type { WTCatalog } from "./catalogs";
import { lpapi } from "./lpapi";

/**
 * Получить список Удаленных действий
 */
export async function fetchActions<T = LpapiActionsResponse>(
  baseUrl: string,
  catalogName?: WTCatalog,
  requestInit?: RequestInit
): Promise<T> {
  const payload = {
    action: 'get_action_list',
    catalog_name: catalogName
  } as LpapiListRequest;
  return lpapi(baseUrl, payload, requestInit);
}
