export const DIRECTORY: string = "localStorage";
export const FINGERPRINT_DATA_FILE: string = "fingerprintData.json";
export const FINGERPRINT_TEMPLATE_DATA_FILE: string = "fingerprintTemplateData.json";
export const MESSAGE_NOTIFICATION_FILE: string = "registeredFingerprintMessage.json";
export const RESPONSE_MESSAGE_FILE: string = "handleResponseMessage.json";
export const IMAGE_FOLDER: string = "localStorage/images/";
export const LOCATION_TAG_FILE: string = "locationtag.json";
export const LOCATION_RELATION_FILE: string = "locationrelation.json";

// file full path
export const MESSAGE_FILE_PATH: string = "./"+DIRECTORY+"/"+MESSAGE_NOTIFICATION_FILE;
export const FINGERPRINT_FILE_PATH: string = "./"+DIRECTORY+"/"+FINGERPRINT_DATA_FILE;
export const FINGERPRINT_TEMPLATE_FILE_PATH: string ="./"+DIRECTORY+"/"+FINGERPRINT_TEMPLATE_DATA_FILE;
export const RESPONSE_MESSAGE_FILE_PATH: string = "./"+DIRECTORY+"/"+RESPONSE_MESSAGE_FILE;
export const LOCATION_TAG_FILE_PATH: string = "./"+DIRECTORY+"/"+LOCATION_TAG_FILE;
export const LOCATION_RELATION_FILE_PATH: string = "./"+DIRECTORY+"/"+LOCATION_RELATION_FILE;

// submit button value 
export const enum SUBMIT_VALUE{
    INITIALIZE_DEVICE = 'INITIALIZE_DEVICE',
    ENROLL_FINGERPRINT = 'ENROLL_FINGERPRINT',
    VERIFY_FINGERPRINT = 'VERIFY_FINGERPRINT',
    IDENTIFY_FINGERPRINT = 'IDENTIFY_FINGERPRINT',
    CLOSE_FINGERPRINT = 'CLOSE_FINGERPRINT'
}

// file extension
export const enum FILE_EXTENSION{
    JPEG = 'jpeg',
    BITMAP = 'bmp',
    PNG = 'png',
    JSON = 'json'
}

// error message
export const enum RESPONSE_MESSAGE {
    FAILED_READ_DIR = "Read directory failed, readdir method error.",
    FAILED_REGISTER = "Register failed",
    FAILED_SAVE_IMAGE = "Failed to save image.",
    FAILED_VERIFY = "Verify failed.",
    FAILED_SYNCDATA = "Data sync failed",
    FAILED_READ_FILE_JSON = "Read file failed",
    FAILED_EXCEED_FILE_SIZE = "Exceed file size",
    FAILED_CREATE_FILE = "Failed create file",
    FAILED_WRITE_DATA = "failed append data",
    FAILED_REFRESH_CONNECTION = "Failed to refresh connection status",
    SUCCESS_SAVE_IMAGE = "Save image successful.",
    SUCCESS_VERIFY = "Verify success.",
    SUCCESS_SYNCDATA = "Data sync success.",
    SUCCESS_CREATE_FILE = "Success created file",
    SUCCESS_WRITE_DATA = "Success append data",
    UNKNOWN_ERROR = "Unknown error",
    FOLDER_EXISTED = "Folder exists.",
    FOLDER_CREATED = "Folder created.",
    DATABASE_CONNECTED = "Connected to mongo database",
    DATABASE_CONNECT_ERROR = "Failed to connect database",
    DATABASE_DISCONNECTED = "Disconnect to database",
    DATABASE_RECONNECTED = "Reconnect to database",
    DATABASE_FAILED_READ_DATA = "Failed to read data",
    DATABASE_SUCCESS_READ_DATA = "Success to read data",
    DATABASE_SUCCESS_SAVE_DATA = "Success to save data",
    DATABASE_FAILED_SAVE_DATA = "Failed to save data",
    DATABASE_FAILED_DELETE_DATA = "Failed to delete data",
    DATABASE_SUCCESS_DELETE_DATA = "Success to delete data",
    DATABASE_FAILED_UPDATE_DATA = "Failed to update data",
    DATABASE_SUCCESS_UPDATE_DATA = "Success to update data",
    AXIOS_SUCCESS_GET = "Success get method",
    AXIOS_FAILED_GET = "Failed to get method",
    AXIOS_SUCCESS_POST = "Success post method",
    AXIOS_FAILED_POST = "Failed to post method"
}

export const REMOTE_SERVER: string = process.env.REMOTE_SERVER;
export const URL_GET_FP_TEMPLATE: string = REMOTE_SERVER+"fptemplate";
export const URL_REGISTER_FP: string = REMOTE_SERVER+"registerfp";
export const URL_GET_NEW_FPID: string = REMOTE_SERVER+"getNewFPId";
export const URL_SYNC_REMOTE_DATA: string = REMOTE_SERVER+"syncRemoteData";
export const URL_MOBILE_DEVICE: string = "http://192.168.100.54:8080";

export const enum fingerprint{
    LEFT_THUMB,
    LEFT_INDEX,
    LEFT_MIDDLE,
    LEFT_RING,
    LEFT_PINKY,
    RIGHT_THUMB,
    RIGHT_INDEX,
    RIGHT_MIDDLE,
    RIGHT_RING,
    RIGHT_PINKY,
    UNKNOWN
}


export enum DB {
    FILE = "file",
    MONGO = "mongo"
}

export enum STAT {
    ONLINE = "online",
    OFFLINE = "offline"
}

export enum PROCESS_STATUS {
    NEW = "new",
    VERIFIED = "verified"
}

export enum FPENTITYNAME {
    FP_TEMPLATE_MSG = "fingerprintTemplateData",
    NOTIF_MSG = "registeredFingerprintMessage",
    RES_MSG = "handleStatusMessage",
    LOCATION_TAG = "locationtag",
    LOCATION_REL = "locationrelation",
    GenericFileData = "genericFileData"
}