/**
 * @description Génère un identifiant unique basé sur YYMMDDHHMMSSMMM
 * @returns string (15 chiffres)
 */
function generateUniqueId(): string {
    const now = new Date();
    return now.toISOString().slice(2, 4) + // YY
           now.toISOString().slice(5, 7) + // MM
           now.toISOString().slice(8, 10) + // DD
           now.toISOString().slice(11, 13) + // HH
           now.toISOString().slice(14, 16) + // MM
           now.toISOString().slice(17, 19) + // SS
           now.getMilliseconds().toString().padStart(3, '0'); // MMM
}

export default generateUniqueId;