import type { EvalActionParams, SafeRequestInit } from "./types";
import { lpapi } from "./lpapi";

/**
 * Выполнить remote action через lpapi.html
 * @param baseUrl базовый URL
 * @param params параметры для remote action
 * @param requestInit дополнительные опции fetch
 */
export async function evalAction<T = any>(
    remoteActionId: string,
    baseUrl: string,
    params: EvalActionParams,
    requestInit?: SafeRequestInit
): Promise<T> {
    // Формируем action payload
    const actionPayload: any = {
        action: "eval_action",
        remote_action_id: remoteActionId,
    };

    if (params?.command)
        actionPayload.command = params.command;

    if (params?.form_fields)
        actionPayload.form_fields = params.form_fields;

    if (params?.wvars)
        actionPayload.wvars = params.wvars;

    if (params?.page_url)
        actionPayload.page_url = params.page_url;

    return lpapi<T>(baseUrl, actionPayload, requestInit);
}
