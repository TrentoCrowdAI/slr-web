import http from 'utils/conn'
import config from 'config/index'

/**
 * get a specific filter
 */
async function selectById(id){
    let url = config.home + config.filters + "/" + id;

    const res = await http.get(url);
    return res;
}

/**
 * dao to get a list of filters associated with a project
 * @param queryData
 * @return {array[objects]}
 */
async function getFiltersList(queryData) {
    let url = config.home + config.filters;
    const res = await http.get(url, queryData);
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

const projectFiltersDao = {
    selectById,
    getFiltersList,
    postFilterIntoProject,
    deleteFilter,
    putFilter,
    "abortRequest" : http.abortRequest
}



export {projectFiltersDao};
