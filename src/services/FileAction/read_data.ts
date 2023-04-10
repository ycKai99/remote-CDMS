import fs = require('graceful-fs')
import { DIRECTORY, FILE_EXTENSION, RESPONSE_MESSAGE } from '../../interfaces/const_setting';
import { makeDirectory } from './create_directory';
import { handleMessage } from './handle_error_message';

export function readExec(fileName, entityUUID?) {
    let result;
    // if(entityUUID) {
        //   readFileName = "./"+DIRECTORY
        // };
    let readFileName = "./"+DIRECTORY+"/"+fileName+"."+FILE_EXTENSION.JSON;
    try {
        let filestat = fs.statSync(readFileName);
        let filesize = filestat.size / (1024 * 1024); // convert to MB
        if(filesize <= 40) { // if file size larger than 40MB
            let rawData = fs.readFileSync(readFileName, 'utf-8').toString();
            if(rawData.length > 0) {
                let arr = [];
                let data = rawData.split("\r\n");
                data.forEach(element => {
                    try{
                        if(element !== '') {
                            let json = JSON.parse(element)
                            arr.push(json);
                        }
                    }catch(err) {
                        result = [];
                        handleMessage(RESPONSE_MESSAGE.FAILED_READ_FILE_JSON, err)
                    }
                });
                result = arr;
            }
            else{
                result = [];
            }
        }
        else {
            result = [];
            handleMessage(RESPONSE_MESSAGE.FAILED_EXCEED_FILE_SIZE)
        }
    }catch(err) {
        if(err.code === "ENOENT" || err.code === undefined) { // if folder or file does not exist
            makeDirectory(DIRECTORY); // create folder
            fs.writeFile(readFileName,'', (error) => { // create file
                if(error) {
                    handleMessage(RESPONSE_MESSAGE.FAILED_CREATE_FILE, error)
                }else {
                    handleMessage(RESPONSE_MESSAGE.SUCCESS_CREATE_FILE)
                    readExec(fileName, entityUUID)
                }
            });
        }
        else{
            handleMessage(RESPONSE_MESSAGE.UNKNOWN_ERROR, err)
        }
    }
    console.log('result is ',result)
    return result;
}