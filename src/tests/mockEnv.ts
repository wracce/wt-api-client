import 'dotenv/config';

import { WTApiClient } from "../lib";


export const client = new WTApiClient({
    baseUrl: process.env.API_URL || '',
    requestInit: {
        "headers": {
            'Cookie': process.env.API_COOKIE || ''
        }
    }
});