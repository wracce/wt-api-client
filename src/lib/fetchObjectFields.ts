import type { LpapiListRequest, LpapiObjectFieldsResponse } from "./types";
import type { WTCatalog } from "./catalogs";
import { lpapi } from "./lpapi";

/**
 * Получение списка полей объекта каталога
 */
export async function fetchObjectFields(baseUrl: string, catalogName?: WTCatalog, requestInit?: RequestInit): Promise<LpapiObjectFieldsResponse> {
  const payload = {
    action: 'get_object_field_list',
    catalog_name: catalogName,
  } as LpapiListRequest;
  return lpapi(baseUrl, payload, requestInit);
}
