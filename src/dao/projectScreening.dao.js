import http from 'utils/conn'
import config from 'config/index'

/**
 * start auto screening
 */
async function startAutoScreening(bodyData){
    let url = config.home + config.auto_screening;
    return await http.post(url, bodyData)
}

/**
 * start manual screening
 */
async function startManualScreening(bodyData){
    let url = config.home + config.screenings;
    return await http.post(url, bodyData)
}

/**
 * auto screening status
 * @param project_id
 * @return {Number} completion percentage
 */
async function getAutoScreeningStatus(project_id) {
    let url = config.home + config.auto_screening;
    const res = await http.get(url, project_id);
    return res;

}

/**
 * dao to get projects to screen list
 * @param queryData
 * @return {array[objects]}
 */
async function getProjectPaperToScreen(project_id) {
    let url = config.home + config.screenings_list + "/" + project_id;
    let res = await http.get(url);
    return res;


}

/**
 * dao to get next paper to screen in a project
 * @param queryData
 * @return {array[objects]}
 */
async function getProjectsToScreen(queryData = "") {
    let url = config.home + config.screenings_list;
    let res = await http.get(url, queryData);
    return res;


}

/**
 * sumbit a vote
 */
async function submitVote(bodyData){
    let url = config.home + config.votes;
    return await http.post(url, bodyData)
}

const projectScreeningDao = {
    startAutoScreening,
    startManualScreening,
    getAutoScreeningStatus,
    getProjectPaperToScreen,
    getProjectsToScreen,
    submitVote,
    "abortRequest" : http.abortRequest
}



export {projectScreeningDao};
