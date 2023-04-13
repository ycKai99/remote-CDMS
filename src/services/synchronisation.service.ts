import { postAxiosMethod } from "./axios/postmethod";
import { filterLocalUUIDArray } from "./utility/filterlocaluuidarray";
import { syncData } from "./utility/syncdata";
import { RESPONSE_MESSAGE, STAT } from "../interfaces/constsetting";
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

    public async init(){
        let tempEntityName = process.env.storage
        let tempEntityNameArray = tempEntityName.split(",")
        tempEntityNameArray.forEach((keyvalue: string) => {
            let keyvalueArray: string[]
            keyvalueArray = keyvalue.split("=")
            this.entityNameArray.push(keyvalueArray[0])
        });
        // let excludeData = ["fingerprintImage", "handleStatusMessage", "locationrelation", "locationtag", "registeredFingerprintMessage"]
        // this.entityNameArray = this.entityNameArray.filter((x) => !excludeData.includes(x))
        
        this.checkConnectionStatus().then(async (res) => {    
            await this.setConnectionStatus(res);
            await this.updateLocalStorage();
          }).catch((err) => {
            handleMessage(RESPONSE_MESSAGE.FAILED_REFRESH_CONNECTION, err)
          });
        // Add interval (5 min)
        // setInterval(() => {
        //     this.updateLocalStorage(); // for each entity name repeat
        // },5*60*1000);
    }

    public async updateLocalStorage() { // sync local storage to remote server
        if(this.getConnectionStatus() == STAT.ONLINE) {
            this.entityNameArray.forEach(async (entityName) => { // for each entity name repeat
                await this.getRemoteStorage(entityName).then(async (res) => { // Get all missing FP and add to local storage
                    // syncData(res, this.thisLocalData, this.VerifiedUUIDArray);
                    let currentEntityName = res.entityName
                    let requestUUIDFromRemote = JSON.parse(res.requestUUIDFromRemote)
                    let requestDataFromCDMS = JSON.parse(res.requestDataFromCDMS)
                    
                    if(requestUUIDFromRemote.length > 0) {
                        console.log('requestUUIDFromRemote syncing...');
                        let localDataArray = await Promise.all(requestUUIDFromRemote.map(async (x) => {
                            let result = JSON.parse(await this.dbConnectionController.readExec(currentEntityName, x))
                            return result[0];
                        }));
                        let payload = {
                            payloadEntityName: currentEntityName,
                            data: JSON.stringify(localDataArray)
                        };
                        await postAxiosMethod(this.remoteToSynch+"syncData", payload);
                        // handleMessage(RESPONSE_MESSAGE.SUCCESS_SYNCDATA);
                    }
                    if(requestDataFromCDMS.length > 0) {
                        console.log('requestDataFromCDMS syncing...')
                        requestDataFromCDMS.forEach((x) => {
                            this.dbConnectionController.writeExec(currentEntityName, x)
                        })
                        handleMessage(RESPONSE_MESSAGE.SUCCESS_SYNCDATA);
                    }
                    
                }).catch((err) => {
                    handleMessage(RESPONSE_MESSAGE.FAILED_SYNCDATA, err);
                });
            })
        }
    }

    public getConnectionStatus(): STAT { // return connection status
        return this.connectionStatus;
     }
    public async setConnectionStatus(data: STAT) { // set connection status
        this.connectionStatus = data;
    }
    // used to check current connection status is "Online" or "Offline"
	public async checkConnectionStatus(): Promise<STAT> {
        return await refrechConnection();
    }
  	
	public async getRemoteStorage(entityName: string) { // get remote storage sync data
		let localVerifiedFPIds = await this.getAllVerifiedLocalUUID(entityName); // Loop and sent all local FPIds
        let sentData: SynchronisationData = {
            entityName: entityName,
            data: localVerifiedFPIds
        }
        return await postAxiosMethod(this.remoteToSynch+"sync", sentData); // Post all localFPIds to server and get newFPIds
	}
	 
	public async getAllVerifiedLocalUUID(entityName: string, entityUUID?: string): Promise<string[]> {
        this.thisLocalData = JSON.parse(await this.dbConnectionController.readExec(entityName, entityUUID))  // get local uuid
        this.VerifiedUUIDArray = filterLocalUUIDArray(this.thisLocalData); // Loop and get all localVerifiedFPIds
        return this.VerifiedUUIDArray;
    }
}