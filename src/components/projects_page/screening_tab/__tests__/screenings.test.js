import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, errorRes, notFoundRes, testWrap} from 'utils/testUtils';

import { PrintScreenedPapersList, PrintManuallyScreenedPapersList, PrintBacklogPapersList } from 'components/modules/printPapersList';

import ManualResults from 'components/projects_page/screening_tab/manual_subtab/manualResults';
import ScreenedPapers from 'components/projects_page/screening_tab/screened_subtab/screenedPapers';
import ManualScreeningForm from '../backlog_subtab/forms/manualScreeningForm';

const backlogPapersRes =
    {"results":
        [
            {"id":"5","date_created":"2019-08-06T09:15:39.143Z","date_last_modified":"2019-08-11T09:44:50.356Z","date_deleted":null,
            "data":{"doi":"","eid":"2-s2.0-85042285324","date":"","link":"","year":"2018","notes":"","title":"The role of social support networks in proxy Internet use from the intergenerational solidarity perspective",
                "manual":"","source":"","authors":"Dolničar V., Grošelj D., Filipovič Hrast M., Vehovar V., Petrovčič A.",
                "abstract":"Digital inequalities research has documented a set of practices related to people's Internet use that questions the binary division between Internet users and non-users.",
                "metadata":{"automatedScreening":{"value":0.44999999999999996,"filters":[{"id":"1","filterValue":0.18},{"id":"2","filterValue":0.72}]}},
                "source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
            "project_id":"7"},
            {"id":"8","date_created":"2019-08-06T09:15:39.143Z","date_last_modified":"2019-08-11T09:44:50.361Z","date_deleted":null,
            "data":{"doi":"","eid":"2-s2.0-85040066051","date":"","link":"","year":"2018","notes":"","title":"What drives live-stream usage intention? The perspectives of flow, entertainment, social interaction, and endorsement",
                "manual":"","source":"","authors":"Chen C.-C., Lin Y.-C.",
                "abstract":"Live-stream is the real-time audio and video transmission of an event over the Internet",
                "metadata":{"automatedScreening":{"value":0.11499999999999999,"filters":[{"id":"1","filterValue":0.11},{"id":"2","filterValue":0.12}]}},
                "source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
            "project_id":"7"}
        ],
        "totalResults":"2"
    };

const filtersRes =
    {"results":
        [
            {"id":"3","date_created":"2019-07-30T12:22:48.279Z","date_last_modified":"2019-07-30T12:22:48.279Z","date_deleted":null,
            "data":{"name":"C3","predicate":"p","exclusion_description":"","inclusion_description":""},"project_id":"7"},
            {"id":"2","date_created":"2019-07-30T12:22:45.852Z","date_last_modified":"2019-07-30T12:22:45.852Z","date_deleted":null,
            "data":{"name":"C2","predicate":"a","exclusion_description":"","inclusion_description":""},"project_id":"7"},
            {"id":"1","date_created":"2019-07-30T12:22:43.423Z","date_last_modified":"2019-07-30T12:22:43.423Z","date_deleted":null,
            "data":{"name":"C1","predicate":"q","exclusion_description":"","inclusion_description":""},"project_id":"7"}
        ],
    "totalResults":"3"
    };

const screenedPapersRes = 
    {
    "results":
        [
            {
                "id":"7","date_created":"2019-08-06T09:15:39.143Z","date_last_modified":"2019-08-06T13:53:48.378Z","date_deleted":null,
                "data":{"doi":"","eid":"2-s2.0-85044209383","date":"","link":"","year":"2018","notes":"",
                        "title":"Older adults experiences of online social interactions: A phenomenological study",
                        "manual":"","source":"","authors":"Momeni M., Hariri N., Nobahar M., Noshinfard F.",
                        "abstract":"Introduction: Online social networks allow users, who are anywhere in the world.",
                        "metadata":{"votes":[{"user":{"name":"gino nio","picture":"https://photo.jpg"},"answer":"1"}],
                        "screened":"screened","screening":{"result":"1","source":"manual screening"}},
                "source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
                "project_id":"7"
            },
            {
                "id":"6","date_created":"2019-08-06T09:15:39.143Z","date_last_modified":"2019-08-06T13:35:22.963Z","date_deleted":null,
                "data":{"doi":"","eid":"2-s2.0-85016119005","date":"","link":"","year":"2018","notes":"",
                        "title":"IT-based wellness tools for older adults: Design concepts and feedback",
                        "manual":"","source":"","authors":"Joe J., Hall A., Chi N.-C., Thompson H., Demiris G.",
                        "abstract":"Objective: To explore older adults’ preferences regarding e-health applications through use of generated concepts",
                        "metadata":{"votes":[{"user":{"name":"gino nio","picture":"https://photo.jpg"},"answer":"1"}],
                        "screened":"screened","screening":{"result":"1","source":"manual screening"}},
                "source_title":"","document_type":"","filter_oa_include":"","abstract_structured":"","filter_study_include":""},
            "project_id":"7"}
        ],
    "totalResults":"2",
    "totalPapers":"4"}

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

const screenedPapersPaginationQuery = 
    {"project_id":"7","type":"screened","orderBy":"date_created","sort":"DESC","start":"0","count":"10"};

const manualPapersPaginationQuery = 
    {"project_id":"7","type":"manual","orderBy":"date_created","sort":"DESC","start":"0","count":"10"};

const backlogPapersPaginationQuery = 
    {"project_id":"7","type":"backlog","orderBy":"date_created","min_confidence" : 0, "max_confidence" : 1,"sort":"DESC","start":"0","count":"10"};

    const filtersPaginationQuery = 
    {"project_id": "7"};

describe('screened papers list', () => {

    afterEach(cleanup);

    test('it renders the screened papers data', () => {

        const {container} = render(
            testWrap(<PrintScreenedPapersList papersList={screenedPapersRes.results}/>)
        );

        //I expect to find the paper data
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(screenedPapersRes.results[0].data.title);
        expect(container.getElementsByClassName("authors")[0].innerHTML).toBe(screenedPapersRes.results[0].data.authors);
        expect(container.getElementsByClassName("eid")[0].innerHTML).toBe(screenedPapersRes.results[0].data.eid);
        expect(container.getElementsByTagName("h3")[1].innerHTML).toBe(screenedPapersRes.results[1].data.title);

    })

    test('it fetches screened papers data and renders the entire sub-tab', async () => {
        
        let foundLoadingIcon = false;

        //will intercept the OPTIONS request for the papers
        const optionsScope = nockOptions("/papers", screenedPapersPaginationQuery);

        //will intercept the GET request for the papers
        const scope = nockGet("/papers", screenedPapersPaginationQuery, screenedPapersRes);

        const {container} = render(
            testWrap(<ScreenedPapers project_id={7}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);

        //wait for filters list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                if(element.getElementsByClassName("partial").length === 1 && element.getElementsByClassName("partial")[0].innerHTML){
                    console.log(element.getElementsByClassName("partial")[0].innerHTML)
                }
                return (element.getElementsByTagName("h3").length === 2 && 
                        element.getElementsByClassName("partial").length === 1 && element.getElementsByClassName("partial")[0].innerHTML &&
                        element.getElementsByClassName("total").length === 1 && element.getElementsByClassName("total")[0].innerHTML &&
                        element.getElementsByTagName("h3")[0].innerHTML === screenedPapersRes.results[0].data.title && 
                        element.getElementsByTagName("h3")[1].innerHTML === screenedPapersRes.results[1].data.title &&
                        element.getElementsByClassName("total")[0].innerHTML === screenedPapersRes.totalPapers);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

    test('it will show empty results icon if it gets 404', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/papers", screenedPapersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/papers", screenedPapersPaginationQuery, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<ScreenedPapers project_id={7}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);
        
        //wait for 404 message to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("empty-list-wrapper").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })

    test('it will display error page if it receives errors', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/papers", screenedPapersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/papers", screenedPapersPaginationQuery, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<ScreenedPapers project_id={7}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);
        
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

describe('manual papers list', () => {

    afterEach(cleanup);

    test('it renders the manual papers data', () => {

        const {container} = render(
            testWrap(<PrintManuallyScreenedPapersList papersList={screenedPapersRes.results}/>)
        );

        //I expect to find the paper data
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(screenedPapersRes.results[0].data.title);
        expect(container.getElementsByClassName("authors")[0].innerHTML).toBe(screenedPapersRes.results[0].data.authors);
        expect(container.getElementsByClassName("eid")[0].innerHTML).toBe(screenedPapersRes.results[0].data.eid);
        expect(container.getElementsByTagName("h3")[1].innerHTML).toBe(screenedPapersRes.results[1].data.title);
        //and the user votes
        expect(container.getElementsByClassName("user-vote-image in-vote").length).toBe(2);
        expect(container.getElementsByClassName("user-vote-image in-vote")[0].getAttribute("title").indexOf(screenedPapersRes.results[0].data.metadata.votes[0].user.name)).not.toBe(-1);
        

    })

    test('it fetches manual papers data and renders the entire sub-tab', async () => {
        
        let foundLoadingIcon = false;

        //will intercept the OPTIONS request for the papers
        const optionsScope = nockOptions("/papers", manualPapersPaginationQuery);

        //will intercept the GET request for the papers
        const scope = nockGet("/papers", manualPapersPaginationQuery, screenedPapersRes);

        const {container} = render(
            testWrap(<ManualResults project_id={7}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);

        //wait for filters list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("h3").length === 2 && 
                        element.getElementsByTagName("h3")[0].innerHTML === screenedPapersRes.results[0].data.title &&
                        element.getElementsByClassName("user-vote-image in-vote").length == 2 &&
                        element.getElementsByClassName("user-vote-image in-vote")[0].getAttribute("title").indexOf(screenedPapersRes.results[0].data.metadata.votes[0].user.name) !== -1 &&
                        element.getElementsByTagName("h3")[1].innerHTML === screenedPapersRes.results[1].data.title);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

    test('it will show empty results icon if it gets 404', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/papers", manualPapersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/papers", manualPapersPaginationQuery, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<ManualResults project_id={7}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);
        
        //wait for 404 message to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("empty-list-wrapper").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })

    test('it will display error page if it receives errors', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/papers", manualPapersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/papers", manualPapersPaginationQuery, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<ManualResults project_id={7}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);
        
        //wait for 404 message to appear
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

describe('backlog papers list', () => {

    afterEach(cleanup);

    test('it renders the backlog papers data', () => {

        const {container} = render(
            testWrap(<PrintBacklogPapersList papersList={backlogPapersRes.results} filtersList={filtersRes.results}/>)
        );

        //I expect to find the paper data
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(backlogPapersRes.results[0].data.title);
        expect(container.getElementsByClassName("authors")[0].innerHTML).toBe(backlogPapersRes.results[0].data.authors);
        expect(container.getElementsByClassName("eid")[0].innerHTML).toBe(backlogPapersRes.results[0].data.eid);
        //with their confidence
        expect(container.getElementsByClassName("side-detail").length).toBe(4);
        expect(container.getElementsByClassName("side-detail")[0].innerHTML).toBe(backlogPapersRes.results[0].data.metadata.automatedScreening.filters[0].filterValue.toString());
        expect(container.getElementsByTagName("p")[0].title).toBe(filtersRes.results[2].data.predicate);
        expect(container.getElementsByTagName("span")[0].innerHTML).toBe(filtersRes.results[2].data.name);

        expect(container.getElementsByTagName("h3")[1].innerHTML).toBe(backlogPapersRes.results[1].data.title);

    })

})

describe('manual screening form', () => {

    test('displays users and form', async () => {
        //will intercept the OPTIONS request
        const optionsScope_1 = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request
        const scope_1 = nockGet("/filters", filtersPaginationQuery, filtersRes);

        //will intercept the OPTIONS request
        const optionsScope_2 = nockOptions("/projects/"+ 7 + "/collaborators");

        //will intercept the GET request
        const scope_2 = nockGet("/projects/"+ 7 + "/collaborators", {}, collaboratorsRes);

        const {container} = render(
            testWrap(<ManualScreeningForm visibility={true} setManualStarted={() => undefined} setVisibility={() => undefined} project_id={7}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[1].getAttribute("id")).toBe("loading-icon");

        //wait for users list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("p").length > 0 &&
                        element.getElementsByClassName("user-data-image-wrapper").length === 2);
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope_1.done();
        scope_1.done();
        optionsScope_2.done();
        scope_2.done();

    })

});
