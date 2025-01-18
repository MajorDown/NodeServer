import pathToRegex from './pathToRegex.ts';

/**
 * @name extractDynamicParams
 * @description Extrait les paramètres d'un path dynamique (ex: /user/:id).
 * @param {string} routePath - Le chemin de la route
 * @param {string} actualPath - Le chemin actuel
 * @returns {Record<string, string>} Les paramètres extraits
 */
function extractDynamicParams(routePath: string, actualPath: string): Record<string, string> {
  const paramNames = (routePath.match(/\/:([^/]+)/g) || []).map((name: string) =>
    name.substring(2)
  );
  const regExp = pathToRegex(routePath);
  const match = actualPath.match(regExp);
  const paramValues = match ? match.slice(1) : [];

  const params: Record<string, string> = {};
  paramNames.forEach((paramName, i) => {
    params[paramName] = paramValues[i];
  });
  return params;
}

export default extractDynamicParams;
