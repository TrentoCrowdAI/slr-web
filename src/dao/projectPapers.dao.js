import http from 'utils/conn'
import config from 'config/index'

/**
 * dao to get a list of paper associated with a project
 * @param queryData
 * @return {array[objects]}
 */
async function getPapersList(queryData) {
    let url = config.home + config.papers
    const res = await http.get(url, queryData);
    return res;

}

/**
 * dao to get a paper
 * @param paper_id
 * @return {Object} paper requested
 */
async function getPaper(paper_id) {
    let url = config.home + config.papers + "/" + paper_id;
    return await http.get(url);
}

/**
 * dao to post a new paper
 * @param bodyData
 * @return {Object} project created
 */
async function postPaperIntoProject(bodyData) {
    let url = config.home + config.papers;
    return await http.post(url, bodyData);
}

/**
 * dao to post a new custom paper
 * @param bodyData
 * @return {Object} project created
 */
async function postCustomPaperIntoProject(bodyData) {
    let url = config.home + config.customPapers;
    return await http.post(url, bodyData);
}


/**
 * dao to put a old paper
 * @param paper_id
 * @param bodyData
 * @return {String} empty string
 */
async function putPaper(paper_id, bodyData) {
    let url = config.home + config.papers + "/" + paper_id;
    return await http.put(url, bodyData);
}

/**
 * dao to delete a paper
 * @param paper_id
 * @param bodyData
 * @return {String} empty string
 */
async function deletePaper(paper_id) {
    let url = config.home + config.papers + "/" + paper_id;
    return await http.delete(url);
}


const projectPapersDao = {
    getPapersList,
    getPaper,
    postPaperIntoProject,
    postCustomPaperIntoProject,
    putPaper,
    deletePaper,
    "abortRequest": http.abortRequest
}


export {projectPapersDao};