import type { WTCatalog } from "./catalogs";

export type LpapiAction = 'init_step_1' |
  'init_step_2' |
  'init_step_3' |
  'init_data' |
  'get_web_mode' |
  'save_web_mode_structure' |
  'delete_web_mode' |
  'get_collection_list' |
  'get_object_field_list' |
  'get_collection' |
  'get_action' |
  'get_action_list' |
  'upload_chunk' |
  'eval_action' |
  'get_fe_name' |
  'copy_web_mode'


export interface LpapiObjectField {
  id: string;
  name: string;
  type: string;
  title: string;
  desc: string;
}

export interface LpapiList {
  catalog_name: WTCatalog;
}
export interface LpapiObject {
  object_id: string;
}
export interface LpapiActions {
  actions: Object[] // TODO: уточнить тип;
}
export interface LpapiCollections {
  collections: Object[] // TODO: уточнить тип;
}

export interface LpapiObjectFields {
  object_fields: LpapiObjectField[];
}

export interface LpapiRequest {
  action: LpapiAction;
  [key: string]: unknown; 
}

export interface LpapiResponse {
  error: number,
  error_text: string,
  action_completed: LpapiAction;
}

export interface LpapiListRequest extends LpapiRequest, LpapiList {}
export interface LpapiObjectRequest extends LpapiRequest, LpapiObject {}

export interface LpapiActionsResponse extends LpapiResponse, LpapiActions {
  action_completed: 'get_action_list';
}
export interface LpapiObjectFieldsResponse extends LpapiResponse, LpapiObjectFields {
  action_completed: 'get_object_field_list';
}
export interface LpapiCollectionsResponse extends LpapiResponse, LpapiCollections {
  action_completed: 'get_collection_list';
}

export type SortDirection = 'asc' | 'desc';

export type SafeRequestInit = Omit<RequestInit, 'method' | 'body' | 'credentials'>;

export interface SortParameter {
  property: string;
  direction: SortDirection;
}

export interface CollectionRequestParams {
  collectionCode?: string;
  collectionId?: string;
  limit?: number;
  start?: number;
  parameters?: Record<string, string>;
  userId?: string;
  sortBy?: string;
  direction?: SortDirection;
  treeNodeId?: string;
  refererUrl?: string;
}

export interface CollectionResponse<T = any> {
  success: boolean;
  messageText: string;
  results: T[];
  columns?: any[];
  total?: number;
  sorters?: SortParameter[];
}

export interface WTApiClientOptions {
  baseUrl?: string;
  requestInit?: SafeRequestInit;
}

export interface WvarParam {
  name: string;
  value: string | number;
}

export interface EvalActionParams {
  command?: string
  form_fields?: Record<string, string>;
  wvars?: WvarParam[];
  page_url?: string;
}
