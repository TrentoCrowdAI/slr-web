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
 * dao to post a new filter
 * @param bodyData
 * @return {Object} filter created
 */
async function postFilterIntoProject(bodyData) {
    let url = config.home + config.filters;
    return await http.post(url, bodyData);
}

/**
 * dao to delete a filter
 * @param filter_id
 * @return {String} empty string
 */
async function deleteFilter(filter_id) {
    let url = config.home + config.filters + "/" + filter_id;
    return await http.delete(url);
}

/**
 * dao to update a filter
 * @param filter_id
 * @param bodyData
 * @return {String} empty string
 */
async function putFilter(filter_id, bodyData) {
    let url = config.home + config.filters + "/" + filter_id;
    return await http.put(url, bodyData);
}

const projectScreeningDao = {
    startAutoScreening,
    getAutoScreeningStatus,
    postFilterIntoProject,
    deleteFilter,
    putFilter,
    "abortRequest" : http.abortRequest
}



export {projectScreeningDao};
