import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, nockPut, testWrap, errorRes} from 'utils/testUtils';

import FilterCard from 'components/projects_page/filters_tab/filterCard';
import PrintFiltersList from 'components/projects_page/filters_tab/printFiltersList';
import FiltersTab from 'components/projects_page/filters_tab/filtersTab';

const filtersRes =
    {"results":
        [
            {"id":"3","date_created":"2019-07-30T12:22:48.279Z","date_last_modified":"2019-07-30T12:22:48.279Z","date_deleted":null,
            "data":{"name":"C3","predicate":"p","exclusion_description":"","inclusion_description":""},"project_id":"19"},
            {"id":"2","date_created":"2019-07-30T12:22:45.852Z","date_last_modified":"2019-07-30T12:22:45.852Z","date_deleted":null,
            "data":{"name":"C2","predicate":"a","exclusion_description":"","inclusion_description":""},"project_id":"19"},
            {"id":"1","date_created":"2019-07-30T12:22:43.423Z","date_last_modified":"2019-07-30T12:22:43.423Z","date_deleted":null,
            "data":{"name":"C1","predicate":"q","exclusion_description":"","inclusion_description":""},"project_id":"19"}
        ],
    "totalResults":"3"
    };

const filtersPaginationQuery = 
    {
        project_id: 19,
        orderBy: "date_created",
        sort: "DESC",
        start: 0,
        count: 10
    };
    
describe('filter card', () => {

    afterEach(cleanup);

    test('it renders the filter data', () => {

        const {container} = render(<FilterCard project_id={19} filter={filtersRes.results[0]} callDelete={() => undefined}/>);

        //I expect to find the filter data (with 'empty criterion' string, since they're empty in the data)
        expect(container.getElementsByClassName("filter-label")[0].innerHTML).toBe(filtersRes.results[0].data.name);
        expect(container.getElementsByClassName("answer")[0].getElementsByTagName("i")[0].innerHTML).toBe("empty criterion");
        expect(container.getElementsByClassName("answer")[1].getElementsByTagName("i")[0].innerHTML).toBe("empty criterion");

    })

    test('it renders the filter update form once I press the update button', () => {

        let yup = require('yup');

        const {container} = render(
            testWrap(<FilterCard project_id={19} filter={filtersRes.results[0]} callDelete={() => undefined} yup={yup}/>)
        );

        //I expect the filter data to be displayed at first
        expect(container.getElementsByClassName("filter-label")[0].innerHTML).toBe(filtersRes.results[0].data.name);
        
        fireEvent.mouseDown(container.getElementsByClassName("option")[1]);

        //I expect the update form to be displayed
        expect(container.getElementsByClassName("update-filter-card")[0]).toBeDefined();
        expect(container.getElementsByTagName("input")[0].value).toBe(filtersRes.results[0].data.predicate);

    })

    test('it renders the updated filter data once I submit the form', async () => {

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters/" + filtersRes.results[0].id);

        //will intercept the PUT request
        const scope = nockPut("/filters/" + filtersRes.results[0].id,
        {"project_id": parseInt(filtersRes.results[0].project_id),"predicate": "newPredicate","inclusion_description": "","exclusion_description": ""});

        let yup = require('yup'); //this is used by the FilterCard component

        const {container} = render(
            testWrap(<FilterCard project_id={19} filter={filtersRes.results[0]} callDelete={() => undefined} yup={yup}/>)
        );

        //I expect the filter data to be displayed at first
        expect(container.getElementsByClassName("filter-label")[0].innerHTML).toBe(filtersRes.results[0].data.name);
        
        //I press the update button (the second one with class=option)
        fireEvent.mouseDown(container.getElementsByClassName("option")[1]);

        //I expect the update form to be displayed
        expect(container.getElementsByClassName("update-filter-card")[0]).toBeDefined();
        expect(container.getElementsByTagName("input")[0].value).toBe(filtersRes.results[0].data.predicate);

        //I change input value
        fireEvent.change(container.getElementsByTagName("input")[0], {target: {value: "newPredicate"}})

        //I expect to be changed
        expect(container.getElementsByTagName("input")[0].value).toBe("newPredicate");

        //I click on button to submit (the second button on the page)
        fireEvent.click(container.getElementsByTagName("button")[1]);
        
        //wait for updated filter to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByTagName("h3") && 
                        element.getElementsByTagName("h3")[0] && 
                        element.getElementsByTagName("h3")[0].innerHTML.indexOf("newPredicate") !== -1);
            }),
            { container }
        )
        
        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

})

describe('filters list', () => {

    test('it renders the filters list', () => {

        const {container} = render(<PrintFiltersList project_id={19} filtersList={filtersRes.results} setFiltersList={() => undefined}/>);

        //I expect all filter to be displayed
        expect(container.getElementsByClassName("filter-label")[0].innerHTML).toBe(filtersRes.results[0].data.name);
        expect(container.getElementsByClassName("filter-label")[1].innerHTML).toBe(filtersRes.results[1].data.name);
        expect(container.getElementsByClassName("filter-label")[2].innerHTML).toBe(filtersRes.results[2].data.name);

    })

    test('it renders empty icon if there are no papers', () => {

        const {container} = render(<PrintFiltersList project_id={19} filtersList={[]} setFiltersList={() => undefined}/>);

        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("no-filters");

    })

})

describe('filter tab', () => {

    test('it fetches and render the list of filters and the \'add filter\' form', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request
        const scope = nockGet("/filters", filtersPaginationQuery, filtersRes);

        const {container} = render(
            testWrap(<FiltersTab project_id={19} location={{search: ""}} match={{url: ""}}/>)
        );

        //expect to find loading icon at first
        expect(container.getElementsByTagName("svg")[0].getAttribute("id")).toBe("loading-icon");

        //wait for filters list to appear
        await waitForElement(
            () => getAllByText(container, (content, element) => {
                return (element.getElementsByClassName("filter-label").length === 3 && 
                        element.getElementsByClassName("filter-label")[0].innerHTML === filtersRes.results[0].data.name && 
                        element.getElementsByClassName("filter-label")[1].innerHTML === filtersRes.results[1].data.name && 
                        element.getElementsByClassName("filter-label")[2].innerHTML === filtersRes.results[2].data.name)
            }),
            { container }
        )

        //expect to find insertion form too
        expect(container.getElementsByClassName("add-filter").length).toBe(1);

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();

    })

    test('it renders the error page if it receives error', async () => {
        
        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/filters", filtersPaginationQuery);

        //will intercept the GET request and will respond with error
        const scope = nockGet("/filters", filtersPaginationQuery, errorRes, 505);

        const {container} = render(
            testWrap(<FiltersTab project_id={19} location={{search: ""}} match={{url: ""}}/>)
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
