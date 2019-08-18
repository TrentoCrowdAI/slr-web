import http from 'utils/conn'
import config from 'config/index'

/**
 * dao to get a projects list
 * @param queryData
 * @return {array[objects]}
 */
async function getProjectsList(queryData = "") {
    let url = config.home + config.projects
    let res = await http.get(url, queryData);
    return res;


}

/**
 * dao to get a project
 * @param project_id
 * @return {Object} project requested
 */
async function getProject(project_id) {
    let url = config.home + config.projects + "/" + project_id;
    let res = await http.get(url);
    return res;
}

/**
 * dao to get project collaborators
 * @param project_id
 * @return {array[objects]} array of collaborators
 */
async function getProjectCollaborators(project_id) {
    let url = config.home + config.projects + "/" + project_id + "/collaborators";
    let res = await http.get(url);
    return res;
}

/**
 * dao to get project screeners
 * @param project_id
 * @return {array[objects]} array of screeners
 */
async function getProjectScreeners(project_id) {
    let url = config.home + config.projects + "/" + project_id + "/screeners";
    let res = await http.get(url);
    return res;
}

/**
 * dao to add project manual screenning
 * @param project_id
 * @param bodyData
 * @return {Object} screening data
 */
async function postProjectManualScreeningData(project_id, bodyData) {
    let url = config.home + config.projects + "/" + project_id + "/screeners";
    return await http.post(url, bodyData);
}

/**
 * dao to update project manual screenning
 * @param project_id
 * @param bodyData
 * @return {Object} screening data
 */
async function putProjectManualScreeningData(project_id, bodyData) {
    let url = config.home + config.projects + "/" + project_id + "/screeners";
    return await http.put(url, bodyData);
}



/**
 * dao to post a new project
 * @param bodyData
 * @return {Object} project created
 */
async function postProject(bodyData) {
    let url = config.home + config.projects;
    return await http.post(url, bodyData);
}

/**
 * dao to post a new collaborator
 * @param project_id
 * @param bodyData email of collaborator
 * @return {String} empty string
 */
async function addProjectCollaborator(project_id, bodyData) {
    let url = config.home + config.projects + "/" + project_id + "/collaborators";
    return await http.post(url, bodyData);
}

/**
 * dao to put a old project
 * @param project_id
 * @param bodyData
 * @return {String} empty string
 */
async function putProject(project_id, bodyData) {
    let url = config.home + config.projects + "/" + project_id;
    return await http.put(url, bodyData);
}

/**
 * dao to delete a project
 * @param project_id
 * @param bodyData
 * @return {String} empty string
 */
async function deleteProject(project_id) {
    let url = config.home + config.projects + "/" + project_id;
    let res = await http.delete(url);
    return res;
}

/**
 * dao to remove collaborator
 * @param project_id
 * @param collaborator_id the mail of the collaborator
 * @return {String} empty string
 */
async function removeProjectCollaborator(project_id, collaborator_id) {
    let url = config.home + config.projects + "/" + project_id + "/collaborators/" + collaborator_id;
    let res = await http.delete(url);
    return res;
}


const projectsDao = {
    getProjectsList,
    getProject,
    postProject,
    putProject,
    deleteProject,
    "abortRequest": http.abortRequest,
    getProjectCollaborators,
    getProjectScreeners,
    postProjectManualScreeningData,
    putProjectManualScreeningData,
    removeProjectCollaborator,
    addProjectCollaborator
}


export {projectsDao};