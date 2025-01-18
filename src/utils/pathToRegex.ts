/**
 * @name pathToRegex
 * @description Convertit un path style "/user/:id" ou "*" en RegExp
 * @param {string} path - Le chemin à convertir
 * @returns {RegExp} Le RegExp correspondant
 */
function pathToRegex(path: string): RegExp {
  if (path === '*') {
    // Matche tout
    return /^.*$/;
  }
  return new RegExp(
    '^' +
      path
        .replace(/\/:[^/]+/g, '/([^/]+)') // :id -> /([^/]+)
        .replace(/\//g, '\\/') + // Échappe les slash
    '$'
  );
}

export default pathToRegex;