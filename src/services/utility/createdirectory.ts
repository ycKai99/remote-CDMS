import fs = require('graceful-fs')
import { RESPONSE_MESSAGE } from '../../interfaces/const_setting';
import { handleMessage } from './handlestatusmessage';

export function makeDirectory(dir: string) {
    if (fs.existsSync(dir)) { // if folder is exist then return false
        handleMessage(RESPONSE_MESSAGE.FOLDER_EXISTED)
    } else { // if folder not exist then create folder
        fs.mkdirSync(dir);
        handleMessage(RESPONSE_MESSAGE.FOLDER_CREATED)
    }
  }