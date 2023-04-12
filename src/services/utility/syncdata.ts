import { FPENTITYNAME, URL_SYNC_REMOTE_DATA } from "../../interfaces/const_setting";
import { writeExec } from "./writedata";
import fs = require('graceful-fs')
import { fingerprintDataInterface } from "../../interfaces/file_message_type.interface";
import { postAxiosMethod } from "../axios/post_method";

export function syncData(res, fpTemplateData: string[], uuidArray) {
    if(res.syncData.length !== 0) {
        console.log('syncData length is ',res.syncData.length)
        res.syncData.forEach(element => {
            fpTemplateData.push(element)
            writeExec(FPENTITYNAME.FP_TEMPLATE_MSG, element);
            uuidArray.push(element['uuid']);
        })
        
    }
    if(res.requestData.length !== 0) {
        console.log('request length is ',res.requestData.length)
        let obj = []
        let syncImageData = []
        let syncRemoteData = fpTemplateData.filter(x => {return res.requestData.includes(x['uuid'])})
        syncRemoteData.forEach(element => {
          syncImageData.push(((fs.readFileSync(element['imageName'])).toString('base64')))
        });
        obj.push(syncRemoteData,syncImageData)
        let countRequest = 0;
        do {
          let arrData = []
          arrData.push([obj[0][countRequest]],[obj[1][countRequest]])
          postAxiosMethod(URL_SYNC_REMOTE_DATA, arrData)
          countRequest++;
          console.log('countRequest is ',countRequest)
        }while(countRequest < res.requestData.length)
        console.log('finish sync')
    }
}