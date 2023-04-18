import { fingerprintDataInterface, eventMessageInterface, locationTagInterface, locationRelationInterface } from '../../interfaces/message.interface';
import { PROCESS_STATUS } from '../../interfaces/constsetting';
import { v4 as uuidv4 } from 'uuid';

export function zktecoFpMessage(fpUuid: string, fingerprintData, status: PROCESS_STATUS) {
  let messageDetails: fingerprintDataInterface = {
      uuid: generateUUID(),
      fpUuid: fingerprintData['fpUuid'],
      fpTemplate: fingerprintData['fptemplate'],
      registeredDate: generateDate(),
      status: fingerprintData['status'],
      location: process.env.LOCATION,
      personCode: fingerprintData['personCode'],
      position: fingerprintData['position'] ? fingerprintData['position'] : "unknown",
      masterfp: fingerprintData['masterfp'] ? true : false
  }
  return messageDetails;
}

export function handleResponseMessage(fpUuid: string, data: string) {
  let messageDetails: eventMessageInterface = {
    uuid: generateUUID(),
    fpUuid: fpUuid,
    time : generateDate(),
    message: data
  }
  return messageDetails;
}

export function locationTagMessage(fpUuid: string) {
  return locationTagMessage_ext(fpUuid, process.env.LOCATION)
}

export function locationTagMessage_ext(fpUuid: string, tagString: string) {
  let messageDetails: locationTagInterface = {
    uuid: generateUUID(),
    fpUuid: fpUuid,
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