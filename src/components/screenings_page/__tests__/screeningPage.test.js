import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, nockPost, testWrap, errorRes, notFoundRes} from 'utils/testUtils';

import ScreeningsList from 'components/screenings_page/screeningsList';
import SinglePredicateScreening from 'components/screenings_page/singlePredicate';
import MultiPredicateScreening from 'components/screenings_page/multiPredicate';

const screeningsPaginationQuery =
    {
        "orderBy":"date_last_modified",
        "start":"0",
        "count":"10"
    };

const screeningsRes = 
    {
        "results":
        [
            {
                "id":"2","date_created":"2019-08-06T09:15:46.132Z","date_last_modified":"2019-08-06T09:15:46.132Z","date_deleted":null,
                "project_id":"7","data":{"tags":[],"manual_screening_type":"multi-predicate"},"progress": {},
                "project_data":{"name":"project 2","user_id":["2"],"description":"ab2","manual_screening_type":"multi-predicate"}
            },
            {
                "id":"1","date_created":"2019-08-06T09:14:49.842Z","date_last_modified":"2019-08-06T09:14:49.842Z","date_deleted":null,
                "project_id":"6","data":{"tags":[],"manual_screening_type":"single-predicate"},"progress": {},
                "project_data":{"name":"project 1","user_id":["2"],"description":"ab1","manual_screening_type":"single-predicate"}
            }
        ],
        "totalResults":2
    }

const nextPaperRes = 
    {
        "id":"2","date_created":"2019-08-06T09:14:39.916Z","date_last_modified":"2019-08-06T09:14:39.916Z","date_deleted":null,
        "data":{"doi":"","eid":"2-s2.0-85016119005","date":"","link":"","year":"2018","notes":"",
                "title":"IT-based wellness tools for older adults: Design concepts and feedback","manual":"","source":"",
                "authors":"Joe J., Hall A., Chi N.-C., Thompson H., Demiris G.",
                "abstract":"Objective: To explore older adults’ preferences regarding e-health applications through use of generated concepts that inform wellness tool design. Methods: The 6-8-5 method and affinity mapping were used to create e-health design ideas that were translated into storyboards and scenarios. Focus groups were conducted to obtain feedback on the prototypes and included participant sketching. A qualitative analysis of the focus groups for emerging themes was conducted, and sketches were analyzed. Results: Forty-three older adults participated in six focus group sessions. The majority of participants found the wellness tools useful. Preferences included features that supported participants in areas of unmet needs, such as ability to find reliable health information, cognitive training, or maintaining social ties. Participants favored features such as use of voice navigation, but were concerned over cost and the need for technology skills and access. Sketches reinforced these wants, including portability, convenience, and simplicity. Conclusions: Several factors were found to increase the desirability of such devices including convenient access to their health and health information, a simple, accessible interface, and support for memory issues. Researchers and designers should incorporate the feedback of older adults regarding wellness tools, so that future designs meet the needs of older adults.",
                "source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
        "project_id":"6"
    }

const screeningData = 
    {
        "id":"1","date_created":"2019-08-06T09:14:49.842Z","date_last_modified":"2019-08-06T09:14:49.842Z","date_deleted":null,
        "data":{"tags":[],"manual_screening_type":"single-predicate","name":"project 1"}, "progress": {},
        "user_id":"2","project_id":"6"
    }

const votePostDataSinglePredicate = 
    {
        project_paper_id: '2',
        vote:
            { 
                metadata: { type: 'single-predicate', highlights: [
                    {highlightedData: [{
                        data:"Objective: To explore older adults’ preferences regarding e-health applications through use of generated concepts that inform wellness tool design. Methods: The 6-8-5 method and affinity mapping were used to create e-health design ideas that were translated into storyboards and scenarios. Focus groups were conducted to obtain feedback on the prototypes and included participant sketching. A qualitative analysis of the focus groups for emerging themes was conducted, and sketches were analyzed. Results: Forty-three older adults participated in six focus group sessions. The majority of participants found the wellness tools useful. Preferences included features that supported participants in areas of unmet needs, such as ability to find reliable health information, cognitive training, or maintaining social ties. Participants favored features such as use of voice navigation, but were concerned over cost and the need for technology skills and access. Sketches reinforced these wants, including portability, convenience, and simplicity. Conclusions: Several factors were found to increase the desirability of such devices including convenient access to their health and health information, a simple, accessible interface, and support for memory issues. Researchers and designers should incorporate the feedback of older adults regarding wellness tools, so that future designs meet the needs of older adults.",
                        start: 0,
                        end: 1412,
                        type: "not_highlighted"
                    }], outcome: '1'}
                ], tags: [] } 
            }
    }

const votePostDataMultiPredicate = 
    {
        "project_paper_id": "2",
        "vote": {
            "metadata":{
                "type":"multi-predicate",
                "highlights":[
                    {"filter_id":"1","filter_predicate":"filter1","outcome":"1","filterHighlights":[]},
                    {"filter_id":"2","filter_predicate":"filter2","outcome":"0","filterHighlights":[]}],
                "tags":[],
            }
        }
    }

const votePostResponse = 
    {
        data: true,
    }

const filtersList = 
    [
        {
            "id":"1","date_created":"2019-08-06T09:15:09.196Z","date_last_modified":"2019-08-06T09:15:09.196Z","date_deleted":null,
            "data":{"name":"C1","predicate":"filter1","exclusion_description":"","inclusion_description":""},
            "project_id":"7"},
        {
            "id":"2","date_created":"2019-08-06T09:15:16.639Z","date_last_modified":"2019-08-06T09:15:16.639Z","date_deleted":null,
            "data":{"name":"C2","predicate":"filter2","exclusion_description":"","inclusion_description":""},
            "project_id":"7"}
    ]

describe('screenings list', () => {

    test('it fetches and renders the screenings list', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings", screeningsPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/screenings", screeningsPaginationQuery, screeningsRes);

        const {container} = render(
            testWrap(<ScreeningsList location={{search: ""}} match={{url: ""}}/>)
        );

       //expect to find loading icon at first
       expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for filters list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("h3").length === 2 && 
                        element.getElementsByTagName("h3")[0].innerHTML === screeningsRes.results[0].project_data.name && 
                        element.getElementsByTagName("h3")[1].innerHTML === screeningsRes.results[1].project_data.name);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
    })

    test('it renders empty list if response is 404', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings", screeningsPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/screenings", screeningsPaginationQuery, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<ScreeningsList location={{search: ""}} match={{url: ""}}/>)
        );  

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for empty icon to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (container.getElementsByTagName("svg")[0].getAttribute("id") === "empty-folder");
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
    })

    test('it renders error page if response is other error', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings", screeningsPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/screenings", screeningsPaginationQuery, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<ScreeningsList location={{search: ""}} match={{url: ""}}/>)
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
    })


})

describe('single predicate screening page', () => {
    
    test('it should render the received paper data and the screening form', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, nextPaperRes);

        const {container} = render(<SinglePredicateScreening screening={screeningData} filtersList={[]}/>)

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for paper data & form to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === nextPaperRes.data.title &&
                        element.getElementsByClassName("not_highlighted")[0].innerHTML === nextPaperRes.data.abstract && 
                        element.getElementsByClassName("light-modal screening-outcome").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

    test('it should tell the user there are no papers to screen when it gets 404 answer', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<SinglePredicateScreening screening={screeningData} filtersList={[]}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for 'Finished!' screen and no form displayed
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === "Finished!" &&
                        element.getElementsByClassName("light-modal screening-outcome").length === 0)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })

    test('it renders the error page if it receives error', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<SinglePredicateScreening screening={screeningData} filtersList={[]}/>)
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
        
    })
    
    test('it fetches a new paper once the user casts a vote', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, nextPaperRes);

        //will intercept the OPTIONS request for the vote
        const optionsScope_1 = nockOptions("/votes");

        //will intercept the POST vote
        const scope_1 = nockPost("/votes", votePostDataSinglePredicate, votePostResponse);

        //will intercept the OPTIONS request for a new paper again
        const optionsScope_2 = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request for a new paper again
        const scope_2 = nockGet("/screenings/"+ screeningData.id + "/next", {}, nextPaperRes);

        const {container} = render(
            testWrap(<SinglePredicateScreening screening={screeningData} filtersList={[]}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for paper data & form to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === nextPaperRes.data.title &&
                        element.getElementsByClassName("not_highlighted")[0].innerHTML === nextPaperRes.data.abstract && 
                        element.getElementsByClassName("light-modal screening-outcome").length === 1)
            }),
            { container }
        )

        //I press the button
        fireEvent.click(container.getElementsByClassName("yes")[0]);
        
        //I expect the color to change (so to be defined)
        expect(container.getElementsByClassName("yes")[0].style.backgroundColor).toBeDefined();

        //I expect to fetch a new paper
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("svg").length === 1 && 
                        element.getElementsByTagName("svg")[0].getAttribute("id") === "loading-icon")
            }),
            { container }
        )

        //and then wait for paper data & form to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === nextPaperRes.data.title &&
                        element.getElementsByClassName("not_highlighted")[0].innerHTML === nextPaperRes.data.abstract && 
                        element.getElementsByClassName("light-modal screening-outcome").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();
        optionsScope_2.done();
        scope_2.done();

    })
    
})

describe('multi predicate screening page', () => {

    test('it should render the received paper data and the screening form', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, nextPaperRes);

        const {container} = render(<MultiPredicateScreening screening={screeningData} filtersList={filtersList}/>)

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for paper data & form to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === nextPaperRes.data.title &&
                        element.getElementsByClassName("not_highlighted")[0].innerHTML === nextPaperRes.data.abstract && 
                        element.getElementsByClassName("screening-choice multi-predicate").length === 1 &&
                        element.getElementsByClassName("filter-title")[0].innerHTML === filtersList[0].data.predicate)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

    test('it should tell the user there are no papers to screen when it gets 404 answer', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<MultiPredicateScreening screening={screeningData} filtersList={filtersList}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for 'Finished!' screen and no form displayed
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === "Finished!" &&
                        element.getElementsByClassName("screening-choice multi-predicate").length === 0)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })

    test('it renders the error page if it receives error', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<MultiPredicateScreening screening={screeningData} filtersList={filtersList}/>)
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
        
    })

    test('it fetches a new paper once the user casts a vote', async () => {
        
        jest.setTimeout(10000);

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request
        const scope = nockGet("/screenings/"+ screeningData.id + "/next", {}, nextPaperRes);

        //will intercept the OPTIONS request for the vote
        const optionsScope_1 = nockOptions("/votes");

        //will intercept the POST vote
        const scope_1 = nockPost("/votes", votePostDataMultiPredicate, votePostResponse);

        //will intercept the OPTIONS request for a new paper again
        const optionsScope_2 = nockOptions("/screenings/"+ screeningData.id + "/next");

        //will intercept the GET request for a new paper again
        const scope_2 = nockGet("/screenings/"+ screeningData.id + "/next", {}, nextPaperRes);

        const {container} = render(
            testWrap(<MultiPredicateScreening screening={screeningData} filtersList={filtersList}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for paper data & form to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === nextPaperRes.data.title &&
                        element.getElementsByClassName("not_highlighted")[0].innerHTML === nextPaperRes.data.abstract && 
                        element.getElementsByClassName("screening-choice multi-predicate").length === 1 &&
                        element.getElementsByClassName("filter-title")[0].innerHTML === filtersList[0].data.predicate)
            }),
            { container }
        )

        //I press the button
        fireEvent.click(container.getElementsByClassName("yes")[0]);
        
        //wait for next filter data to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("filter-title").length === 1 && 
                        element.getElementsByClassName("filter-title")[0].innerHTML === filtersList[1].data.predicate)
            }),
            { container }
        )

        //I press the button
        fireEvent.click(container.getElementsByClassName("no")[0]);

        //wait for the summary table to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("m-p-screening-summary").length === 1 && 
                        element.getElementsByClassName("filter-vote-summary").length === 2 &&
                        element.getElementsByClassName("filter-vote-summary")[0].getElementsByTagName("p")[0].innerHTML === filtersList[0].data.predicate &&
                        element.getElementsByClassName("filter-vote-summary")[1].getElementsByTagName("p")[0].innerHTML === filtersList[1].data.predicate)
            }),
            { container }
        )

        
        //I press the button
        fireEvent.click(container.getElementsByClassName("outcomes-submission")[0]);

        //I expect to fetch a new paper
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("svg").length === 1 && 
                        element.getElementsByTagName("svg")[0].getAttribute("id") === "loading-icon")
            }),
            { container }
        )
        
        //and then wait for paper data & form to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("paper-title").length === 1 && 
                        element.getElementsByClassName("paper-title")[0].innerHTML === nextPaperRes.data.title &&
                        element.getElementsByClassName("not_highlighted")[0].innerHTML === nextPaperRes.data.abstract && 
                        element.getElementsByClassName("screening-choice multi-predicate").length === 1 &&
                        element.getElementsByClassName("filter-title")[0].innerHTML === filtersList[0].data.predicate)
            }),
            { container }
        )
        
        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        optionsScope_1.done();
        scope_1.done();
        optionsScope_2.done();
        scope_2.done();

    })
})