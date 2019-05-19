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

/**
 * get user by token
 * @return {Object} user data
 */
async function getUserByTokenId() {
    let url = config.home + config.userInfo;
    return await http.get(url);
}

/**
 * logout user
 * @return {Object} user data
 */
async function logoutUser() {
    let url = config.home + config.userLogout;
    return await http.get(url);
}

const usersDao = {
    postTokenId,
    getUserByTokenId,
    logoutUser
}


export {usersDao};