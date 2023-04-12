import { Injectable } from '@nestjs/common'; 
import { handleMessage } from './utility/handlestatusmessage';
import { FPENTITYNAME, RESPONSE_MESSAGE } from '../interfaces/const_setting';
const mongoose = require('mongoose');

@Injectable()
export class DbConnectionController {

    private dbConnection;

    private fpTemplateSchema = new mongoose.Schema({
        fpid: String,
        registeredDate: String,
        status: String,
        location: String,
        uuid: String,
        imageName: String,
        personCode: String,
        position: String
    });
    
    private notificationSchema = new mongoose.Schema({
        message: String,
        ReceivedDate: String,
        InstanceID: String,
        EntityTypeID: String,
        EntityTypeName: String,
        ID: String,
        Code: String,
        Operation: String,
        uuid: String
    });
    
    private responseSchema = new mongoose.Schema({
        time: String,
        message: String,
        uuid: String
    });

    private locationTagSchema = new mongoose.Schema({
        uuid: String,
        tag: String
    });

    private locationRelationSchema = new mongoose.Schema({
        child: String,
        parent: String
    });

    private fpImageScheme = new mongoose.Schema({
        uuid: String,
        image: String
    })

    constructor(){}

    /**
     * @description connect to mongodb 
     */
    async init() {
        mongoose.connect("mongodb://127.0.0.1:27017/fingerprint", {
            useNewUrlParser: "true",
            useUnifiedTopology: true
        });
        this.dbConnection = mongoose.connection;
        this.dbConnection.on("connected", (err, res) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_CONNECTED)
        });
        this.dbConnection.on("error", (err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_CONNECT_ERROR, err)
        });
        this.dbConnection.on("disconnected", () => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_DISCONNECTED) 
        })
        this.dbConnection.on("reconnected", () => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_RECONNECTED)
        }) 
    }

    /**
     * @description return model based on entityName 
     */
    returnModelType(entityName) {
        switch(entityName) {
            case FPENTITYNAME.FP_TEMPLATE_MSG:
                return mongoose.model(entityName, this.fpTemplateSchema);
            case FPENTITYNAME.NOTIF_MSG:
                return mongoose.model(entityName, this.notificationSchema);
            case FPENTITYNAME.RES_MSG:
                return mongoose.model(entityName, this.responseSchema);
            case FPENTITYNAME.LOCATION_TAG:
                return mongoose.model(entityName, this.locationTagSchema);
            case FPENTITYNAME.LOCATION_REL:
                return mongoose.model(entityName, this.locationRelationSchema);
            case FPENTITYNAME.FP_IMAGE:
                return mongoose.model(entityName, this.fpImageScheme);
        }
    }

    

    /**
     * @param entityName type : string
     * @param entityUUID type : string (optional, used when read single data)
     * @description read data from mongodb 
     */
    async readExec(entityName: string, entityUUID?: string) {
        let findData = {};
        if(entityUUID) {findData = {uuid: entityUUID}};
        let collection = this.returnModelType(entityName);
        let data: string = "";
        try {
            data = JSON.stringify(await collection.find(findData));
            handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_READ_DATA);
        }catch(err) {
            data = JSON.stringify(err);
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_READ_DATA, err);
        }
        return data;
    }

    /**
     * @param entityName string
     * @param data data
     * @description add data into mongodb 
     */
    writeExec(entityName: string, data) {
        let mongoModel = this.returnModelType(entityName);
        mongoModel.create(data).then((res) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_SAVE_DATA)
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_SAVE_DATA, err)
        })
    }

    /**
     * @param entityName string
     * @param data data
     * @description update data to mongodb 
     */
    updateExec(entityNames: string, data) {
        // const {uuid,entityName, ...excludeData} = data
        // console.log('excludedata is ',excludeData)
        // console.log('data is ',data)
        let mongoModel = this.returnModelType(entityNames);
        mongoModel.updateOne({uuid: data.uuid}, data).then((res) => {
            if(res.modifiedCount === 0) {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_UPDATE_DATA, {response: {data: "modifiedCount is 0."}})
            }
            else {
                handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_UPDATE_DATA)
            }
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_UPDATE_DATA, err)
        })
    }

    /**
     * @param entityName string
     * @param data data
     * @description delete data from mongodb 
     */
    deleteExec(entityName: string, entityUUID: string) {
        let mongoModel = this.returnModelType(entityName);
        mongoModel.deleteOne({uuid: entityUUID}).then((res) => {
           if(res.deletedCount === 0) {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA, {response: {data: "deletedCount is 0."}})
           }
           else{
            handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_DELETE_DATA)
           }
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA, err)
        })
    }//fingerprintTemplateData, registeredFingerprintMessage, handleResponseMessage, locationtag, locationrelation, fingerprintImage
}