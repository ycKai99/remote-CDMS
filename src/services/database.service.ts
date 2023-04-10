import { Injectable } from '@nestjs/common'; 
import { handleMessage } from './FileAction/handle_error_message';
import { FPENTITYNAME, RESPONSE_MESSAGE } from '../interfaces/const_setting';
const mongoose = require('mongoose');
import { Subject } from 'rxjs';

@Injectable()
export class DbConnectionController {

    private dbConnection;

    private dataSubject1 = new Subject<any>()
    private dataSubject2 = new Subject<any>()
    private dataSubject3 = new Subject<any>()
    private dataSubject4 = new Subject<any>()
    private dataSubject5 = new Subject<any>()
    public finalData1$ = this.dataSubject1.asObservable();
    public finalData2$ = this.dataSubject2.asObservable();
    public finalData3$ = this.dataSubject3.asObservable();
    public finalData4$ = this.dataSubject4.asObservable();
    public finalData5$ = this.dataSubject5.asObservable();

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
        DataSource: String
    });
    
    private responseSchema = new mongoose.Schema({
        time: String,
        message: String,
        header_messageId: String
    });

    private locationTagSchema = new mongoose.Schema({
        uuid: String,
        tag: String
    });

    private locationRelationSchema = new mongoose.Schema({
        child: String,
        parent: String
    });

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
     * @description return model based on entityname 
     */
    returnModelType(entityname) {
        switch(entityname) {
            case FPENTITYNAME.FP_TEMPLATE_MSG:
                return mongoose.model(entityname, this.fpTemplateSchema);
            case FPENTITYNAME.NOTIF_MSG:
                return mongoose.model(entityname, this.notificationSchema);
            case FPENTITYNAME.RES_MSG:
                return mongoose.model(entityname, this.responseSchema);
            case FPENTITYNAME.LOCATION_TAG:
                return mongoose.model(entityname, this.locationTagSchema);
            case FPENTITYNAME.LOCATION_REL:
                return mongoose.model(entityname, this.locationRelationSchema);
        }
    }

    

    /**
     * @param entityname string
     * @param entityUUID optional, used when read image
     * @description read data from mongodb 
     */
    readExec(entityname, entityUUID?) {
        let collection = this.returnModelType(entityname);
        let data;
        collection.find({}, (err, data) => {
            if(err) {
                handleMessage(RESPONSE_MESSAGE.DATABASE_FINDALL_ERROR, err)
                data = err;
            }
            else {
                // handleMessage(RESPONSE_MESSAGE.DATABASE_FINDALL_SUCCESS, "", data)
                data = data
                if(entityname === FPENTITYNAME.FP_TEMPLATE_MSG) {this.dataSubject1.next(data)}
                if(entityname === FPENTITYNAME.NOTIF_MSG) {this.dataSubject2.next(data)}
                if(entityname === FPENTITYNAME.RES_MSG) {this.dataSubject3.next(data)}
                if(entityname === FPENTITYNAME.LOCATION_TAG) {this.dataSubject4.next(data)}
                if(entityname === FPENTITYNAME.LOCATION_REL) {this.dataSubject5.next(data)}
            }
        })
        return data
    }

    /**
     * @param entityname string
     * @param data data
     * @description add data into mongodb 
     */
    writeExec(entityname, data) {
        let mongoModel = this.returnModelType(entityname);
        let result = mongoModel.create(data).then((res) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_SAVE_DATA)
            return true;
        }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.DATABASE_FAILED_SAVE_DATA, err)
            return false;
        })
        return result;
    }

    /**
     * @param entityname string
     * @param data data
     * @description update data to mongodb 
     */
    updateExec(entityname, data) {

    }

    /**
     * @param entityname string
     * @param data data
     * @description delete data from mongodb 
     */
    deleteExec(entityname, data) {

    }
}