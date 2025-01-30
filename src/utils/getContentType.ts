import path from 'path';

/*
* @name getContentType
* @description Récupère le type MIME d'un fichier
* @param {string} filePath - Le chemin du fichier
* @returns {string} Le type MIME du fichier
**/
function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html';
        case '.css': return 'text/css';
        case '.js': return 'application/javascript';
        case '.json': return 'application/json';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}

export default getContentType;