import fs from 'fs';
import path from 'path';

class DataModelManager {
    /**
     * @description Charge un schéma TypeScript (`.model.ts`) et l'extrait en JSON exploitable
     * @param fileName Nom du modèle (ex: "User")
     */
    public static getSchema(fileName: string): Record<string, any> {
        const modelPath = path.join(process.cwd(), 'data', fileName, `${fileName}.model.ts`);

        if (!fs.existsSync(modelPath)) {
            console.error(`❌ Erreur : Fichier "${fileName}.model.ts" introuvable.`);
            return {};
        }

        const content = fs.readFileSync(modelPath, 'utf-8');
        return this.extractProperties(this.extractTypeBody(content));
    }

    /** Extrait le contenu `{ ... }` du fichier `.model.ts` */
    private static extractTypeBody(fileContent: string): string {
        const match = fileContent.match(/export type \w+ = \{([\s\S]*?)\};/);
        return match ? match[1].trim() : '';
    }

    /** Transforme un `type` TypeScript en schéma exploitable */
    private static extractProperties(typeBody: string): Record<string, any> {
        const properties: Record<string, any> = {};

        typeBody.split('\n').map(line => {
            line = line.trim();
            if (!line) return;

            const optional = line.includes('?'); // Détecter les champs facultatifs (`?`)
            const [keyRaw, typeRaw] = line.replace('?', '').split(':');

            if (!keyRaw || !typeRaw) return;

            const key = keyRaw.trim();
            let type = typeRaw.replace(';', '').trim();

            if (type.includes('[]')) {
                // Détection des tableaux (`type[]`)
                const baseType = type.replace('[]', '').trim();
                properties[key] = {
                    type: baseType,
                    isArray: true,
                    required: !optional
                };
            } else if (type.includes('{')) {
                // Détection des objets imbriqués (`{ ... }`)
                const nestedMatch = type.match(/\{([\s\S]*?)\}/);
                if (nestedMatch) {
                    properties[key] = {
                        type: this.extractProperties(nestedMatch[1]), // Récursion
                        isArray: false,
                        required: !optional
                    };
                }
            } else {
                // Traitement des types simples (`string`, `number`, etc.)
                properties[key] = {
                    type,
                    isArray: false,
                    required: !optional
                };
            }
        });

        return properties;
    }
}

export default DataModelManager;
