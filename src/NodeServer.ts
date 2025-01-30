import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import fs from 'fs';
import path from 'path';
import pathToRegex from './utils/pathToRegex.ts';
import extractDynamicParams from './utils/extractDynamicParams.ts';
import getContentType from './utils/getContentType.ts';
import { createHttpResponse } from './utils/createHttpResponse.ts';
import type { HTTPRequest, HttpMethod, RouteHandler } from './types.ts';
import NotFoundPage from './pages/NotFound.ts';
import HomePage from './pages/Home.ts';

/*
* @name NodeServer
* @description Classe permettant d'établir un server HTTP
* @method get - Définit une route HTTP GET
* @method post - Définit une route HTTP POST
* @method put - Définit une route HTTP PUT
* @method patch - Définit une route HTTP PATCH
* @method delete - Définit une route HTTP DELETE
* @method static - Définit un dossier pour servir des fichiers statiques
* @method listen - Démarre le serveur sur un port donné
* @property routes - Une liste des routes définies
* @property routes[x].method - La méthode HTTP de la route x
* @property routes[x].path - Le chemin de la route x
* @property routes[x].regex - Le RegExp correspondant à la route x
* @property routes[x].handler - Le gestionnaire de la route x
* @property staticRoutes - Une liste des dossiers définis pour les fichiers statiques
* @property staticRoutes[x].urlPath - Le chemin URL pour le dossier statique x
* @property staticRoutes[x].directory - Le dossier local correspondant au chemin URL
* @property staticRoutes[x].callback - Une fonction callback optionnelle appelée lors de l'accès à un fichier
*/
class NodeServer {
  private routes: {
    method: HttpMethod;
    path: string;
    regex: RegExp;
    handler: RouteHandler;
  }[] = [];

  private staticRoutes: {
    urlPath: string;
    directory: string;
    callback?: () => void;
  }[] = [];

  constructor() {
    // Définir le dossier ./public par défaut pour les fichiers statiques
    this.static('/public');
  }

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

  public static(urlPath: string, callback?: () => void): void {
    const directory = path.join(process.cwd(), urlPath);
    this.staticRoutes.push({ urlPath, directory, callback });
  }

  public listen(port: number, callback?: () => void): void {
    const server = createServer((req: IncomingMessage, res: ServerResponse) => {
      const { method, url } = req;
      const methodCast = method as HttpMethod;
      const parsedUrl = parse(url || '', true);
      const pathName = parsedUrl.pathname || '';

      // Servir des fichiers statiques
      for (const staticRoute of this.staticRoutes) {
        if (pathName.startsWith(staticRoute.urlPath)) {
          const relativePath = pathName.slice(staticRoute.urlPath.length);
          const filePath = path.join(staticRoute.directory, relativePath);

          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const fileStream = fs.createReadStream(filePath);
            res.writeHead(200, { 'Content-Type': getContentType(filePath) });
            fileStream.pipe(res);
            fileStream.on('end', () => {
              if (staticRoute.callback) staticRoute.callback();
            });
            fileStream.on('error', () => {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
            });
            return;
          }
        }
      }

      // On trouve la route correspondante
      const matchingRoute = this.routes.find(
        (route) => route.method === methodCast && route.regex.test(pathName)
      );

      // Préparation Request/Response
      const request: HTTPRequest = {
        method: methodCast,
        url: pathName,
        headers: req.headers as Record<string, string>,
        params: {},
      };
      const response = createHttpResponse(res);

      if (matchingRoute) {
        request.params = extractDynamicParams(matchingRoute.path, pathName);
        matchingRoute.handler(request, response);
      } else {
        // Aucune route ne correspond
        if (methodCast === 'GET' && pathName === '/') {
          response.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          response.end(HomePage);
        }
        else if (methodCast === 'GET') {
          response.writeHead(404, { 'Content-Type': 'text/html; charset=UTF-8' });
          response.end(NotFoundPage);
        } else {
          response.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
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
