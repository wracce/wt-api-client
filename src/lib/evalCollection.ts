import type { CollectionRequestParams, CollectionResponse, SafeRequestInit } from "./types";
import { createParametersString } from "./createParametersString";

/**
 * Универсальная утилита для запроса коллекций
 */

export async function evalCollection<T = any>(
  baseUrl: string,
  params: CollectionRequestParams,
  requestInit?: SafeRequestInit
): Promise<CollectionResponse<T>> {
  const url = baseUrl + "/pp/Ext5/extjs_json_collection_data.html";
  
  const data = new FormData();

  // Формируем параметры согласно интерфейсу
  if (params.collectionId) data.append('collection_id', String(params.collectionId));
  if (params.collectionCode) data.append('collection_code', String(params.collectionCode));
  if (params.limit !== undefined) data.append('limit', String(params.limit));
  if (params.start !== undefined) data.append('start', String(params.start));
  if (params.userId) data.append('user_id', params.userId);
  if (params.sortBy) data.append('sort_column_id', params.sortBy);
  if (params.direction) data.append('sort_column_direction', params.direction);
  if (params.refererUrl) data.append('referer_url', params.refererUrl);

  if (params.treeNodeId) {
    data.append('tree',"1")
    data.append('tree_node_id', params.treeNodeId);
  }

  if (params.parameters) {
    const paramStr = createParametersString(params.parameters);
    data.append('parameters', paramStr);
  }
  // data.append('sort','{"property": "name", "direction": "ASC"}')

  const res = await fetch(url, {
    method: "POST",
    headers: {
      ...requestInit?.headers || {},
      // "Content-Type": "application/x-www-form-urlencoded"
    },
    body: data,
    // credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }

  const resp = await res.json();

  if (resp && resp.success === false) {
    throw new Error(resp.messageText || 'API error');
  }
  return resp;
}
