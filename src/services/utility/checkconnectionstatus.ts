import axios from 'axios';
import { CHECK_SERVER, STAT } from '../../interfaces/constsetting';

export async function refrechConnection(): Promise<STAT> {
    let data: STAT;
    await axios.get("http://192.168.100.33:5050/")
        .then((res) => {console.log('REMOTE SERVER LIVE');data = STAT.ONLINE;})
        .catch((err) => {console.log('REMOTE SERVER DEAD');data = STAT.OFFLINE;})
    return data;
}