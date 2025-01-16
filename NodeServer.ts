import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { HTTPRequest, HttpResponse, HttpMethod, RouteHandler } from './types';

/*
 * @class NodeServer
 * @description Classe pouvant instancier un serveur HTTP
 */
class NodeServer {
  /*
   * @property routes
   * @description Routes du serveur
   * @type {Map<string, RouteHandler>}
   */
  private routes: Map<string, RouteHandler> = new Map();

  /*
   * @method registerRoute
   * @description Enregistre une route dans la map des routes
   * @param {HttpMethod} method - Méthode HTTP associée à la route
   * @param {string} path - Chemin associé à la route
   * @param {(req: HTTPRequest, res: HttpResponse) => void} handler - Gestionnaire associé à la route
   * @returns {void}
   */
  private registerRoute(method: HttpMethod, path: string, handler: RouteHandler): void {
    const key = `${method}:${path}`;
    this.routes.set(key, handler);
  }

  // Méthodes pour chaque type de requête HTTP
  public get(path: string, handler: RouteHandler): void {
    this.registerRoute('GET', path, handler);
  }

  public post(path: string, handler: RouteHandler): void {
    this.registerRoute('POST', path, handler);
  }

  public put(path: string, handler: RouteHandler): void {
    this.registerRoute('PUT', path, handler);
  }

  public delete(path: string, handler: RouteHandler): void {
    this.registerRoute('DELETE', path, handler);
  }

  public patch(path: string, handler: RouteHandler): void {
    this.registerRoute('PATCH', path, handler);
  }

  /*
   * @method listen
   * @description Lance le serveur sur un port donné
   * @param {number} port - Port sur lequel le serveur doit écouter
   * @param {() => void} callback - Fonction à exécuter une fois le serveur lancé
   * @returns {void}
   */
  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const { method, url } = req;
      const parsedUrl = parse(url || '', true);
      const key = `${method}:${parsedUrl.pathname}`;
      const handler = this.routes.get(key);

      if (handler) {
        const request: HTTPRequest = {
          method: method as HttpMethod,
          url: parsedUrl.pathname || '',
          headers: req.headers as Record<string, string>,
        };
        const response: HttpResponse = {
          writeHead: (statusCode, headers) => res.writeHead(statusCode, headers),
          end: (data) => res.end(data),
          send: (statusCode, data) => {
            if (typeof data === 'object') {
              res.writeHead(statusCode, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(data));
            } else {
              res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
              res.end(data);
            }
          },
          json: (statusCode, data) => {
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          },
        };
        handler(request, response);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page not found');
      }
    });
    server.listen(port, callback);
  }
}

export default NodeServer;
