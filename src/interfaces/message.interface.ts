import { OPERATION, PROCESS_STATUS } from "./constsetting";

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
    opration?: OPERATION;
}

export interface locationTagInterface {
    uuid: string;
    fpUuid: string;
    tag: string;
}

export interface locationRelationInterface {
    uuid: string;
    child: string;
    parent: string;
}