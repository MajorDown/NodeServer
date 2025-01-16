import { HTTPRequest, HttpResponse, HttpMethod } from './types';

/**
 * @class NodeRoute
 * @description Classe représentant une route d'un serveur HTTP
 * @method execute - Exécute le gestionnaire associé à la route
 * @param {HttpMethod} method - Méthode HTTP associée à la route
 * @param {string} path - Chemin associé à la route
 * @param {(req: HTTPRequest, res: HttpResponse) => void} handler - Gestionnaire associé à la route
 */
export class NodeRoute {
  public method: HttpMethod;
  public path: string;
  private handler: (req: HTTPRequest, res: HttpResponse) => void;

  constructor(
    method: HttpMethod,
    path: string,
    handler: (req: HTTPRequest, res: HttpResponse) => void
  ) {
    this.method = method;
    this.path = path;
    this.handler = handler;
  }

  // Exécute le gestionnaire associé à la route
  public execute(req: HTTPRequest, res: HttpResponse): void {
    this.handler(req, res);
  }
}
