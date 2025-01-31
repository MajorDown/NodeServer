import fs from 'fs';
import path from 'path';
import DataModelManager from './NodeModelManager.ts';

class NodeDataManager {
    private static dataDir: string = path.join(process.cwd(), 'data');

    /**
     * @description Vérifie si le dossier `/data` existe, sinon le crée
     */
    private static ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir);
            console.log('✅ Dossier `/data` créé.');
        }
    }

    /**
     * @description Vérifie si un fichier JSON existe
     * @param fileName Nom du modèle (ex: "User")
     */
    private static getJsonPath(fileName: string): string {
        return path.join(this.dataDir, fileName, `${fileName}.json`);
    }

    /**
     * @description Crée un fichier JSON vide si nécessaire
     * @param fileName Nom du modèle (ex: "User")
     */
    public static createJsonFile(fileName: string) {
        this.ensureDataDir();
        const jsonPath = this.getJsonPath(fileName);

        if (!fs.existsSync(jsonPath)) {
            fs.writeFileSync(jsonPath, '[]');
            console.log(`✅ Fichier "${fileName}.json" créé.`);
        }
    }

    /**
     * @description Récupère les données d'un fichier JSON
     * @param fileName Nom du modèle (ex: "User")
     * @returns Données JSON sous forme de tableau
     */
    public static readJsonFile(fileName: string): any[] {
        const jsonPath = this.getJsonPath(fileName);
        if (!fs.existsSync(jsonPath)) {
            console.error(`❌ Fichier "${fileName}.json" introuvable.`);
            return [];
        }
        return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    }

    /**
     * @description Ajoute une entrée dans un fichier JSON
     * @param fileName Nom du modèle (ex: "User")
     * @param data Données à ajouter
     */
    public static addEntry(fileName: string, data: any) {
        const schema = DataModelManager.getSchema(fileName);
        const jsonPath = this.getJsonPath(fileName);
        const jsonData = this.readJsonFile(fileName);

        // Vérification des clés requises
        for (const key in schema) {
            if (schema[key].required && !(key in data)) {
                console.error(`❌ Erreur : Clé "${key}" requise mais absente.`);
                return;
            }
        }

        jsonData.push(data);
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        console.log(`✅ Nouvelle entrée ajoutée à "${fileName}.json"`);
    }

    /**
     * @description Supprime une entrée du fichier JSON
     * @param fileName Nom du modèle (ex: "User")
     * @param id Identifiant de l'entrée à supprimer
     */
    public static deleteEntry(fileName: string, id: number) {
        const jsonPath = this.getJsonPath(fileName);
        let jsonData = this.readJsonFile(fileName);

        jsonData = jsonData.filter((entry: any) => entry.id !== id);
        fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
        console.log(`✅ Entrée avec id "${id}" supprimée de "${fileName}.json"`);
    }
}

export default NodeDataManager;
