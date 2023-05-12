
export interface fpTemplateSchema {
    uuid: string;
    fpUuid: string;
    fpTemplate: string;
    registeredDate: Date;
    status: string;
    location: string;
    personCode: string;
    position: string;
    masterfp?: boolean;
};
export interface eventMessageSchema {
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
    pers_name: string;
    pers_new_ic: string;
    pers_sex: string;
    pers_code: string;
    pers_dob: string;
    pers_race: string;
    pers_religion: string;
    pers_marital: string;
    pers_nationality: string;
    orgn_code: string;
    orgn_full_name: string;
    emp_id?: number;
    emp_employ_type: string;
    emp_number?: string;
};
export interface FileSchema {
    uuid: string;
    fileName: string;
    fileType: string;
    entityName: string;
    fileData: fpTemplateSchema | eventMessageSchema | locationTagSchema | locationRelationSchema | deviceTagSchema | personProfileSchema;
}
