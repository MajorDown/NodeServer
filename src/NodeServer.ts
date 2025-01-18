import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import pathToRegex from './utils/pathToRegex.ts';
import extractDynamicParams from './utils/extractParams.ts';
import { createHttpResponse } from './utils/createHttpResponse.ts';
import type { HTTPRequest, HttpMethod, RouteHandler } from './types.ts';

/*
* @name NodeServer
* @description Classe permettant d'établir un server HTTP
* @method get - Définit une route HTTP GET
* @method post - Définit une route HTTP POST
* @method put - Définit une route HTTP PUT
* @method patch - Définit une route HTTP PATCH
* @method delete - Définit une route HTTP DELETE
* @method listen - Démarre le serveur sur un port donné
* @property routes - Une des des routes définies
* @property routes[x].method - La méthode HTTP de la route x
* @property routes[x].path - Le chemin de la route x
* @property routes[x].regex - Le RegExp correspondant à la route x
* @property routes[x].handler - Le gestionnaire de la route x
*/
class NodeServer {
  private routes: {
    method: HttpMethod;
    path: string;
    regex: RegExp;
    handler: RouteHandler;
  }[] = [];

  public get(path: string, handler: RouteHandler): void {
    this.createRoute('GET', path, handler);
  }
  public post(path: string, handler: RouteHandler): void {
    this.createRoute('POST', path, handler);
  }
  public put(path: string, handler: RouteHandler): void {
    this.createRoute('PUT', path, handler);
  }
  public patch(path: string, handler: RouteHandler): void {
    this.createRoute('PATCH', path, handler);
  }
  public delete(path: string, handler: RouteHandler): void {
    this.createRoute('DELETE', path, handler);
  }

  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const { method, url } = req;
      const methodCast = method as HttpMethod;
      const parsedUrl = parse(url || '', true);
      const path = parsedUrl.pathname || '';

      // On trouve la route correspondante
      const matchingRoute = this.routes.find(
        (route) => route.method === methodCast && route.regex.test(path)
      );

      // Préparation Request/Response
      const request: HTTPRequest = {
        method: methodCast,
        url: path,
        headers: req.headers as Record<string, string>,
        params: {},
      };
      const response = createHttpResponse(res);

      if (matchingRoute) {
        request.params = extractDynamicParams(matchingRoute.path, path);
        matchingRoute.handler(request, response);
      } else {
        // Aucune route ne correspond
        if (methodCast === 'GET') {
          response.end('404 - Page not found (GET default)');
        } else {
          response.end('404 - Resource not found');
        }
      }
    });

    server.listen(port, callback);
  }

  private createRoute(method: HttpMethod, path: string, handler: RouteHandler): void {
    const regex = pathToRegex(path);
    this.routes.push({ method, path, regex, handler });
  }
}

export default NodeServer;
