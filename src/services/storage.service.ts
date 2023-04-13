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
export class StorageController{

    private entityName_storageType :{[key: string]: DB} = {};
    private dbConnectionController: DbConnectionController = new DbConnectionController();
    private synchronisationService: SynchronisationService = new SynchronisationService();

    constructor(){
        console.log('storage running...')
        // this.init();
    }

    // initial setup the storage type
    public async init() {
        //storage="fingerprintTemplateData=mongo,handleResponseMessage=mongo,locationrelation=mongo,locationtag=mongo,registeredFingerprintMessage=mongo"
        let storage: string = process.env.storage;
        let storageArray: string[] = storage.split(",");
        storageArray.forEach(
            //fingerprintTemplateData=mongo
            (keyvalue: string) => {
                let keyvalueArray: string[];
                keyvalueArray = keyvalue.split("="); 
                let key: string = keyvalueArray[0];
                let value: string = keyvalueArray[1];
                let DBvalue: DB;

                if(value.toLocaleLowerCase() === 'file')
                {
                    DBvalue = DB.FILE;
                }
                if(value.toLocaleLowerCase() === 'mongo')
                {
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
    public getStorageType(entityName: string): DB{
        return this.entityName_storageType[entityName];
    }

    // set storage type
    public setStorageType(entityName: string, data: DB) {
        this.entityName_storageType[entityName] = data;
        //this.storageType = data;
    }

    /**
     * @param entityName string
     * @param entityUUID optional, used when read image
     * @description Check storage type, and pass data to readExec(entityName, entityUUID)
     */
    public readData(entityName: string, entityUUID?: string) {
        if (this.getStorageType(entityName) === DB.FILE) {
            return readExec(entityName, entityUUID);
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            return this.dbConnectionController.readExec(entityName, entityUUID);
        }
    }

    /**
     * @param entityName string
     * @param data data
     * @description Check storage type, and pass data to writeExec(entityName, data)
     */
    public writeData(entityName: string, entityUUID: string, data) {
        
        // auto=append UUID
        // let JSONdata = JSON.parse(data);
        data["uuid"] = entityUUID;
        
        if (this.getStorageType(entityName) === DB.FILE) {
            writeExec(entityName, data);
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            this.dbConnectionController.writeExec(entityName, data);
        }
    }

    /**
     * @param entityName string
     * @param data data
     * @description Check storage type, and pass data to updateExec(entityName, data)
     */
    public updateData(entityName: string, entityUUID:string, data: string) {

        let JSONdata = JSON.parse(data);
        JSONdata["uuid"] = entityUUID;

        if (this.getStorageType(entityName) === DB.FILE) {
        //   return updateExec(entityName, data);
            console.log("Not yet implemented file storage.");
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
          return this.dbConnectionController.updateExec(entityName, JSONdata);
        }
    }

    /**
     * @param entityName string
     * @param data data
     * @description Check storage type, and pass data to deleteExec(entityName, data)
     */
    public deleteData(entityName: string, entityUUID: string) {

        if (this.getStorageType(entityName) === DB.FILE) {
        //   return deleteExec(entityName, data);
            console.log("Not yet implemented file storage.");
        }
        if (this.getStorageType(entityName) === DB.MONGO) {
            console.log('entityName : ',entityName)
            console.log('entityUUID : ',entityUUID)
          return this.dbConnectionController.deleteExec(entityName, entityUUID);
        }
    }
}