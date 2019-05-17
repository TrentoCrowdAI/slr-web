import http from 'utils/conn'
import config from 'config/index'

/**
 * dao to post validation token
 * @param bodyData
 * @return {Object} Google user data
 */
async function postTokenId(bodyData) {
    let url = config.home + config.userLogin;
    return await http.post(url, bodyData);
}


const usersDao = {
    postTokenId
}


export {usersDao};