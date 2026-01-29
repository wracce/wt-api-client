
import type { CollectionRequestParams, CollectionResponse, EvalActionParams, LpapiActionsResponse, LpapiCollectionsResponse, LpapiObjectFieldsResponse, LpapiResponse, SafeRequestInit, WTApiClientOptions } from "./types";
import type { WTCatalog } from "./catalogs";
import { evalAction } from "./evalAction";
import { evalCollection } from "./evalCollection";
import { fetchCollections } from "./fetchCollections";
import { fetchObjectFields } from "./fetchObjectFields";
import { fetchActions } from "./fetchActions";
import { fetchCollection } from "./fetchCollection";
import { fetchAction } from "./fetchAction";

export class WTApiClient {
  private baseUrl: string;
  private requestInit: SafeRequestInit;

  constructor({ baseUrl, requestInit }: WTApiClientOptions = {}) {
    this.baseUrl = baseUrl || '';
    this.requestInit = requestInit || {};
  }

  /**
   * Получить коллекцию по коду
   */
  async evalCollectionByCode<T = any>(
    collectionCode: string,
    options: Omit<CollectionRequestParams, 'collection_code'> = {}
  ): Promise<CollectionResponse<T>> {
    return evalCollection<T>(
      this.baseUrl,
      {
        ...options,
        collectionCode: collectionCode
      },
      this.requestInit
    );
  }

  /**
   * Получить коллекцию по ID
   */
  async evalCollectionById<T = any>(
    collectionId: string,
    options: Omit<CollectionRequestParams, 'collection_id'> = {}
  ): Promise<CollectionResponse<T>> {
    return evalCollection<T>(
      this.baseUrl,
      {
        ...options,
        collectionId: collectionId,
      },
      this.requestInit,
    );
  }

  /**
   * Выполнить remote action через lpapi.html
   * @param remoteActionId ID удаленного действия
   * @param params Параметры действия
   */
  async evalAction<T = any>(
    remoteActionId: string,
    params: EvalActionParams,
  ): Promise<T> {
    return evalAction<T>(remoteActionId, this.baseUrl, params, this.requestInit);
  }

  /**
   * Получить список коллекций через lpapi.html
   * @returns {Promise<LpapiResponse<{ collections: any[] }>>}
   */
  async fetchCollections(catalogName?: WTCatalog): Promise<LpapiCollectionsResponse> {
    return fetchCollections(this.baseUrl, catalogName, this.requestInit);
  }

  /**
   * Получить коллекцию по ID
   * @param objectId ID объекта
   * @returns {Promise<LpapiResponse<{ collection: any }>>}
   */
  async fetchCollection(
    objectId?: string,
  ): Promise<LpapiResponse> {
    return fetchCollection(this.baseUrl, objectId, this.requestInit);
  }

  /**
   * Получить список Удаленных действий
   * @param catalogName Имя каталога
   * @returns {Promise<LpapiResponse<{ collections: any[] }>>}
   */
  async fetchActions(catalogName?: WTCatalog): Promise<LpapiActionsResponse> {
    return fetchActions(this.baseUrl, catalogName, this.requestInit);
  }


  /**
   * Получить действие для указанного objectId через API.
   *
   * @param objectId - Необязательный идентификатор объекта, для которого нужно получить действие.
   * @returns Promise, который возвращает `LpapiResponse` с результатом операции.
   */
  async fetchAction(
    objectId?: string,
  ): Promise<LpapiResponse> {
    return fetchAction(this.baseUrl, objectId, this.requestInit);
  }

  /**
   * Получить список полей объекта каталога
   * @param catalogName Имя каталога
   * @returns {Promise<LpapiResponse<{ collections: any[] }>>}
   */
  async fetchObjectFields(catalogName?: WTCatalog): Promise<LpapiObjectFieldsResponse> {
    return fetchObjectFields(this.baseUrl, catalogName, this.requestInit);
  }

}
