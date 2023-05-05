import { Injectable } from '@nestjs/common';
import { handleMessage } from './utility/handlestatusmessage';
import { FPENTITYNAME, RESPONSE_MESSAGE } from '../interfaces/constsetting';
const mongoose = require('mongoose');
import { Document, Schema, model } from 'mongoose';
const { v4: uuidv4 } = require('uuid');
import { FileSchema } from '../interfaces/genericData.interface';
@Injectable()
export class DbConnectionController {

    private dbConnection;

    // private fpTemplateSchema = new mongoose.Schema({
    //     uuid: { type: String, required: true, lowercase: true, unique: true },
    //     fpUuid: { type: String, required: true, lowercase: true },
    //     fpTemplate: { type: String, required: true },
    //     registeredDate: { type: Date, required: true },
    //     status: { type: String, required: true },
    //     location: { type: String, required: true },
    //     personCode: { type: String },
    //     position: { type: String },
    //     masterfp: { type: Boolean }
    // });

    // private eventSchema = new mongoose.Schema({
    //     uuid: { type: String, required: true, lowercase: true, unique: true },
    //     fpUuid: { type: String, lowercase: true },
    //     registeredDate: { type: Date, required: true },
    //     message: { type: String, required: true },
    //     messageType: { type: String, required: true },
    //     messageData: { type: String },
    //     deviceNo: { type: String, required: true }
    // });

    // private locationTagSchema = new mongoose.Schema({
    //     uuid: { type: String, required: true, lowercase: true, unique: true },
    //     fpUuid: { type: String, required: true, lowercase: true },
    //     location: { type: String, required: true }
    // });

    // private locationRelationSchema = new mongoose.Schema({
    //     uuid: { type: String, required: true, lowercase: true, unique: true },
    //     child: { type: String, required: true },
    //     parent: { type: String, required: true }
    // });

    // private deviceTagSchema = new mongoose.Schema({
    //     uuid: { type: String, required: true, lowercase: true, unique: true },
    //     deviceNo: { type: String, required: true },
    //     location: { type: String, required: true }
    // });

    // private personProfileSchema = new mongoose.Schema({
    //     uuid: { type: String, required: true, lowercase: true, unique: true },
    //     personCode: { type: String, required: true },
    //     personName: { type: String, required: true }
    // });



    public genericDataSchema = new Schema<FileSchema>({
        uuid: { type: String, required: true, lowercase: true, unique: true },
        fileName: { type: String, required: true, lowercase: true },
        fileType: { type: String, required: true, lowercase: true },
        fileData: { type: Object, required: true },
    });

    constructor() { }

    /**
     * @description connect to mongodb 
     */
    public async init() {
        mongoose.connect("mongodb://127.0.0.1:27017/fingerprint", {
            useNewUrlParser: "true",
            useUnifiedTopology: true
        });
        this.dbConnection = mongoose.connection;
        this.dbConnection.on("connected", (err, res) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_CONNECTED);
        });
        this.dbConnection.on("error", (err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_CONNECT_ERROR, err);
        });
        this.dbConnection.on("disconnected", () => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_DISCONNECTED);
        })
        this.dbConnection.on("reconnected", () => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_RECONNECTED);
        })
    }

    /**
     * @description return model based on entityName 
     */
    private returnModelType(entityName: string) {
        switch (entityName) {
            // case FPENTITYNAME.FP_TEMPLATE_MSG:
            //     return mongoose.model(entityName, this.fpTemplateSchema);
            // case FPENTITYNAME.EVENT_MSG:
            //     return mongoose.model(entityName, this.eventSchema);
            // case FPENTITYNAME.LOCATION_TAG_MSG:
            //     return mongoose.model(entityName, this.locationTagSchema);
            // case FPENTITYNAME.LOCATION_REL_MSG:
            //     return mongoose.model(entityName, this.locationRelationSchema);
            // case FPENTITYNAME.GENERICDATA:
            //     return mongoose.model(entityName, this.genericDataSchema);
            // case FPENTITYNAME.DEVICE_TAG_MSG:
            //     return mongoose.model(entityName, this.deviceTagSchema);
            // case FPENTITYNAME.PERSON_PROF_MSG:
            //     return mongoose.model(entityName, this.personProfileSchema);
        }
    }



    /**
     * @param entityName type : string
     * @param entityUUID type : string (optional, used when read single data)
     * @description read data from mongodb 
     */
    public async readExec(entityName: string, entityUUID?: string) {
        let findData = {};
        if (entityUUID) { findData = { 'uuid': entityUUID, 'fileName': entityName } };
        // const collection = this.returnModelType(entityName);
        const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
        let data: string;
        try {
            data = JSON.stringify(await mongodbData.find(findData));
            handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_READ_DATA);
        } catch (err) {
            data = JSON.stringify(err);
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_READ_DATA, err);
        }
        return data;
    }

    /**
     * @param entityName type : string
     * @param data data
     * @description add data into mongodb 
     */
    public async writeExec(entityName: string, data) {
        // const mongoModel = this.returnModelType(entityName);
        const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
        let writeData: FileSchema = {
            uuid: uuidv4(),
            fileName: entityName,
            fileType: 'JSON',
            fileData: data
        }
        await mongodbData.create(writeData).then((res) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_SAVE_DATA);
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_SAVE_DATA, err);
        })
    }

    /**
     * @param entityName type : string
     * @param data data
     * @description update data to mongodb 
     */
    public async updateExec(entityNames: string, data) {
        // const {uuid,entityName, ...excludeData} = data
        // console.log('excludedata is ',excludeData)
        // console.log('data is ',data)
        // const mongoModel = this.returnModelType(entityNames);
        let updateData: FileSchema = {
            uuid: data.uuid,
            fileName: entityNames,
            fileType: 'JSON',
            fileData: data
        }
        const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
        await mongodbData.updateOne({ uuid: data.uuid }, updateData).then((res) => {
            if (res.modifiedCount === 0) {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_UPDATE_DATA, { response: { data: "modifiedCount is 0." } });
            }
            else {
                handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_UPDATE_DATA);
            }
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_UPDATE_DATA, err)
        })
    }

    /**
     * @param entityName type : string
     * @param entityUUID type : string
     * @description delete data from mongodb 
     */
    public async deleteExec(entityName: string, entityUUID: string) {
        // const mongoModel = this.returnModelType(entityName);
        const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
        await mongodbData.deleteOne({ uuid: entityUUID }).then((res) => {
            if (res.deletedCount === 0) {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA, { response: { data: "deletedCount is 0." } });
            }
            else {
                handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_DELETE_DATA);
            }
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA, err);
        })
    }//fingerprintTemplateData, handleResponseMessage, locationtag, locationrelation
}