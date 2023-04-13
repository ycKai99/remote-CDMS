import { handleMessage } from "../utility/handlestatusmessage";
import { RESPONSE_MESSAGE } from "../../interfaces/constsetting";

const axios = require('axios')

export async function getAxiosMethod(url: string) {

    let fptemplate: Promise<string> = axios.get(url)
        .then(res => { 
            handleMessage(RESPONSE_MESSAGE.AXIOS_SUCCESS_GET)
            return res.data;
        })
        .catch(err => { 
            handleMessage(RESPONSE_MESSAGE.AXIOS_FAILED_GET, err)
            return false;
        })
    return fptemplate;
}