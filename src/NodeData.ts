import fs from 'fs';
import path from 'path';
import DataFileSystem from './utils/dataFileSystem.ts';

export class NodeData {
    private static dataDir: string = path.join(process.cwd(), 'data');

    constructor() {
        this.init();
    }

    /** Initialise le répertoire `/data` */
    public async init(): Promise<void> {
        if (!DataFileSystem.dataDir()) {
            fs.mkdirSync(NodeData.dataDir);
            console.log('NodeData ~> Répertoire `/data` créé.');
        }
    }

    /**
     * @description Crée un modèle TypeScript et son fichier JSON associé.
     * @param fileName Nom du modèle (ex: "User")
     */
    public async createModel(fileName: string): Promise<void> {
        const modelDir = path.join(NodeData.dataDir, fileName);

        // Vérifier et créer `/data` si inexistant
        if (!DataFileSystem.dataDir()) {
            console.log("NodeData ~> Le Répertoire `/data` n'existe pas.");
            return;
        }

        // Vérifier et créer le dossier du modèle s'il n'existe pas
        if (!DataFileSystem.modelDir(fileName)) {
            fs.mkdirSync(modelDir, { recursive: true });
            console.log(`NodeData ~> Répertoire "/data/${fileName}" créé.`);
        }

        // Générer le modèle si inexistant
        if (!DataFileSystem.modelFile(fileName)) {
            fs.writeFileSync(path.join(modelDir, `${fileName}.model.ts`), '', 'utf-8');
            console.log(`NodeData ~> Modèle "${fileName}.model.ts" généré.`);
        }

        // Vérifier et créer le fichier JSON s'il n'existe pas
        if (!DataFileSystem.dataFile(fileName)) {
            fs.writeFileSync(path.join(modelDir, `${fileName}.json`), '[]', 'utf-8');
            console.log(`NodeData ~> Fichier "${fileName}.json" créé avec succès.`);
        }
    }
}
