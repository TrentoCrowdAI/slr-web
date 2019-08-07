import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import  {AppProvider} from 'components/providers/appProvider';
import config from 'config/index'

import nock from 'nock';
nock.disableNetConnect();

const TEST_HOME = config.home;

const optionsHeaders = { 
    'access-control-allow-origin': '*',
    'access-Control-Allow-Credentials': 'true',
    'access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
    'access-Control-Allow-Headers': 'Origin, X-Requested-With, Accept, Cache-Control, Content-Type, Authorization' 
};
const responseHeadersJson = { 
    'access-control-allow-origin': '*',
    'Content-Type': 'application/json'
};

const responseHeadersGeneric = { 
    'access-control-allow-origin': '*'
};

const errorRes = {
    "statusCode": 505,
        "payload": {
          "statusCode": 505,
          "error": "error",
          "message": "test error"
        },
    "headers": {}
};

const notFoundRes = {
    "statusCode": 404,
        "payload": {
          "statusCode": 404,
          "error": "error",
          "message": "Not Found"
        },
    "headers": {}
}


/**
 * this function will wrap the component inside the router and provider
 * in order to provide basic functionalities to components that require them
 * @param {JSX.Element} component 
 */
const testWrap = function (component, route= "/") {
    return (
        <MemoryRouter initialEntries={[route]}>
            <AppProvider testing={true}>
                {component}
            </AppProvider>
        </MemoryRouter>
    );
}


/**
 * this will mock the OPTONS request (which the app sends before every request to a new enpoint)
 * @param {string} url request
 * @param {JSON} query request
 */
function nockOptions(url = "/", query = {}){
    return nock(TEST_HOME)
            .defaultReplyHeaders(optionsHeaders)
            .options(url)
            .query(query)
            .delay(10)
            .reply(200, 'OK');
}

/**
 * this will mock the GET request
 * @param {string} url request
 * @param {JSON} query request
 * @param {JSON} data response
 * @param {number} statusCode response
 */
function nockGet(url = "/", query = {}, data, statusCode = 200) {
    return nock(TEST_HOME)
        .defaultReplyHeaders(responseHeadersJson)
        .get(url)
        .query(query)
        .delay(20)
        .reply(statusCode, data);
}

/**
 * this will mock the PUT request
 * @param {string} url request
 * @param {JSON} payload request
 */
function nockPut(url = "/", payload = {}) {
    return nock(TEST_HOME)
        .defaultReplyHeaders(responseHeadersGeneric)
        .put(url, payload)
        .delay(20)
        .reply(204, "");
}

/**
 * this will mock the POST request
 * @param {string} url request
 * @param {JSON} payload request
 * @param {JSON} response
 * @param {number} statusCode response
 */
function nockPost(url = "/", payload = {}, response= {}, statusCode = 201) {
    return nock(TEST_HOME)
        .defaultReplyHeaders(responseHeadersJson)
        .post(url, payload)
        .delay(20)
        .reply(statusCode, response);
}

export {
    errorRes,
    notFoundRes,
    testWrap,
    nockOptions,
    nockGet,
    nockPut,
    nockPost
};