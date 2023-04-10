import { Injectable } from '@nestjs/common';
import { dataStorageInterface } from './interfaces/data.storage';
import { StorageController } from './services/storage.service';

@Injectable()
export class AppService {
 
  storageController = new StorageController();

  getHello() {
    return { hello: 'world' };
  }

  dataOperation(data:dataStorageInterface){

    let returnData:any

    if(data.operation=="read")
    { 
      returnData = this.storageController.readData(data.entityname,data.uuid)
    }

    if(data.operation=="write")
    {
      returnData = this.storageController.writeData(data.entityname,data.uuid,data.data)
    }

    if(data.operation=="update")
    {
      returnData = this.storageController.updateData(data.entityname,data.uuid,data.data)
    }

    if(data.operation=="delete")
    {
      returnData = this.storageController.deleteData(data.entityname,data.uuid)
    }

    return returnData;
  }
}
