import fs from 'fs';
import path from 'path';

class DataFileSystem {
    private static dataDirectory: string = path.join(process.cwd(), 'data');

    /** check si le dossier `/data` existe */
    public static dataDir(): boolean {
        if (!fs.existsSync(this.dataDirectory)) return false;
        return true;
    }

    /** check si le répertoire du modèle existe */
    public static modelDir(fileName: string): boolean {
        const modelDir = path.join(this.dataDirectory, fileName);
        if (!fs.existsSync(modelDir)) return false;
        return true;
    }

    /** check si le fichier `.model.ts` du modèle existe */
    public static modelFile(fileName: string): boolean {
        const modelFilePath = path.join(this.dataDirectory, fileName, `${fileName}.model.ts`);
        if (!fs.existsSync(modelFilePath)) return false;
        return true;
    }

    /** check si le fichier JSON de données existe */
    public static dataFile(fileName: string): boolean {
        return fs.existsSync(path.join(this.dataDirectory, fileName, `${fileName}.json`));
    }

}

export default DataFileSystem;