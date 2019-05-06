import http from 'utils/conn'
import config from 'config/index'

/**
 * dao to search local papers
 * @param queryData
 * @return {array[objects]}
 */
async function search(queryData){
    let url = config.home+config.search;

        const res = await http.get(url, queryData);
        return res;

}

/**
 * get a specific paper
 */
async function selectById(id){
    let url = config.home + config.papers + "/" + id;

    const res = await http.get(url);
    return res;
}



const paperDao = {
    search,
    selectById,
    "abortRequest" : http.abortRequest
}



export {paperDao};