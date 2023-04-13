import { PROCESS_STATUS } from "./constsetting";

// fingerprint data interface
export interface fingerprintDataInterface {
    uuid: string;
    fpuuid: string;
    fpid: string;
    registeredDate: string;
    status: PROCESS_STATUS;
    location: string;
    personCode: string;
    position: string;
}

// message notification interface
export interface messageNotificationInterface {
    uuid: string;
    fpuuid: string;
    message: string;
    ReceivedDate: string;
    InstanceID: string;
    EntityTypeID: string;
    EntityTypeName: string;
    ID: string;
    Code: string;
    Operation: string;
}

// success or error message interface
export interface responseMessageInterface {
    uuid: string;
    fpuuid: string;
    time: string;
    message: string;
}

export interface locationTagInterface {
    uuid: string;
    fpuuid: string;
    tag: string;
}

export interface locationRelationInterface {
    uuid: string;
    child: string;
    parent: string;
}