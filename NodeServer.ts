import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import type { HTTPRequest, HttpResponse, HttpMethod, RouteHandler } from './types.ts';

class NodeServer {
  /**
   * @property routes
   * Liste interne des routes enregistrées.
   */
  private routes: {
    method: HttpMethod;
    path: string;
    regex: RegExp;
    handler: RouteHandler;
  }[] = [];

  /**
   * @method get
   * Pour enregistrer un handler sur GET
   */
  public get(path: string, handler: RouteHandler): void {
    this.registerRoute('GET', path, handler);
  }

  /**
   * @method post
   * Pour enregistrer un handler sur POST
   */
  public post(path: string, handler: RouteHandler): void {
    this.registerRoute('POST', path, handler);
  }

  /**
   * @method put
   * Pour enregistrer un handler sur PUT
   */
  public put(path: string, handler: RouteHandler): void {
    this.registerRoute('PUT', path, handler);
  }

  /**
   * @method patch
   * Pour enregistrer un handler sur PATCH
   */
  public patch(path: string, handler: RouteHandler): void {
    this.registerRoute('PATCH', path, handler);
  }

  /**
   * @method delete
   * Pour enregistrer un handler sur DELETE
   */
  public delete(path: string, handler: RouteHandler): void {
    this.registerRoute('DELETE', path, handler);
  }

  /**
   * @method listen
   * Lance le serveur sur le port spécifié.
   */
  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const { method, url } = req;
      const parsedUrl = parse(url || '', true);
      const path = parsedUrl.pathname || '';

      // On récupère la méthode sous forme de chaîne
      const methodCast = method as HttpMethod;

      // Recherche d'une route correspondant à la méthode + path
      const matchingRoute = this.routes.find(
        (route) => route.method === methodCast && route.regex.test(path)
      );

      // Création d'un objet request/response plus ergonomique
      const request: HTTPRequest = {
        method: methodCast,
        url: path,
        headers: req.headers as Record<string, string>,
        params: {},
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

      if (matchingRoute) {
        // Extraire les params dynamiques si nécessaire
        request.params = this.extractParams(matchingRoute.path, path);
        matchingRoute.handler(request, response);
      } else {
        // Aucune route n'a été trouvée
        if (methodCast === 'GET') {
          // 404 pour GET
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Page not found (GET default)');
        } else {
          // 404 "générique" pour POST, PUT, PATCH, DELETE
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 - Resource not found');
        }
      }
    });

    server.listen(port, callback);
  }

  /**
   * @method registerRoute
   * Enregistre et transforme le path en RegExp si nécessaire
   */
  private registerRoute(method: HttpMethod, path: string, handler: RouteHandler): void {
    const regex = this.pathToRegex(path);
    this.routes.push({ method, path, regex, handler });
  }

  /**
   * @method pathToRegex
   * Transforme un path dynamique ("/user/:id") ou "*" en RegExp
   */
  private pathToRegex(path: string): RegExp {
    if (path === '*') {
      // Si l'utilisateur définit app.get('*'), on matche absolument TOUT
      return /^.*$/;
    }
    return new RegExp(
      '^' +
        path
          .replace(/\/:[^/]+/g, '/([^/]+)') // Remplace :param par /([^/]+)
          .replace(/\//g, '\\/') + // Échappe les slash
      '$'
    );
  }

  /**
   * @method extractParams
   * Extrait les paramètres d'un path dynamique
   */
  private extractParams(routePath: string, actualPath: string): Record<string, string> {
    const paramNames = (routePath.match(/\/:([^/]+)/g) || []).map((name) =>
      name.substring(2)
    );
    const match = actualPath.match(this.pathToRegex(routePath));
    const paramValues = match ? match.slice(1) : [];

    const params: Record<string, string> = {};
    paramNames.forEach((paramName, index) => {
      params[paramName] = paramValues[index];
    });
    return params;
  }
}

export default NodeServer;
