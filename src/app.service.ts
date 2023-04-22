import { Injectable } from '@nestjs/common';
import { dataStorageInterface } from './interfaces/data.storage';
import { StorageController } from './services/storage.service';

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

  async dataOperation(data: dataStorageInterface){

    let returnData: any;

    if(data.operation === "read")
    { 
      returnData = await this.storageController.readData(data.entityName, data.uuid)
    }

    if(data.operation === "write")
    {
      returnData = await this.storageController.writeData(data.entityName, data.uuid, data.data)
    }

    if(data.operation === "update")
    {
      returnData = await this.storageController.updateData(data.entityName, data.uuid, data.data)
    }

    if(data.operation === "delete")
    {
      returnData = await this.storageController.deleteData(data.entityName, data.uuid)
    }
    return returnData;
  }
}
