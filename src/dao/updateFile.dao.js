import http from 'utils/conn'
import config from 'config/index'

/**
 * dao to post the file pdf to backend
 * @param data the file data
 * @return {objects}
 */
async function updatePdf(data) {
    let url = config.home +config.pdf_parse_server;

    let res = await http.postFile(url, data);
    return res;

}

/**
 * dao to post the file csv to backend
 * @param data the file data
 * @return {objects}
 */
async function uploadCsv(data) {
    let url = config.home +config.csv_parse_server;

    let res = await http.postFile(url, data);
    return res;

}


const updateFileDao = {
    updatePdf,
    uploadCsv,
    "abortRequest": http.abortRequest
}


export {updateFileDao};