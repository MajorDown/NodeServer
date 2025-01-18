import { IncomingMessage, ServerResponse } from 'http';
import type { OutgoingHttpHeaders } from 'http';  // <--- type-only import


type InformationalStatus = 
    | 100 // Continue
    | 101 // Switching Protocols
    | 102 // Processing (WebDAV)
    | 103; // Early Hints
type SuccessStatus = 
    | 200 // OK
    | 201 // Created
    | 202 // Accepted
    | 203 // Non-Authoritative Information
    | 204 // No Content
    | 205 // Reset Content
    | 206 // Partial Content
    | 207 // Multi-Status (WebDAV)
    | 208 // Already Reported (WebDAV)
    | 226; // IM Used (HTTP Delta encoding)
type RedirectionStatus =
    | 300 // Multiple Choices
    | 301 // Moved Permanently
    | 302 // Found
    | 303 // See Other
    | 304 // Not Modified
    | 305 // Use Proxy (Deprecated)
    | 306 // Switch Proxy (Non-utilisé)
    | 307 // Temporary Redirect
    | 308; // Permanent Redirect
type ClientErrorStatus =
    | 400 // Bad Request
    | 401 // Unauthorized
    | 402 // Payment Required
    | 403 // Forbidden
    | 404 // Not Found
    | 405 // Method Not Allowed
    | 406 // Not Acceptable
    | 407 // Proxy Authentication Required
    | 408 // Request Timeout
    | 409 // Conflict
    | 410 // Gone
    | 411 // Length Required
    | 412 // Precondition Failed
    | 413 // Payload Too Large
    | 414 // URI Too Long
    | 415 // Unsupported Media Type
    | 416 // Range Not Satisfiable
    | 417 // Expectation Failed
    | 418 // I'm a teapot (RFC 2324)
    | 421 // Misdirected Request
    | 422 // Unprocessable Entity (WebDAV)
    | 423 // Locked (WebDAV)
    | 424 // Failed Dependency (WebDAV)
    | 425 // Too Early
    | 426 // Upgrade Required
    | 428 // Precondition Required
    | 429 // Too Many Requests
    | 431 // Request Header Fields Too Large
    | 451; // Unavailable For Legal Reasons
type ServerErrorStatus =
    | 500 // Internal Server Error
    | 501 // Not Implemented
    | 502 // Bad Gateway
    | 503 // Service Unavailable
    | 504 // Gateway Timeout
    | 505 // HTTP Version Not Supported
    | 506 // Variant Also Negotiates
    | 507 // Insufficient Storage (WebDAV)
    | 508 // Loop Detected (WebDAV)
    | 510 // Not Extended
    | 511; // Network Authentication Required

export type StatusCode = InformationalStatus | SuccessStatus | RedirectionStatus | ClientErrorStatus | ServerErrorStatus;

export type ContentType = 'text/plain' | 'text/html' | 'application/json' | string;

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HTTPRequest = {
    method: HttpMethod;
    url: string;
    headers: Record<string, string>;
    params: Record<string, string>; // Ajout
};
  

export type HttpResponse = {
    writeHead: (statusCode: StatusCode, headers: OutgoingHttpHeaders) => void;
    end: (data?: string | Buffer) => void;
    send: (statusCode: StatusCode, data: string | object) => void;
    json: (statusCode: StatusCode, data: object) => void;
};

export type Middleware = (req: HTTPRequest, res: HttpResponse, next: () => void) => void;  

export type RouteHandler = (req: HTTPRequest, res: HttpResponse) => void;