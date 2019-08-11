import React, {useState} from 'react';
import { render, waitForElement, getAllByText, cleanup, fireEvent } from '@testing-library/react';

import {nockOptions, nockGet, nockPut, unauthRes, testWrap} from 'utils/testUtils';

import ProjectsList from 'components/projects_page/projectsList';
import ProjectCard from 'components/projects_page/projectCard';
import ProjectName from 'components/projects_page/projectName';
import ProjectPage from '../projectPage';


const projectsRes = 
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

const projectRes =
{
    "id":"19","date_created":"2019-07-30T12:22:20.111Z","date_last_modified":"2019-08-05T07:37:10.312Z","date_deleted":null,
    "data":{
        "name":"project 14","user_id":["2","3","4"],"description":"d","manual_screening_type":"multi-predicate"}
};

describe('projects list page', () => {

    afterEach(cleanup);

    test('it renders the list of projects', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/projects", projectsPaginationQuery);
        
        //will intercept the GET request
        const scope = nockGet("/projects", projectsPaginationQuery, projectsRes);

        //I render the component and extract its DOM
        const {container} = render(
            //you put the component you want to test as a testWrap argument
            testWrap(<ProjectsList location={{search: ""}} match={{url: ""}}/>)
        );

        //wait for projects list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                //I expect to find a project card with a title from the GET response
                return element.classList[1] === "project-card" && element.getElementsByTagName("h3")[0].innerHTML === "CodeScene";
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })

    test('it renders a project card', async () => {

        //I render the component and extract its DOM
        const {container} = render(
            //you put the component you want to test as a testWrap argument
            testWrap(<ProjectCard callDelete={undefined} path={"/"} project={projectsRes.results[0]}/>)
        );

        //I expect the project data to be shown
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(projectsRes.results[0].data.name);
        expect(container.getElementsByTagName("p")[0].innerHTML).toBe(projectsRes.results[0].data.description);
        
    })

    test('it renders the project title and allows to edit it', async () => {

        //I render the component and extract its DOM
        const {container} = render(
            //you put the component you want to test as a testWrap argument
            testWrap(<ProjectName project={projectsRes.results[0]}/>)
        );

        //I expect the project data to be shown
        expect(container.getElementsByTagName("h2")[0].innerHTML).toBe(projectsRes.results[0].data.name);

        //I expext the input field to showup after I click
        expect(container.getElementsByTagName("input")[0].style.width).toBe("0px");
        fireEvent.click(container.getElementsByTagName("button")[0]);
        expect(container.getElementsByTagName("input")[0].style.width).toBe("");

    })
})

describe('project page', () => {
    test('it forbids user from accessing unath project', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/projects/1", {}, true);
        
        //will intercept the GET request
        const scope = nockGet("/projects/1", {}, unauthRes, unauthRes.statusCode, undefined , true);

        //I render the componene
        const {container} = render(
            testWrap(<ProjectPage location={{search: ""}} history={[]} match={{params: {id: "1"}}}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for error page to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("forbidden-wrapper").length === 1);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
    })
})