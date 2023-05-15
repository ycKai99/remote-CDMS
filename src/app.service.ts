import { Injectable } from '@nestjs/common';
import { dataStorageInterface } from './interfaces/data.storage';
import { StorageController } from './services/storage.service';
import { handleMessage } from './services/utility/handlestatusmessage';
import { RESPONSE_MESSAGE } from './interfaces/constsetting';

@Injectable()
export class AppService {

  private storageController = new StorageController();

  constructor() {
    console.log('app running...')
    this.storageController.init();
  }

  getHello() {
    return { hello: 'world' };
  }

  async dataOperation(data: dataStorageInterface) {
    let returnData: any;
    if (data.operation === "read") {
      returnData = await this.storageController.readData(data.entityName, data.uuid)
    }

    if (data.operation === "write") {
      returnData = await this.storageController.writeData(data.entityName, data.uuid, data.data)
    }

    if (data.operation === "update") {
      returnData = await this.storageController.updateData(data.entityName, data.uuid, data.data)
    }

    if (data.operation === "delete") {
      returnData = await this.storageController.deleteData(data.entityName, data.uuid)
    }
    return returnData;
  }


  // send data to CDMS
  async syncOperation(data) {

    let entityName: string = data.entityName;
    let payloadData: string[] = data.data;
    let requestDataFromCDMS = [];
    // read data from server
    let localData = JSON.parse(await this.storageController.readData(entityName));
    localData = localData.map(({ _id, __v, ...others }) => others);
    // console.log('localData: ', localData);// no id and v
    // filter uuid from data
    let filterUUIDArray: string[] = filterLocalUUIDArray(localData);
    // console.log('filterUUIDArray: ', filterUUIDArray);// no id and v
    // filter uuid : sync CDMS data
    let requestUUIDFromCDMS: string[] = filterUUIDArray.filter((x) => {
      return !payloadData.includes(x)
    })
    // console.log('requestUUIDFromCDMS: ', requestUUIDFromCDMS);// no id and v
    // filter uuid : sync central server data
    let requestUUIDFromRemote: string[] = payloadData.filter((x) => {
      return !filterUUIDArray.includes(x)
    })
    // console.log('requestUUIDFromRemote: ', requestUUIDFromRemote);// no id and v
    // Retrieve data if requestUUIDFromCDS
    if (requestUUIDFromCDMS.length > 0) {
      requestDataFromCDMS = await Promise.all(requestUUIDFromCDMS.map(async (x) => {
        let data = JSON.parse(await this.storageController.readData(entityName, x));
        console.log('data: ', data);// no id and v
        return data[0];
      }))
    }

    console.log('entity Name : ', entityName)
    console.log('CDMS UUID NEEDED : ', requestUUIDFromCDMS.length)
    console.log('REMOTE UUID NEEDED : ', requestUUIDFromRemote.length)
    console.log('CDMS DATA NEEDED : ', requestDataFromCDMS.length)

    let payload = {
      entityName: entityName,
      requestUUIDFromRemote: JSON.stringify(requestUUIDFromRemote),
      requestDataFromCDMS: JSON.stringify(requestDataFromCDMS)
    }
    return payload
  }

  //retrieve data from CDMS
  async syncDataOperation(body) {
    let entityName = body.payloadEntityName;
    let entityData = body.data;
    entityData.forEach((x) => {
      if (x == null) {
        console.log('Error: Data is null');
      }
      else {
        // let excludeData = ['_id', '__v']
        // let filteredObj = Object.keys(x)
        //   .filter((key) => {
        //     return !excludeData.includes(key)
        //   })
        //   .reduce((result, current) => {
        //     result[current] = x[current];
        //     console.log('current: ', current)
        //     return result
        //   }, {})
        x = x.map(({ _id, __v, ...others }) => others);
        this.storageController.writeData(x.entityName, x.uuid, JSON.stringify(x[0]))
      }
    });
  }
}

function filterLocalUUIDArray(data): string[] {
  let arr: string[] = [];
  // data.forEach(element => { arr.push(element['uuid']); });
  data.forEach((item) => {
    let uuid: string;
    if (item.entityName === 'personprofile') {
      uuid = item.uuid;
      arr.push(uuid);
    }
    else {
      uuid = item.fileData.uuid;
      arr.push(uuid);
    }

  });
  return arr;
}
