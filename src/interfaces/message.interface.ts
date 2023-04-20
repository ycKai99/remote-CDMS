import { PROCESS_STATUS } from "./constsetting";

// fingerprint data interface
export interface fingerprintDataInterface {
    uuid: string;
    fpUuid: string;
    fpTemplate: string;
    registeredDate: string;
    status: PROCESS_STATUS;
    location: string;
    personCode: string;
    position: string;
    masterfp?: boolean;
}

// success or error message interface
export interface eventMessageInterface {
    uuid: string;
    fpUuid: string;
    time: string;
    message: string;
    messageData?: string;
    messageType: "FPEevent";
    deviceNo: string;
}

export interface locationTagInterface {
    uuid: string;
    fpUuid: string;
    location: string;
}

export interface locationRelationInterface {
    uuid: string;
    child: string;
    parent: string;
}

export interface deviceTagInterface {
    uuid: string;
    deviceNo: string;
    location: string;
}

// person profile interface
export interface personProfileInterface {
    uuid: string;
    personCode: string;
    personName: string;
}