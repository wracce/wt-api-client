import type { CollectionResponse } from "./types";

export class WTApiError extends Error {
  constructor(
    message: string,
    public response?: CollectionResponse,
    public status?: number
  ) {
    super(message);
    this.name = 'WTApiError';
  }
}
