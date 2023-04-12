import axios from 'axios';
import { CHECK_SERVER, STAT } from '../../interfaces/const_setting';

export async function refrechConnection(): Promise<STAT> {
    let data: STAT;
    await axios.get(CHECK_SERVER)
        .then((res) => {console.log('REMOTE SERVER LIVE');data = STAT.ONLINE;})
        .catch((err) => {console.log('REMOTE SERVER DEAD');data = STAT.OFFLINE;})
    return data;
}