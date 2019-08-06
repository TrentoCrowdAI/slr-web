import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, errorRes, testWrap} from 'utils/testUtils';

import ProjectPaperCard from 'components/projects_page/papers_tab/projectPaperCard';
import ProjectDescription from '../projectDescription';
import { PrintPapersList } from 'components/modules/printPapersList';
import PapersTab from '../papersTab';

const papersRes = 
    {
    "results":
        [
            {
                "id":"1189","date_created":"2019-07-30T12:22:37.197Z","date_last_modified":"2019-07-30T12:28:17.061Z","date_deleted":null,
                "data":{"doi":"","eid":"2-s2.0-85016119005","date":"","link":"","year":"2018","notes":"","title":"IT-based wellness tools for older adults",
                        "manual":"","source":"","authors":"Joe J., Hall A., Chi N.-C., Thompson H., Demiris G.","abstract": "Objective",
                        "metadata":{"votes":[],"screened":"manual"},"source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
                "project_id":"19"},
            {
                "id":"1191","date_created":"2019-07-30T12:22:37.197Z","date_last_modified":"2019-07-30T12:40:35.324Z","date_deleted":null,
                "data":{"doi":"","eid":"2-s2.0-85040066051","date":"","link":"","year":"2018","notes":"","title":"What drives live-stream usage intention?","manual":"","source":"","authors":"Chen C.-C., Lin Y.-C.","abstract":"Live-stream is the real-time audio and video transmission",
                        "metadata":{"automatedScreening":{"value":0.71,"filters":[{"id":"1","filterValue":0.93},{"id":"2","filterValue":0.72},{"id":"3","filterValue":0.48}]}},
                        "source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
                "project_id":"19"}
        ],
    "totalResults": 2
    };

const projectRes =
    {
        "id":"19","date_created":"2019-07-30T12:22:20.111Z","date_last_modified":"2019-08-05T07:37:10.312Z","date_deleted":null,
        "data":{
            "name":"project 14","user_id":["2","3","4"],"description":"d","manual_screening_type":"multi-predicate"}
    };

const collaboratorsRes =
    [
        {
            "id":"2","date_created":"2019-07-30T06:37:25.813Z","date_last_modified":"2019-07-30T06:37:25.813Z","date_deleted":null,
            "data":{"name":"user tetso","email":"tetso@gmail.com","picture":"http://photo.jpg"}
        },
        {
            "id":"3","date_created":"2019-07-30T07:33:27.922Z","date_last_modified":"2019-07-30T07:34:58.684Z","date_deleted":null,
            "data":{"name":"user tetsu","email":"tetsu@gmail.com","picture":"http://photo.jpg"}
        }
    ];

const papersPaginationQuery = 
    {
       "project_id":19,
       "type":"all",
       "orderBy":"date_created",
       "sort":"DESC",
       "start":"0",
       "count":"10"
    };//project_id=19&type=all&orderBy=date_created&sort=DESC&start=0&count=10
    
describe('project paper card', () => {

    afterEach(cleanup);

    test('it renders the paper data', () => {

        const {container} = render(
            testWrap(<ProjectPaperCard callOptions={() => undefined} paper={papersRes.results[0]}/>)
        );

        //I expect to find the paper data
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(papersRes.results[0].data.title);
        expect(container.getElementsByClassName("authors")[0].innerHTML).toBe(papersRes.results[0].data.authors);
        expect(container.getElementsByClassName("eid")[0].innerHTML).toBe(papersRes.results[0].data.eid);

    })

})

describe('project description', () => {

    afterEach(cleanup);

    test('it fetches and renders the project info', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/projects/"+ projectRes.id + "/collaborators");

        //will intercept the GET request
        const scope = nockGet("/projects/"+ projectRes.id + "/collaborators", {}, collaboratorsRes);

        const {container} = render(
            testWrap(<ProjectDescription project={projectRes} setProject={() => undefined} collaborators={undefined} setCollaborators={() => undefined}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");
        
        //wait for data to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                /*if(element.getElementsByTagName("p")[0]){
                    console.log(element.getElementsByTagName("p")[0].innerHTML + " - " + projectRes.data.description);
                    console.log(element.getElementsByTagName("p")[0].innerHTML === projectRes.data.description);
                }*/
                return (element.getElementsByClassName("project-date-info").length === 2)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

})

describe('papers list', () => {

    test('it renders the papers list data', () => {

        const {container} = render(
            testWrap(<PrintPapersList papersList={papersRes.results} location={{search: ""}} history={[]}/>)
        );

        //I expect all papers data to be displayed
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(papersRes.results[0].data.title);
        expect(container.getElementsByTagName("h3")[1].innerHTML).toBe(papersRes.results[1].data.title);

    })

    test('it renders empty icon if there are no papers', () => {

        const {container} = render(
            testWrap(<PrintPapersList papersList={[]} location={{search: ""}} history={[]}/>)
        );

        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("no-papers");

    })

})

describe('papers tab', () => {

    test('it fetches paper data and renders the entire paper tab', async () => {
        
        //will intercept the OPTIONS request for the papers
        const optionsScope = nockOptions("/papers", papersPaginationQuery);

        //will intercept the GET request for the papers
        const scope = nockGet("/papers", papersPaginationQuery, papersRes);

        //will intercept the OPTIONS request for the collaborators
        const optionsScope_1 = nockOptions("/projects/"+ projectRes.id + "/collaborators");

        //will intercept the GET request for the collaborators
        const scope_1 = nockGet("/projects/"+ projectRes.id + "/collaborators", {}, collaboratorsRes);

        const {container} = render(
            testWrap(<PapersTab project_id={19} 
                project={projectRes} setProject={() => undefined} 
                collaborators={collaboratorsRes} setCollaborators={() => undefined}
                location={{search: ""}} history={[]} match={{url: ""}}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[1].getAttribute("id")).toBe("loading-icon");

        //wait for filters list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("h3").length === 2 && 
                        element.getElementsByTagName("h3")[0].innerHTML === papersRes.results[0].data.title && 
                        element.getElementsByTagName("h3")[1].innerHTML === papersRes.results[1].data.title);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();

    })

    test('it fetches paper data and renders the entire paper tab', async () => {
        
        //will intercept the OPTIONS request for the papers
        const optionsScope = nockOptions("/papers", papersPaginationQuery);

        //will intercept the GET request for the papers and return error
        const scope = nockGet("/papers", papersPaginationQuery, errorRes, 505);

        //will intercept the OPTIONS request for the collaborators
        const optionsScope_1 = nockOptions("/projects/"+ projectRes.id + "/collaborators");

        //will intercept the GET request for the collaborators
        const scope_1 = nockGet("/projects/"+ projectRes.id + "/collaborators", {}, collaboratorsRes);

        const {container} = render(
            testWrap(<PapersTab project_id={19} 
                project={projectRes} setProject={() => undefined} 
                collaborators={collaboratorsRes} setCollaborators={() => undefined}
                location={{search: ""}} history={[]} match={{url: ""}}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[1].getAttribute("id")).toBe("loading-icon");

        //wait for error page to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("error-wrapper").length === 1);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();

    })
    
})