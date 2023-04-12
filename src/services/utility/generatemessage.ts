import { messageNotificationInterface, fingerprintDataInterface, responseMessageInterface, locationTagInterface, locationRelationInterface } from '../../interfaces/file_message_type.interface';
import { PROCESS_STATUS } from '../../interfaces/const_setting';

export function appMessage(operation: string, uuid: string) {
    let messageDetails: messageNotificationInterface = { 
        message: "Fingerprint data",
        ReceivedDate: generateDate(),
        InstanceID: uuid,
        EntityTypeID: uuid,
        EntityTypeName: "Fingerprint",
        ID: "FP_",
        Code: "FPREG9500",
        Operation: operation,
        uuid: uuid
      };
      return messageDetails;
}

export function zktecoFpMessage(fingerprintData, fileName, uuid: string, status: PROCESS_STATUS) {
  let messageDetails: fingerprintDataInterface = {
      fpid: fingerprintData['fptemplate'],
      registeredDate: generateDate(), 
      status: status,
      location: process.env.LOCATION,
      uuid: uuid,
      imageName: fileName,
      personCode: "person code",
      position: fingerprintData['position'] ? fingerprintData['position'] : "unknown"
  }
  return messageDetails;
}

export function handleResponseMessage(data: string, uuid: string) {
  let messageDetails: responseMessageInterface = {
    time : generateDate(),
    message: data,
    uuid: uuid
  }
  return messageDetails;
}

export function locationTagMessage(uuid: string) {
  return locationTagMessage_ext(uuid, process.env.LOCATION)
}

export function locationTagMessage_ext(uuid: string, tagString: string) {
  let messageDetails: locationTagInterface = {
    uuid: uuid,
    tag: tagString
  }
  return messageDetails;
}

export function locationRelationMessage(child: string, parent: string) {
  let messageDetails: locationRelationInterface = {
    child: child,
    parent: parent
  }
  return messageDetails;
}

export function fingerprintImageMessage(data: string, uuid: string) {
  let messageDetails = {
    uuid: uuid,
    image: data
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

export function generateDate() {
  let date = new Date();
  let timezone = "Asia/Singapore"
  let formattedDate = new Intl.DateTimeFormat("en-US", {timeZone: timezone, month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,}).format(date)
  return formattedDate
}