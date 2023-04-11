import { Injectable } from '@nestjs/common'; 
import { readExec } from './FileAction/read_data';
import { writeExec } from './FileAction/write_data';
import { DB } from '../interfaces/const_setting'; 
import { DbConnectionController } from './database.service';
import * as dotenv from 'dotenv'

dotenv.config();

@Injectable()
export class StorageController{

    private entityname_storageType :{[key: string]: DB} = {};
     
    private dbConnectionController: DbConnectionController = new DbConnectionController();

    constructor(){ 
        this.init()
    }

    // set the dbConnectionController from the main controller
    public setDbConnectionController(controller: DbConnectionController) {
        this.dbConnectionController = controller;
    }

    // initial setup the storage type
    public init() {
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
        this.dbConnectionController.init()
    }

    // get storage type
    public getStorageType(entityname: string): DB{
        return this.entityname_storageType[entityname];
    }

    // set storage type
    public setStorageType(entityname: string, data: DB) {
        this.entityname_storageType[entityname] = data;
        //this.storageType = data;
    }

    /**
     * @param entityname string
     * @param entityUUID optional, used when read image
     * @description Check storage type, and pass data to readExec(entityname, entityUUID)
     */
    public readData(entityname: string, entityUUID?: string) {
        if (this.getStorageType(entityname) === DB.FILE) {
            return readExec(entityname, entityUUID);
        }
        if (this.getStorageType(entityname) === DB.MONGO) {
            return this.dbConnectionController.readExec(entityname, entityUUID);
        }
    }

    /**
     * @param entityname string
     * @param data data
     * @description Check storage type, and pass data to writeExec(entityname, data)
     */
    public writeData(entityname: string, entityUUID: string, data: string) {
        
        // auto=append UUID
        let JSONdata = JSON.parse(data);
        JSONdata["uuid"] = entityUUID;
        
        if (this.getStorageType(entityname) === DB.FILE) {
            writeExec(entityname, JSONdata);
        }
        if (this.getStorageType(entityname) === DB.MONGO) {
            this.dbConnectionController.writeExec(entityname, JSONdata);
        }
    }

    /**
     * @param entityname string
     * @param data data
     * @description Check storage type, and pass data to updateExec(entityname, data)
     */
    public updateData(entityname: string, entityUUID:string, data: string) {

        let JSONdata = JSON.parse(data);
        JSONdata["uuid"] = entityUUID;

        if (this.getStorageType(entityname) === DB.FILE) {
        //   return updateExec(entityname, data);
            console.log("Not yet implemented file storage.");
        }
        if (this.getStorageType(entityname) === DB.MONGO) {
          return this.dbConnectionController.updateExec(entityname, JSONdata);
        }
    }

    /**
     * @param entityname string
     * @param data data
     * @description Check storage type, and pass data to deleteExec(entityname, data)
     */
    public deleteData(entityname: string, entityUUID: string) {

        if (this.getStorageType(entityname) === DB.FILE) {
        //   return deleteExec(entityname, data);
            console.log("Not yet implemented file storage.");
        }
        if (this.getStorageType(entityname) === DB.MONGO) {
            console.log('entityname : ',entityname)
            console.log('entityUUID : ',entityUUID)
          return this.dbConnectionController.deleteExec(entityname, entityUUID);
        }
    }
}