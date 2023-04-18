
import { FPENTITYNAME, RESPONSE_MESSAGE } from '../../interfaces/constsetting';
import { eventMessageInterface } from '../../interfaces/message.interface';
import { v4 as uuidv4 } from 'uuid';
import { handleResponseMessage } from './generatemessage';
import { writeExec } from './writedata';

export function handleMessage(message: RESPONSE_MESSAGE, err?, res?, uuid?) {

    let localUUID = uuidv4(); // create uuid v4

    if(uuid) localUUID = uuid;
    console.log('MESSAGE : ',message);
    if(err) console.log('ERROR IS : ',err);
    if(res) console.log('RESPONSE IS : ', res);

    // let responseMessage: responseMessageInterface = handleResponseMessage(message, localUUID);
    // writeExec(FPENTITYNAME.RES_MSG, responseMessage);
}