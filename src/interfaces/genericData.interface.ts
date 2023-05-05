
export interface fpTemplateSchema {
    uuid: { type: String, required: true, lowercase: true, unique: true },
    fpUuid: string;
    fpTemplate: string;
    registeredDate: Date;
    status: string;
    location: string;
    personCode: string;
    position: string;
    masterfp?: boolean;
};
export interface eventSchema {
    uuid: string;
    fpUuid: string;
    registeredDate: Date;
    message: string;
    messageType: string;
    messageData: string;
    deviceNo: string;
};
export interface locationTagSchema {
    uuid: string;
    fpUuid: string;
    location: string;
};
export interface locationRelationSchema {
    uuid: string;
    child: string;
    parent: string;
};
export interface deviceTagSchema {
    uuid: string;
    deviceNo: string;
    location: string;
};
export interface personProfileSchema {
    uuid: string;
    personCode: string;
    personName: string;
};
export interface FileSchema {
    uuid: string;
    fileName: string;
    fileType: string;
    fileData: fpTemplateSchema | eventSchema | locationTagSchema | locationRelationSchema | deviceTagSchema | personProfileSchema;
}
