// src/utils/createHttpResponse.ts
import { ServerResponse, type OutgoingHttpHeaders } from 'http';
import type { StatusCode, HttpResponse } from '../types.ts';

/**
 * @name createHttpResponse
 * @description Fabrique un objet HttpResponse "haut niveau" autour du ServerResponse natif
 * @param {ServerResponse} res - L'objet ServerResponse natif
 * @returns {HttpResponse} Un objet HttpResponse
 */
export function createHttpResponse(res: ServerResponse): HttpResponse {
  return {
    writeHead: (statusCode: StatusCode, headers: OutgoingHttpHeaders) => {
      res.writeHead(statusCode, headers);
    },
    end: (data?: string | Buffer) => {
      res.end(data);
    },
    send: (statusCode: StatusCode, data: string | object) => {
      if (typeof data === 'object') {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      } else {
        res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
        res.end(data);
      }
    },
    json: (statusCode: StatusCode, data: object) => {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    }
  };
}
