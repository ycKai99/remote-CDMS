import { PROCESS_STATUS } from "./const_setting";

// fingerprint data interface
export interface fingerprintDataInterface {
    fpid: string;
    registeredDate: string;
    status: PROCESS_STATUS;
    location: string;
    uuid: string;
    imageName: string;
    personCode: string;
    position: string;
}

// message notification interface
export interface messageNotificationInterface {
    message: string;
    ReceivedDate: string;
    InstanceID: string;
    EntityTypeID: string;
    EntityTypeName: string;
    ID: string;
    Code: string;
    Operation: string;
    DataSource: string;
}

// success or error message interface
export interface responseMessageInterface {
    time: string;
    message: string;
    header_messageId?: string;
}

export interface locationTagInterface {
    uuid: string;
    tag: string;
}

export interface locationRelationInterface {
    child: string;
    parent: string;
}