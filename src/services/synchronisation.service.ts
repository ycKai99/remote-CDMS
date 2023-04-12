import { postAxiosMethod } from "./axios/post_method";
import { filterLocalUUIDArray } from "./utility/filterlocaluuidarray";
import { syncData } from "./utility/syncdata";
import { RESPONSE_MESSAGE, STAT } from "../interfaces/const_setting";
import * as dotenv from 'dotenv'
import { SynchronisationData } from "../interfaces/data.synchronisation";
import { handleMessage } from "./utility/handlestatusmessage";
import { refrechConnection } from "./utility/checkconnectionstatus";
import { DbConnectionController } from "./database.service";

dotenv.config();

export class SynchronisationService {

    private dbConnectionController: DbConnectionController = new DbConnectionController();
	private VerifiedUUIDArray: string[] = []; // Verified UUID (Synch with server)
    private connectionStatus: STAT = STAT.OFFLINE;
    private remoteToSynch: string = process.env.REMOTE_SERVER; // server to synch
    private thisLocalData: any[]; // local data to synch
    private entityNameArray: string[] = []; // local data to synch

    public init(){
        let tempEntityName = process.env.storage
        let tempEntityNameArray = tempEntityName.split(",")
        tempEntityNameArray.forEach((keyvalue: string) => {
            let keyvalueArray: string[]
            keyvalueArray = keyvalue.split("=")
            this.entityNameArray.push(keyvalueArray[0])
        })
        let excludeData = ["fingerprintImage", "handleStatusMessage"]
        this.entityNameArray = this.entityNameArray.filter((x) => !excludeData.includes(x))
        // Add interval (5 min)
        // setInterval(() => {
        //     this.updateLocalStorage(); // for each entity name repeat
        // },5*60*1000);
    }

    public async updateLocalStorage() { // sync local storage to remote server
        if(this.getConnectionStatus() == STAT.ONLINE) {
            this.entityNameArray.forEach(async (entityName) => { // for each entity name repeat
                await this.getRemoteStorage(entityName).then((res) => { // Get all missing FP and add to local storage
                    syncData(res, this.thisLocalData, this.VerifiedUUIDArray);
                    handleMessage(RESPONSE_MESSAGE.SUCCESS_SYNCDATA);
                }).catch((err) => {
                    handleMessage(RESPONSE_MESSAGE.FAILED_SYNCDATA, err);
                });
            })
        }
    }

    public getConnectionStatus(): STAT { // return connection status
        return this.connectionStatus;
     }
    public setConnectionStatus(data: STAT) { // set connection status
        this.connectionStatus = data;
    }
    // used to check current connection status is "Online" or "Offline"
	public async checkConnectionStatus(): Promise<STAT> {
        return await refrechConnection();
    }
  	
	public async getRemoteStorage(entityName:string) { // get remote storage sync data
		let localVerifiedFPIds = await this.getAllVerifiedLocalUUID(entityName); // Loop and sent all local FPIds
        let sentData: SynchronisationData = {
            entityName: entityName,
            data: localVerifiedFPIds
        }
        return await postAxiosMethod(this.remoteToSynch+"getNewFPId", sentData); // Post all localFPIds to server and get newFPIds
	}
	 
	public async getAllVerifiedLocalUUID(entityName: string, entityUUID?: string): Promise<string[]> {
        this.thisLocalData = JSON.parse(await this.dbConnectionController.readExec(entityName, entityUUID))  // get local uuid
        console.log('this.thisLocalData : ',this.thisLocalData)
        return this.thisLocalData;
        // this.VerifiedUUIDArray = filterLocalUUIDArray(this.thisLocalData); // Loop and get all localVerifiedFPIds
        // return this.VerifiedUUIDArray;
    }
}