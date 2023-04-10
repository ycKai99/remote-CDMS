import fs = require('graceful-fs')
import { DIRECTORY, FILE_EXTENSION, RESPONSE_MESSAGE } from '../../interfaces/const_setting';
import { handleMessage } from './handle_error_message';

export function writeExec(filePath, data) {
    let readFileName = "./"+DIRECTORY+"/"+filePath+"."+FILE_EXTENSION.JSON;
    fs.appendFile(readFileName, JSON.stringify(data,null,4)+"\r\n", (err) => {
        if(err) {
            handleMessage(RESPONSE_MESSAGE.FAILED_WRITE_DATA, err)
        }else{
            handleMessage(RESPONSE_MESSAGE.SUCCESS_WRITE_DATA)
        }
    });
}