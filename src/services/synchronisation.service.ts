import { postAxiosMethod } from "./ConnectionAction/post_method";
import { filterLocalUUIDArray } from "./FileAction/get_local_fpid";
import { syncData } from "./FileAction/sync_data";
import { STAT } from "../interfaces/const_setting";
import * as dotenv from 'dotenv'
import { SynchronisationData } from "../interfaces/data.synchronisation";

dotenv.config();

export class SynchronisationService {
	private VerifiedUUIDArray: string[] = []; // Verified UUID (Synch with server)
    private connectionStatus: STAT = STAT.OFFLINE;
    private remoteToSynch: string = process.env.REMOTE_SERVER; // server to synch
    private thisLocalDate: any[]; // local data to synch
    private entityNameArray: string[]; // local data to synch

    public init(){

        //this.entityNameArray = 
        
        // Add interval (5 min)
        setInterval(()=>{
            // for each entity name repeat
            this.updateLocalStorage();
        },5*60*1000);
    }

    public updateLocalStorage() { // sync local storage to remote server
        if(this.getConnectionStatus() == STAT.ONLINE) {
            // for each entity name repeat
            this.entityNameArray.forEach((entityName)=>{
                this.getRemoteStorage(entityName).then((res) => { // Get all missing FP and add to local storage
                    syncData(res, this.thisLocalDate, this.VerifiedUUIDArray);
                    //handleMessage(RESPONSE_MESSAGE.SUCCESS_SYNCDATA);
                }).catch((err) => {
                    //handleMessage(RESPONSE_MESSAGE.FAILED_SYNCDATA, err);
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
 
  	
	public getRemoteStorage(entityName:string) { // get remote storage sync data
		let localVerifiedFPIds = this.getAllVerifiedLocalFPIds(entityName); // Loop and sent all local FPIds
        let sentData:SynchronisationData = {
            entityName:entityName,
            data:localVerifiedFPIds
        }
        return postAxiosMethod(this.remoteToSynch, localVerifiedFPIds); // Post all localFPIds to server and get newFPIds
	}
	 
	public getAllVerifiedLocalFPIds(entityName:string): string[] {  // get local uuid
        this.VerifiedUUIDArray = filterLocalUUIDArray(this.thisLocalDate) // Loop and get all localVerifiedFPIds
        return this.VerifiedUUIDArray;
        }
}