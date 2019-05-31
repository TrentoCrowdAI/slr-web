/*this is the file to communicate with backend by fetch request*/
import config from 'config/index';

//signal to abort the request
let abortController;
//int to know abort error type
let abortRequestType;
//10seconds for timeout
let timeOutTime = 10 * 1000;

//get the localStorage object
const localStorage = window.localStorage;

/**
 * abort all request in progeress by user
 */
function abortRequest() {
    abortController.abort();
    abortRequestType = 1;
    console.log("abort")

}

/**
 * abort all request if timeout
 */
function timeOut() {

    abortController.abort();
    abortRequestType = 2;
}

/**
 * create a basic fetch request
 * @param url
 * @param options request config
 * @param {int} timeOutTime
 * @return {object} response data

 */
async function request(url, options, timeOutTime) {
    try {

        //create a new abortController for this request
        abortController = new AbortController();
        let signal = abortController.signal;
        //initialize as 0 for every request
        abortRequestType = 0;

        let requestOptions = Object.assign(
            {
                //enable the  sending of cookie
                //credentials: (url.includes(config.userInfo)) ? 'omit' : 'include', //if it's a google user api request I don't need credentials
                "mode": 'cors',
                "signal": signal
            },
            options
        );

        //set timeout clock
        let timer = setTimeout(() => timeOut(), timeOutTime);

        let response = await fetch(url, requestOptions);

        //clear timeout clock
        clearTimeout(timer);


        //parse response data
        let data = await parseResponseData(response);
        //response error check
        checkResponseStatus(response,data);
        return  data;

    }
    catch (error) {

        //console.dir(error);

        //if abort error is caused by timeout
        if (abortRequestType === 2) {
            //create a custom error for timeout
            let timeOutError = new Error("Error: Time out to get response from backend");
            timeOutError.name = "timeout";
            return  timeOutError;
        }
        //if is a abort error  caused by user
        else if (abortRequestType === 1) {
            return null;
        }

        return error;


    }
}

/**
 * get method
 * @param url
 * @param queryData quey string
 * @return {object} response data
 */
async function get(url, queryData = "") {
    let query = "";
    if (queryData !== "") {
        query = "?";
        for (let key in queryData) {
            query += key + "=" + encodeURIComponent(queryData[key]) + "&";
        }
        //delete the last &
        query = query.slice(0, query.length - 1);
    }

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json');
    jsonHeaders.append('Content-Type', 'application/json;charset=UTF-8');
    jsonHeaders.append('Authorization', localStorage.getItem("userToken"));

    let options = {
        "method": 'GET',
        "headers": jsonHeaders,
    };

    return await request(url + query, options, timeOutTime);
}

/**
 * delete method
 * @param url
 */
async function deletes(url) {

    let jsonHeaders = new Headers();
    jsonHeaders.append('Authorization', localStorage.getItem("userToken"));

    let options = {
        "method": 'DELETE',
        "headers": jsonHeaders,
    };

    return await request(url, options, timeOutTime);
}

/**
 * post method
 * @param url
 * @param bodyData
 * @return {object } response data
 */
async function post(url, bodyData = "") {

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json, text/plain, */*');
    jsonHeaders.append('Cache-Control', 'no-cache');
    jsonHeaders.append('Content-Type', 'application/json;charset=UTF-8');
    jsonHeaders.append('Authorization', localStorage.getItem("userToken"));

    let body = JSON.stringify(bodyData, null, 2);
    let options = {
        "method": 'POST',
        "headers": jsonHeaders,
        "body": body,
    };

    return await request(url, options, timeOutTime);
}

/**
 * post file method
 * @param url
 * @param bodyData
 * @return {object} response data
 */
async function postFile(url, bodyData = "") {

    //custom timeout for request
    let customTimeOutTime= 10 * 1000;

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json, text/plain, */*');
    jsonHeaders.append('Cache-Control', 'no-cache');
    jsonHeaders.append('Authorization', localStorage.getItem("userToken"));

   // jsonHeaders.append('Content-Type', 'multipart/form-data');
    let options = {
        "method": 'POST',
        "headers": jsonHeaders,
        "body": bodyData
    };

    return await request(url, options, customTimeOutTime);
}


/**
 * put method
 * @param url
 * @param bodyData
 */
async function put(url, bodyData = "") {

    let jsonHeaders = new Headers();
    jsonHeaders.append('Accept', 'application/json, text/plain, */*');
    jsonHeaders.append('Cache-Control', 'no-cache');
    jsonHeaders.append('Content-Type', 'application/json;charset=UTF-8');
    jsonHeaders.append('Authorization', localStorage.getItem("userToken"));

    let body = JSON.stringify(bodyData, null, 2);
    let options = {
        "method": 'PUT',
        "headers": jsonHeaders,
        "body": body,
    };

    return await request(url, options,timeOutTime);
}


/**
 *  * check resposonse status
 * @param response to check
 * @param data data received
 * @throws {Error} if  status code < 200 or status code >= 300
 */
function checkResponseStatus(response, data) {

    if (response.status < 200 || response.status >= 300) {
        const error = new Error(response.statusText);
        error.data = response;
        if(data.payload){
            error.payload = data.payload;
        }
        throw error;
    }

}

/**
 * parse the response of  http request
 * @param response response object
 * @return {object} data parsed
 */
async function parseResponseData(response) {
    //get response data type
    const contentType = response.headers.get('Content-Type');
    let data = null;
    //parse the data by its type
    if (contentType != null) {
        if (contentType.indexOf('text') > -1) {
            data = await response.text()
        }
        if (contentType.indexOf('form') > -1) {
            data = await response.formData();
        }
        if (contentType.indexOf('video') > -1) {
            data = await response.blob();
        }
        if (contentType.indexOf('json') > -1) {
            data = await response.json();
        }
    }
    else if (response != null) {
        data = await response.text();
    }
    return data;
}



//object to export
const http = {
    get,
    post,
    "delete" : deletes,
    put,
    postFile,
    abortRequest,
};

export default http;