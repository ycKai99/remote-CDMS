import { messageNotificationInterface, fingerprintDataInterface, responseMessageInterface, locationTagInterface, locationRelationInterface } from '../../interfaces/message.interface';
import { PROCESS_STATUS } from '../../interfaces/constsetting';
import { v4 as uuidv4 } from 'uuid';

export function appMessage(fpuuid: string, operation: string) {
    let messageDetails: messageNotificationInterface = {
        uuid: generateUUID(),
        fpuuid: fpuuid,
        message: "Fingerprint data",
        ReceivedDate: generateDate(),
        InstanceID: fpuuid,
        EntityTypeID: fpuuid,
        EntityTypeName: "Fingerprint",
        ID: "FP_",
        Code: "FPREG9500",
        Operation: operation
      };
      return messageDetails;
}

export function zktecoFpMessage(fpuuid: string, fingerprintData, status: PROCESS_STATUS) {
  let messageDetails: fingerprintDataInterface = {
      uuid: generateUUID(),
      fpuuid: fpuuid,
      fpid: fingerprintData['fptemplate'],
      registeredDate: generateDate(), 
      status: status,
      location: process.env.LOCATION,
      personCode: "person code",
      position: fingerprintData['position'] ? fingerprintData['position'] : "unknown"
  }
  return messageDetails;
}

export function handleResponseMessage(fpuuid: string, data: string) {
  let messageDetails: responseMessageInterface = {
    uuid: generateUUID(),
    fpuuid: fpuuid,
    time : generateDate(),
    message: data,
  }
  return messageDetails;
}

export function locationTagMessage(fpuuid: string) {
  return locationTagMessage_ext(fpuuid, process.env.LOCATION)
}

export function locationTagMessage_ext(fpuuid: string, tagString: string) {
  let messageDetails: locationTagInterface = {
    uuid: generateUUID(),
    fpuuid: fpuuid,
    tag: tagString
  }
  return messageDetails;
}

export function locationRelationMessage(child: string, parent: string) {
  let messageDetails: locationRelationInterface = {
    uuid: generateUUID(),
    child: child,
    parent: parent
  }
  return messageDetails;
}

// export function generateMessage() {
//     let messageDetails: messageNotificationInterface = { 
//         message: "Fingerprint data to central server",
//         ReceivedDate: generateDate(),
//         InstanceID: "FP_testing",
//         EntityTypeID: "FP_testing",
//         EntityTypeName: "Fingerprint",
//         ID: "FP_",
//         Code: "FPREG9500",
//         Operation: "sync",
//         DataSource: "FP_" //+uuid
//       };
//       return messageDetails
// }

function generateUUID(): string {
  let uuid = uuidv4();
  return uuid;
}

export function generateDate() {
  let date = new Date();
  let timezone = "Asia/Singapore"
  let formattedDate = new Intl.DateTimeFormat("en-US", {timeZone: timezone, month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,}).format(date)
  return formattedDate
}