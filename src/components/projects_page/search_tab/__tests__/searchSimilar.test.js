import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, nockPost, testWrap, errorRes, notFoundRes} from 'utils/testUtils';

import TargetPaper from 'components/projects_page/search_tab/search_similar/targetPaper';
import SearchSimilarManager from 'components/projects_page/search_tab/search_similar/searchSimilarManager';

const papersRes = 
    {
    "results":
        [
            {
                "authors":"Kevin Corder J.","title":"Disappointed hopes?: Female voters and the 1924 progressive surge",
                "year":"2018","date":"2018-02-15","source_title":"100 Years of the Nineteenth Amendment: An Appraisal of Women's Political Activism",
                "link":[],
                "doi":"10.1093/oso/9780190265144.003.0002",
                "abstract":"I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.",
                "document_type":"Chapter","source":"Scopus","eid":"2-s2.0-85050251763",
                "abstract_structured":"","filter_oa_include":"","filter_study_include":"","notes":"","manual":"0"
            },
            {
                "authors":"Kulkarni M.","title":"Integration of geometric sensitivity and spatial gradient reconstruction for aeroelastic shape optimization",
                "year":"2014","date":"2014-02-28","source_title":"10th AIAA Multidisciplinary Design Optimization Specialist Conference",
                "link":[],"doi":"","abstract":"I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.",
                "document_type":"Conference Paper","source":"Scopus","eid":"2-s2.0-84894451199","abstract_structured":"",
                "filter_oa_include":"","filter_study_include":"","notes":"","manual":"0"
            }

        ],
    "totalResults": 2
    };


const searchSimilarPostData =
    {
        "paperData": 
            {
                "authors":"Kevin Corder J.","title":"Disappointed hopes?: Female voters and the 1924 progressive surge",
                "year":"2018","date":"2018-02-15","source_title":"100 Years of the Nineteenth Amendment: An Appraisal of Women's Political Activism",
                "link":[],
                "doi":"10.1093/oso/9780190265144.003.0002",
                "abstract":"I am a no-subscriber, so I can't get the abstract from scopus. I am a no-subscriber, so I can't get the abstract from scopus.",
                "document_type":"Chapter","source":"Scopus","eid":"2-s2.0-85050251763",
                "abstract_structured":"","filter_oa_include":"","filter_study_include":"","notes":"","manual":"0"
            },
        "start": "0",
        "count": "10",
        "scopus": true
    };

describe('similar target paper', () => {
    
    test('it should render the paper data', () => {
        const {container} = render(<TargetPaper style={{boxShadow: "0px 0px 3px -1px rgba(0, 0, 0, 0.25)"}}
                                                project_id={7}
                                                close={() => undefined} handler={() => undefined} 
                                                input={"test"} paperInfo={papersRes.results[0]}
                                                fetching={false} setPaperInfo={() => undefined}
                                                setPaperFile={() => undefined}
                                                history={[]}/>);
                                        
        expect(container.getElementsByClassName("similar-paper-title")[0].innerHTML).toBe(papersRes.results[0].title);
    })

})

describe('similar paper manager', () => {

    afterEach(cleanup);
    
    test('it should render the target paper data based on the query', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", {query: "man", scopus: true});

        //will intercept the GET request
        const scope = nockGet("/search", {query: "man", scopus: true}, papersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/similar");

        //will intercept the POST
        const scope_1 = nockPost("/search/similar", searchSimilarPostData, papersRes);

        const {container} = render(
            testWrap(<SearchSimilarManager project_id={7} 
                                location={{search: "query=man&orderBy=title&sort=ASC&start=0&count=10"}} 
                                match={{url: ""}} history={[]}/>)
        );
        
        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        expect(foundLoadingIcon).toBe(true);

        //wait for target paper data to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("similar-paper-title").length === 1 &&
                        element.getElementsByClassName("similar-paper-title")[0].innerHTML === papersRes.results[0].title
                );
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

    test('it should render the results after it gets the paper data', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", {query: "man", scopus: true});

        //will intercept the GET request
        const scope = nockGet("/search", {query: "man", scopus: true}, papersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/similar");

        //will intercept the POST
        const scope_1 = nockPost("/search/similar", searchSimilarPostData, papersRes);

        const {container} = render(
            testWrap(<SearchSimilarManager project_id={7} 
                                location={{search: "query=man&orderBy=title&sort=ASC&start=0&count=10"}} 
                                match={{url: ""}} history={[]}/>)
        );
        
        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        expect(foundLoadingIcon).toBe(true);

        //wait for target paper data to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("similar-paper-title").length === 1 &&
                        element.getElementsByClassName("similar-paper-title")[0].innerHTML === papersRes.results[0].title
                );
            }),
            { container }
        )


        //wait for results to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("generic-card paper-card").length === 2 &&
                        element.getElementsByClassName("generic-card paper-card")[0].getElementsByTagName("h3")[0].innerHTML === papersRes.results[0].title &&
                        element.getElementsByClassName("generic-card paper-card")[1].getElementsByTagName("h3")[0].innerHTML === papersRes.results[1].title
                );
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope_1.done();
        scope_1.done();

    })

    test('it should render the error page if it receives error', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", {query: "man", scopus: true});

        //will intercept the GET request
        const scope = nockGet("/search", {query: "man", scopus: true}, papersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/similar");

        //will intercept the POST
        const scope_1 = nockPost("/search/similar", searchSimilarPostData, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<SearchSimilarManager project_id={7} 
                                location={{search: "query=man&orderBy=title&sort=ASC&start=0&count=10"}} 
                                match={{url: ""}} history={[]}/>)
        );
        
        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        expect(foundLoadingIcon).toBe(true);

        //wait for target paper data to appear at first
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("similar-paper-title").length === 1 &&
                        element.getElementsByClassName("similar-paper-title")[0].innerHTML === papersRes.results[0].title
                );
            }),
            { container }
        )

        //wait for error page to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("error-wrapper").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope_1.done();
        scope_1.done();

    })

    test('it should render the error page if it receives error', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", {query: "man", scopus: true});

        //will intercept the GET request
        const scope = nockGet("/search", {query: "man", scopus: true}, papersRes);

        //will intercept the OPTIONS request for the search
        const optionsScope_1 = nockOptions("/search/similar");

        //will intercept the POST
        const scope_1 = nockPost("/search/similar", searchSimilarPostData, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<SearchSimilarManager project_id={7} 
                                location={{search: "query=man&orderBy=title&sort=ASC&start=0&count=10"}} 
                                match={{url: ""}} history={[]}/>)
        );
        
        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        expect(foundLoadingIcon).toBe(true);

        //wait for target paper data to appear at first
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("similar-paper-title").length === 1 &&
                        element.getElementsByClassName("similar-paper-title")[0].innerHTML === papersRes.results[0].title
                );
            }),
            { container }
        )

        //wait for error page to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("no-results").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope_1.done();
        scope_1.done();

    })

})