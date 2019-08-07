import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, nockPost, testWrap, errorRes, notFoundRes} from 'utils/testUtils';

import { PrintScoupusSearchList, PrintSearchAutomatedList } from 'components/modules/printPapersList';
import PaperConfidence from 'components/projects_page/search_tab/search_automated/paperConfidence';
import SearchAutomatedManager from 'components/projects_page/search_tab/search_automated/searchAutomatedManager';

const automatedPapersRes = 
    {
        "results":
        [
            {"authors":"Cornelissen J.","title":"Anti-idiotypic immunization provides protection against lethal endotoxaemia in BALB/c mice",
            "year":"1993","date":"1993-01-01","source_title":"Immunology","link":[],
            "doi":"",
            "abstract":"I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.",
            "document_type":"Article","source":"Scopus","eid":"2-s2.0-0027293787","abstract_structured":"","filter_oa_include":"","filter_study_include":"","notes":"","manual":"0",
            "metadata":{"automatedSearch":{"filters":[{"id":"1","filterValue":0.62},{"id":"2","filterValue":0.63}],"value":"0.625"}}},
            {"authors":"Liu H.","title":"Effect of Sn content on properties of AB2 hydrogen storage alloy",
            "year":"2006","date":"2006-05-01","source_title":"Zhuzao Jishu/Foundry Technology",
            "link":[],"doi":"",
            "abstract":"I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.",
            "document_type":"Article","source":"Scopus","eid":"2-s2.0-33745293968","abstract_structured":"","filter_oa_include":"","filter_study_include":"",
            "notes":"","manual":"0",
            "metadata":{"automatedSearch":{"filters":[{"id":"1","filterValue":0.48},{"id":"2","filterValue":0.42}],"value":"0.44999999999999996"}}}
        ],
    "totalResults": 2
    };

const filtersRes =
    {"results":
        [
            {"id":"1","date_created":"2019-07-30T12:22:48.279Z","date_last_modified":"2019-07-30T12:22:48.279Z","date_deleted":null,
            "data":{"name":"C3","predicate":"p","exclusion_description":"","inclusion_description":""},"project_id":"7"},
            {"id":"2","date_created":"2019-07-30T12:22:45.852Z","date_last_modified":"2019-07-30T12:22:45.852Z","date_deleted":null,
            "data":{"name":"C2","predicate":"a","exclusion_description":"","inclusion_description":""},"project_id":"7"}
        ],
    "totalResults":"2"
    };

const projectData =
    {
        "id":"7","date_created":"2019-08-06T09:15:03.189Z","date_last_modified":"2019-08-06T09:15:46.136Z","date_deleted":null,
        "data":{"name":"project 2","user_id":["2"],"description":"ab2","manual_screening_type":"multi-predicate"}
    };

const filtersPaginationQuery = 
    {
        project_id: 7
    };


const searchAutomatedPostData =
    {
        "project_id": "7",
        "start": 0,
        "count": 10,
        "min_confidence": 0,
        "max_confidence": 1
    };

describe('paper confidence', () => {

    test('should display the confidence of the filters', () => {

        const {container} = render(<PaperConfidence filtersList={filtersRes.results} confidence={automatedPapersRes.results[0].metadata.automatedSearch}/>);

        expect(container.getElementsByClassName("side-detail").length).toBe(2);
        expect(container.getElementsByClassName("side-detail")[0].innerHTML).toBe(automatedPapersRes.results[0].metadata.automatedSearch.filters[0].filterValue.toString());
        expect(container.getElementsByTagName("p")[0].title).toBe(filtersRes.results[0].data.predicate);
        expect(container.getElementsByTagName("span")[0].innerHTML).toBe(filtersRes.results[0].data.name);

    })
    
})


describe('search results lists', () => {

    afterEach(cleanup);

    test('automated search list will show the papers data with their confidence scores and their selection', () => {

        const {container} = render(
            testWrap(<PrintSearchAutomatedList papersList={automatedPapersRes.results} filtersList={filtersRes.results} 
                        handlePaperSelection={() => undefined} selectedEidList={["2-s2.0-33745293968"]}/>)
        );

        //paper data should be displayed
        expect(container.getElementsByTagName("h3").length).toBe(2)
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(automatedPapersRes.results[0].title);
        expect(container.getElementsByTagName("h3")[1].innerHTML).toBe(automatedPapersRes.results[1].title);
        expect(container.getElementsByClassName("authors")[0].innerHTML).toBe(automatedPapersRes.results[0].authors);
        expect(container.getElementsByClassName("eid")[0].innerHTML).toBe(automatedPapersRes.results[0].eid);
        expect(container.getElementsByClassName("side-detail")[0].innerHTML).toBe(automatedPapersRes.results[0].metadata.automatedSearch.filters[0].filterValue.toString())
        expect(container.getElementsByClassName("side-detail")[2].innerHTML).toBe(automatedPapersRes.results[1].metadata.automatedSearch.filters[0].filterValue.toString())

        //second one should be checked
        expect(container.getElementsByTagName("input")[1].checked).toBe(true);

    });
    
})

describe('search automated page', () => {
    
    test('mounts the search automated components, fetches data and displays search results', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/filters", filtersPaginationQuery, filtersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/automated");

        //will intercept the POST
        const scope_1 = nockPost("/search/automated", searchAutomatedPostData, automatedPapersRes);

        const {container} = render(
            testWrap(<SearchAutomatedManager project={projectData} location={{search: ""}} match={{url: ""}} history={[]}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for papers list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("generic-card paper-card").length === 2 &&
                        element.getElementsByClassName("auto-paper-title")[0].innerHTML === automatedPapersRes.results[0].title &&
                        element.getElementsByClassName("auto-paper-title")[1].innerHTML === automatedPapersRes.results[1].title
                );
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();

    })

    test('mounts the search automated components, fetches data and displays filters predicate', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/filters", filtersPaginationQuery, filtersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/automated");

        //will intercept the POST
        const scope_1 = nockPost("/search/automated", searchAutomatedPostData, automatedPapersRes);

        const {container} = render(
            testWrap(<SearchAutomatedManager project={projectData} location={{search: ""}} match={{url: ""}} history={[]}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for papers list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("filter-predicate").length === 2 &&
                        element.getElementsByClassName("filter-predicate")[0].innerHTML === filtersRes.results[0].data.predicate &&
                        element.getElementsByClassName("filter-predicate")[1].innerHTML === filtersRes.results[1].data.predicate
                );
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();
        
    })

    test('it displays the error page if receives error', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/filters", filtersPaginationQuery, filtersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/automated");

        //will intercept the POST
        const scope_1 = nockPost("/search/automated", searchAutomatedPostData, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<SearchAutomatedManager project={projectData} location={{search: ""}} match={{url: ""}} history={[]}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for error page to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("error-wrapper").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();

    })
    

    test('it displays the empty icon if receives 404 error', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/filters", filtersPaginationQuery, filtersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/automated");

        //will intercept the POST
        const scope_1 = nockPost("/search/automated", searchAutomatedPostData, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<SearchAutomatedManager project={projectData} location={{search: ""}} match={{url: ""}} history={[]}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for error page to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("svg") &&
                        element.getElementsByTagName("svg")[0] &&
                        element.getElementsByTagName("svg")[0].getAttribute("id") === "no-results")
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