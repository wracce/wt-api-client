import type { TypeDocOptions } from "typedoc";

export default {
    "entryPoints": ["src/lib/index.ts"],
    "name": "WTAdapter",
    "hideGenerator": true,
} as Partial<TypeDocOptions>;