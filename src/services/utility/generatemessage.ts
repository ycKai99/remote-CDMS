import { fingerprintDataInterface, eventMessageInterface, locationTagInterface, locationRelationInterface } from '../../interfaces/message.interface';
import { PROCESS_STATUS } from '../../interfaces/constsetting';
import { v4 as uuidv4 } from 'uuid';

export function zktecoFpMessage(fpUuid: string, fingerprintData, status: PROCESS_STATUS) {
  const messageDetails: fingerprintDataInterface = {
      uuid: generateUUID(),
      fpUuid: fingerprintData['fpUuid'],
      fpTemplate: fingerprintData['fptemplate'],
      registeredDate: new Date(),
      status: fingerprintData['status'],
      location: process.env.LOCATION,
      personCode: fingerprintData['personCode'],
      position: fingerprintData['position'] ? fingerprintData['position'] : "unknown",
      masterfp: fingerprintData['masterfp'] ? true : false
  }
  return messageDetails;
}

export function handleResponseMessage(fpUuid: string, data: string) {
  const messageDetails: eventMessageInterface = {
    uuid: generateUUID(),
    fpUuid: fpUuid,
    registeredDate : new Date(),
    message: data,
    messageType: "FPEevent",
    deviceNo: "ZKteco"
  }
  return messageDetails;
}

export function locationTagMessage(fpUuid: string) {
  return locationTagMessage_ext(fpUuid, process.env.LOCATION)
}

export function locationTagMessage_ext(fpUuid: string, tagString: string) {
  const messageDetails: locationTagInterface = {
    uuid: generateUUID(),
    fpUuid: fpUuid,
    location: tagString
  }
  return messageDetails;
}

export function locationRelationMessage(child: string, parent: string) {
  const messageDetails: locationRelationInterface = {
    uuid: generateUUID(),
    child: child,
    parent: parent
  }
  return messageDetails;
}

function generateUUID(): string {
  const uuid = uuidv4();
  return uuid;
}

export function generateDate() {
  const date = new Date();
  const timezone = "Asia/Singapore"
  const formattedDate = new Intl.DateTimeFormat("en-US", {timeZone: timezone, month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true,}).format(date)
  return formattedDate
}