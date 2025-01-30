import fs from 'fs';
import path from 'path';

export type FileCreationType = {
    filename: string;
    content: string; // json d'unformations
}

export class NodeData {
  private static dataDir: string = path.join(process.cwd(), 'data');

  constructor() {
    this.init();
  }

    /**
    * @name DataDirIsChecked
    * @description vérifie que le répertoire /data existe
    * @return boolean
    */
    private dataDirIsChecked(): boolean {
        if (!fs.existsSync(NodeData.dataDir)) {
            console.log('NodeData ~> répertoire /data inexistant');
            return false
        }
        console.log('NodeData ~> répertoire /data checké !');
        return true;
    }

    /**
     * @name modelDirisChecked
     * @description vérifie que le répertoire /data/${modelName} existe
     * @param string modelName
     * @return boolean
    */
    private modelDirisChecked(modelName: string): boolean {
        if (!fs.existsSync(path.join(NodeData.dataDir, modelName))) {
            console.log(`NodeData ~> répertoire /data/${modelName} inexistant`);
            return false
        }
        console.log(`NodeData ~> répertoire /data/${modelName} checké !`);
        return true;
    }

    /**
     * @name modelFileIsChecked
     * @description vérifie que le fichier existe dans le répertoire /data/${modelName}/${modelName}
     * @param string modelName
     * @return boolean
    */
    private modelFileIsChecked(modelName: string): boolean {
        if (!fs.existsSync(path.join(NodeData.dataDir, modelName, `${modelName}.model.ts`))) {
            console.log(`NodeData ~> le fichier ${modelName} n'existe pas dans /data/${modelName}`);
            return false
        }
        console.log(`NodeData ~> fichier ${modelName} checké dans /data/${modelName} !`);
        return true;
    }

    /**
     * @name FileIsChecked
     * @description vérifie que le fichier existe dans le répertoire /data/${filename}/filename.json
     * @param string file
     * @return boolean
    */
    private FileIsChecked(file: string): boolean {
        if (!fs.existsSync(path.join(NodeData.dataDir, file, file))) {
            console.log(`NodeData ~> le fichier ${file} n'existe pas`);
            return false
        }
        console.log(`NodeData ~> fichier ${file} checké !`);
        return true;
    }

    /**
     * @name init
     * @description initialise le répertoire /data
     * @return Promise<void>
    */
    public async init(): Promise<void> {
        if (!this.dataDirIsChecked()) {
            fs.mkdirSync(NodeData.dataDir);
            console.log('NodeData ~> création du répertoire /data');
        }
    }

    /**
     * @name Create
     * @description crée un fichier dans le répertoire /data
     * @returns 
     */
    public async create(informations: FileCreationType): Promise<void> {
        if (!this.dataDirIsChecked()) {
            console.log('NodeData ~> répertoire /data inexistant');
            return;
        }
        if (this.FileIsChecked(informations.filename)) {
            console.log(`NodeData ~> le fichier ${informations.filename} existe déjà`);
            return;
        }
        fs.writeFileSync(path.join(NodeData.dataDir, informations.filename), informations.content);
        console.log(`NodeData ~> fichier ${informations.filename} créé !`);
    }

    /**
     * @name read
     * @description extrait le contenu d'un fichier
     * @param string filename
     * @return Promise<string | null>
    */
    public async read (filename: string): Promise<string | null> {
        if (!this.dataDirIsChecked()) {
            console.log('NodeData ~> répertoire /data inexistant');
            return null;
        }
        if (!this.FileIsChecked(filename)) {
            console.log(`NodeData ~> le fichier ${filename} n'existe pas`);
            return null;
        }
        return fs.readFileSync(path.join(NodeData.dataDir, filename), 'utf-8');
    }

    /**
     * @name update
     * @description modifie le contenu d'un fichier
     * @param string filename
     * @param string content
     * @return Promise<void>
    */
    public async update(filename: string, content: string): Promise<void> {
    }

}
