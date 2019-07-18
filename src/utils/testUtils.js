import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import  {AppProvider} from 'components/providers/appProvider';

import nock from 'nock';
nock.disableNetConnect();

const TEST_HOME = "http://localhost:3001";

const optionsHeaders = { 
    'access-control-allow-origin': '*',
    'access-Control-Allow-Credentials': 'true',
    'access-Control-Allow-Methods': 'GET, POST, OPTIONS, DELETE, PUT',
    'access-Control-Allow-Headers': 'Origin, X-Requested-With, Accept, Cache-Control, Content-Type, Authorization' 
};
const responseHeaders = { 
    'access-control-allow-origin': '*',
    'Content-Type': 'application/json'
};

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
 */
function nockGet(url = "/", query = {}, data) {
    return nock(TEST_HOME)
        .defaultReplyHeaders(responseHeaders)
        .get(url)
        .query(query)
        .delay(20)
        .reply(200, data);
}

export {
    testWrap,
    nockOptions,
    nockGet
};