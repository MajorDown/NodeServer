import fs from 'fs';
import path from 'path';
import { DataType } from './types.ts';

export type FileCreationType = {
    filename: string;
    dataType: DataType;
    content: string;
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
    private DataDirIsChecked(): boolean {
        if (!fs.existsSync(NodeData.dataDir)) {
            console.log('NodeData ~> répertoire /data inexistant');
            return false
        }
        console.log('NodeData ~> répertoire /data checké !');
        return true;
    }

    /**
     * @name FileIsChecked
     * @description vérifie que le fichier existe
     * @param string file
     * @return boolean
    */
    private FileIsChecked(file: string): boolean {
        if (!fs.existsSync(path.join(NodeData.dataDir, file))) {
            console.log(`NodeData ~> fichier ${file} inexistant !`);
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
        if (!this.DataDirIsChecked()) {
            fs.mkdirSync(NodeData.dataDir);
            console.log('NodeData ~> création du répertoire /data');
        }
    }

    public async create(file: string, data: string): Promise<void> {
        if (!this.DataDirIsChecked()) {
            console.log('NodeData ~> répertoire /data inexistant');
            return;
        }
        fs.writeFileSync(path.join(NodeData.dataDir, file), data);
    }
}
