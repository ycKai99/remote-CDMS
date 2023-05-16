import { Injectable } from '@nestjs/common';
import { readExec } from './utility/readdata';
import { writeExec } from './utility/writedata';
import { DB, RESPONSE_MESSAGE } from '../interfaces/constsetting';
import { DbConnectionController } from './database.service';
import * as dotenv from 'dotenv'
import { SynchronisationService } from './synchronisation.service';
import { handleMessage } from './utility/handlestatusmessage';

dotenv.config();

@Injectable()
export class StorageController {

    private entityName_storageType: { [key: string]: DB } = {};
    private dbConnectionController: DbConnectionController = new DbConnectionController();
    private synchronisationService: SynchronisationService = new SynchronisationService();

    constructor() {
        console.log('storage running...')
    }

    // initial setup the storage type
    public async init() {
        //storage="fingerprintTemplateData=mongo,handleResponseMessage=mongo,locationrelation=mongo,locationtag=mongo"
        const storage: string = process.env.storage;
        const storageArray: string[] = storage.split(",");
        storageArray.forEach(
            //fingerprintTemplateData=mongo
            (keyvalue: string) => {

                let keyvalueArray: string[];
                keyvalueArray = keyvalue.split("=");
                const key: string = keyvalueArray[0];
                const value: string = keyvalueArray[1];
                let DBvalue: DB;

                if (value.toLocaleLowerCase() === 'file') {
                    DBvalue = DB.FILE;
                }
                if (value.toLocaleLowerCase() === 'mongo') {
                    DBvalue = DB.MONGO;
                }

                this.setStorageType(key, DBvalue);
            }
        )

        // Connect to mongo DB.
        await this.dbConnectionController.init();

        // Synchronisation service
        await this.synchronisationService.init();
    }

    // get storage type
    public getStorageType(entityName: string): DB {
        return this.entityName_storageType[entityName];
    }

    // set storage type
    public setStorageType(entityName: string, data: DB) {
        this.entityName_storageType[entityName] = data;
    }

    /**
     * @param entityName type : string
     * @param entityUUID type : string (optional)
     * @description read data
     */
    public async readData(entityName: string, entityUUID?: string) {
        if (this.getStorageType(entityName) === DB.FILE) {
            return readExec(entityName, entityUUID);
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            return await this.dbConnectionController.readExec(entityName, entityUUID);
        }
    }

    /**
     * @param entityName type : string
     * @param entityUUID type : string
     * @param data type : string
     * @description write data
     */
    public async writeData(entityName: string, entityUUID: string, data: string) {
        // auto=append UUID
        console.log('entityName: ', entityName);
        const JSONdata = JSON.parse(data);

        if (this.getStorageType(entityName) === DB.FILE) {
            console.log("Not yet implemented file storage.");
            writeExec(entityName, data);
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            console.log('get storage type: ', this.getStorageType(entityName));
            await this.dbConnectionController.writeExec(entityName, JSONdata, entityUUID);
        }
    }

    /**
     * @param entityName type : string
     * @param entityUUID type : string
     * @param data type : string
     * @description update data
     */
    public async updateData(entityName: string, entityUUID: string, data: string) {
        const JSONdata = JSON.parse(data);
        // JSONdata["uuid"] = entityUUID;

        if (this.getStorageType(entityName) === DB.FILE) {
            //   return updateExec(entityName, data);
            console.log("Not yet implemented file storage.");
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            return await this.dbConnectionController.updateExec(entityName, JSONdata, entityUUID);
        }
    }

    /**
     * @param entityName type : string
     * @param entityUUID type : string
     * @description delete data
     */
    public async deleteData(entityName: string, entityUUID: string) {

        if (this.getStorageType(entityName) === DB.FILE) {
            //   return deleteExec(entityName, data);
            console.log("Not yet implemented file storage.");
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            console.log('entityName : ', entityName)
            console.log('entityUUID : ', entityUUID)
            return await this.dbConnectionController.deleteExec(entityName, entityUUID);
        }
    }
}