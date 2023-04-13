import { handleMessage } from "../utility/handlestatusmessage";
import { RESPONSE_MESSAGE } from "../../interfaces/constsetting";

const axios = require('axios')

export async function postAxiosMethod(url: string, data:any) {
    let newVerififedFingerPrints = await axios.post(url, data)
      .then(res => {
        handleMessage(RESPONSE_MESSAGE.AXIOS_SUCCESS_POST)
        return res.data;
      })
      .catch(err => {
        handleMessage(RESPONSE_MESSAGE.AXIOS_FAILED_POST, err)
        return false;
      })
    return newVerififedFingerPrints;
}