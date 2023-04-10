import { PROCESS_STATUS } from '../../interfaces/const_setting';
import { messageNotificationInterface, fingerprintDataInterface, responseMessageInterface, locationTagInterface, locationRelationInterface } from '../../interfaces/file_message_type.interface';

export function appMessage(operation: string, uuid: string) {
    let messageDetails: messageNotificationInterface = { 
        message: "Fingerprint data",
        ReceivedDate: generateDate(),
        InstanceID: "FP_"+uuid,
        EntityTypeID: "FP_"+uuid,
        EntityTypeName: "Fingerprint",
        ID: "FP_",
        Code: "FPREG9500",
        Operation: operation,
        DataSource: "FP_"+uuid
      };
      return messageDetails;
}

export function zktecoFpMessage(fingerprintData, fileName, uuid: string, status: PROCESS_STATUS) {
  let messageDetails: fingerprintDataInterface = {
      fpid: fingerprintData['fptemplate'],
      registeredDate: generateDate(), 
      status: status,
      location: process.env.LOCATION,
      uuid: "FP_"+uuid,
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
    header_messageId: "FP_"+uuid
  }
  return messageDetails;
}

export function tagMessage(uuid: string) {
  return tagMessage_ext(uuid, process.env.LOCATION)
}

export function tagMessage_ext(uuid: string, tagString: string) {
  let messageDetails: locationTagInterface = {
    uuid: "FP_"+uuid,
    tag: tagString
  }
  return messageDetails;
}

export function relationMessage(child: string, parent: string) {
  let messageDetails: locationRelationInterface = {
    child: child,
    parent: parent
  }
  return messageDetails;
}

export function generateMessage() {
    let messageDetails: messageNotificationInterface = { 
        message: "Fingerprint data to central server",
        ReceivedDate: generateDate(),
        InstanceID: "FP_testing",
        EntityTypeID: "FP_testing",
        EntityTypeName: "Fingerprint",
        ID: "FP_",
        Code: "FPREG9500",
        Operation: "sync",
        DataSource: "FP_" //+uuid
      };
      return messageDetails
}

export function generateDate() {
  let date = new Date();
  let timezone = "Asia/Singapore"
  let formattedDate = new Intl.DateTimeFormat("en-US", {timeZone: timezone, month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,}).format(date)
  return formattedDate
}