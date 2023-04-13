import axios from 'axios';
import { STAT } from '../../interfaces/constsetting';

export async function refrechConnection(): Promise<STAT> {
    let data: STAT;
    await axios.get(process.env.REMOTE_SERVER)
        .then((res) => {console.log('REMOTE SERVER LIVE');data = STAT.ONLINE;})
        .catch((err) => {console.log('REMOTE SERVER DEAD');data = STAT.OFFLINE;})
    return data;
}