import React from 'react';
import { render, waitForElement, getAllByText, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {nockOptions, nockGet} from 'utils/testUtils';
import App from 'App';

const getProjectsRes = 
{"results":[
    {"id":"7","date_created":"2019-07-08T07:02:36.962Z","date_last_modified":"2019-07-15T13:34:06.019Z","date_deleted":null,
        "data":{"name":"Coool","user_id":["3"],
        "description":"C"}},
    {"id":"8","date_created":"2019-07-09T12:34:54.052Z","date_last_modified":"2019-07-15T13:01:56.753Z","date_deleted":null,
        "data":{"name":"CodeScene","user_id":["3"],
        "description":"The analysis tool to identify and prioritize technical debt and evaluate your organizational efficiency"}}],
    "totalResults":"2"
};
const projectsPaginationQuery = 
{
    orderBy: "date_last_modified",
    start: 0,
    count: 10
};

describe('projects page', () => {
    afterEach(cleanup);
    test('it renders the list of projects', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/projects", projectsPaginationQuery);
        
        //will intercept the GET request
        const scope = nockGet("/projects", projectsPaginationQuery, getProjectsRes);
        
        //app to render with a specific url
        const tree = (
            <MemoryRouter initialEntries={["/projects"]}>
                <App testing={true}/>
            </MemoryRouter>
        );
        
        //I render the app and extract its DOM
        const {container} = render(tree);

        //check title on navbar
        expect(container.getElementsByClassName("static-title")[0].innerHTML).toBe("PROJECTS");

        //wait for projects list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                //I espect to find a project card with a title from the GET response
                return element.classList[1] === "project-card" && element.getElementsByTagName("h3")[0].innerHTML === "CodeScene";
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })
})