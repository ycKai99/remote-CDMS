import { Injectable } from '@nestjs/common';
import { handleMessage } from './utility/handlestatusmessage';
import { FPENTITYNAME, RESPONSE_MESSAGE } from '../interfaces/constsetting';
const mongoose = require('mongoose');
import { Schema, model } from 'mongoose';
const { v4: uuidv4 } = require('uuid');
import { FileSchema, deviceTagSchema, eventMessageSchema, fpTemplateSchema, locationRelationSchema, locationTagSchema, personProfileSchema } from '../interfaces/genericData.interface';


@Injectable()
export class DbConnectionController {

    private dbConnection;

    public genericDataSchema = new Schema<FileSchema>({
        uuid: { type: String, required: true, lowercase: true, unique: true },
        fileName: { type: String, required: true, lowercase: true },
        fileType: { type: String, required: true, lowercase: true },
        entityName: { type: String, required: true, lowercase: true },
        fileData: { type: Object, required: true },
    });

    constructor() { }

    /**
     * @description connect to mongodb 
     */
    public async init() {
        mongoose.connect(process.env.MONGODB_SERVER, {
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
     * @param entityName type : string
     * @param entityUUID type : string (optional, used when read single data)
     * @description read data from mongodb 
     */
    public async readExec(entityName: string, entityUUID?: string) {
        let findData = {};
        if (entityUUID) { findData = { 'entityName': entityName, 'fileData.uuid': entityUUID } };
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
    public async writeExec(entityName: string, data, entityUUID?: string) {
        let msg: any = "";
        const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
        let returnData: any = this.checkEntityType(entityName, data);
        if (typeof returnData === "string") {
            msg = returnData;
        }
        else {
            await mongodbData.create(returnData).then((res) => {
                handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_SAVE_DATA);
                msg = this.getSuccessMessage();
            }).catch((err) => {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_SAVE_DATA, err);
                msg = err.message;
            });
        }
        return msg;
    }

    /**
     * @param entityName type : string
     * @param data data
     * @description update data to mongodb 
     */
    public async updateExec(entityNames: string, data, entityUUID?: string) {
        let msg: any = "";
        let returnData: any = this.checkEntityType(entityNames, data);
        if (typeof returnData === "string") {
            msg = returnData;
        }
        else {
            const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
            await mongodbData.updateOne({ 'fileData.uuid': entityUUID }, returnData).then((res) => {
                if (res.modifiedCount === 0) {
                    handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_UPDATE_DATA, { response: { data: "modifiedCount is 0." } });
                    msg = "modifiedCount is 0";
                }
                else {
                    handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_UPDATE_DATA);
                    msg = this.getSuccessMessage();
                }
            }).catch((err) => {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_UPDATE_DATA, err)
                msg = err.message;
            })
        }

        return msg;
    }

    /**
     * @param entityName type : string
     * @param entityUUID type : string
     * @description delete data from mongodb 
     */
    public async deleteExec(entityName: string, entityUUID: string) {
        let msg: any;
        const mongodbData = model<FileSchema>('GenericData', this.genericDataSchema);
        await mongodbData.deleteOne({ uuid: entityUUID }).then((res) => {
            if (res.deletedCount === 0) {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA, { response: { data: "deletedCount is 0." } });
                msg = RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA;
            }
            else {
                handleMessage(RESPONSE_MESSAGE.DATABASE_SUCCESS_DELETE_DATA);
                msg = this.getSuccessMessage();
            }
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_DELETE_DATA, err);
            msg = err.message;
        })
        return msg;
    }//fingerprintTemplateData, handleResponseMessage, locationtag, locationrelation


    checkEntityType(entityName: string, data: any) {
        let error_message: string = "";
        try {
            if (data === null) {
                error_message = "Data is null";
                handleMessage(RESPONSE_MESSAGE.FAILED_VERIFY, error_message);
                return error_message;
            }
            if (entityName === FPENTITYNAME.FP_TEMPLATE_MSG) {
                data as fpTemplateSchema;
            }
            if (entityName === FPENTITYNAME.EVENT_MSG) {
                data as eventMessageSchema;
            }
            if (entityName === FPENTITYNAME.LOCATION_TAG_MSG) {
                data as locationTagSchema;
            }
            if (entityName === FPENTITYNAME.LOCATION_REL_MSG) {
                data as locationRelationSchema;
            }
            if (entityName === FPENTITYNAME.DEVICE_TAG_MSG) {
                data as deviceTagSchema;
            }
            if (entityName === FPENTITYNAME.PERSON_PROF_MSG) {
                data as personProfileSchema;
            }
            return data;
        }
        catch (err) {
            error_message = "[Type error] " + err.message;
            handleMessage(RESPONSE_MESSAGE.FAILED_VERIFY, error_message);
            return error_message;
        }
    }

    getSuccessMessage() {
        return {
            status: 1,
            message: "Success",
        }
    }
}