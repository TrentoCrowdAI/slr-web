import React from 'react';
import { render, fireEvent, cleanup, waitForElement, getAllByText } from '@testing-library/react';

import {nockOptions, nockGet, nockPost, testWrap, errorRes, notFoundRes} from 'utils/testUtils';

import SelectedPapersListBox from 'components/projects_page/search_tab/selectedPapersListBox';
import { PrintScoupusSearchList, PrintSearchAutomatedList } from 'components/modules/printPapersList';
import SearchStandardForm from 'components/projects_page/search_tab/search_standard/searchStandardForm';
import SearchStandardManager from 'components/projects_page/search_tab/search_standard/searchStandardManager';

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

const selectedPaperData = 
    [
        {
            "eid":"2-s2.0-85016119005",
            "title":"IT-based wellness tools for older adults"
        },
        {
            "eid":"2-s2.0-85040066051",
            "title":"What drives live-stream usage intention?"
        }
    ]

const standardSearchQuery = 
    {"arXiv":true,"googleScholar":false,"scopus":false,"query":"man","searchBy":"all","orderBy":"title",
    "sort":"ASC","year":"all","start":"0","count":"10"}

    
describe('selected papers box', () => {

    afterEach(cleanup);

    test('it displays the list of selected papers if list is not empty', () => {

        const {container} = render(<SelectedPapersListBox project_id={19} selectedPapersList={selectedPaperData} setSelectedPapersList={() => undefined} handlePaperSelection={() => undefined} mounted={true}/>);

        //I expect to find the titles of the papers in the selectedPapersList
        expect(container.getElementsByClassName("selected-papers-list")[0].style.opacity).toBe("1");
        expect(container.getElementsByTagName("span")[1].innerHTML).toBe(selectedPaperData[0].title);
        expect(container.getElementsByTagName("span")[2].innerHTML).toBe(selectedPaperData[1].title);

    })

    test('it hides the list box if the list is empty', () => {

        const {container} = render(<SelectedPapersListBox project_id={19} selectedPapersList={[]} setSelectedPapersList={() => undefined} handlePaperSelection={() => undefined} mounted={true}/>);

        //I expect to find the titles of the papers in the selectedPapersList
        expect(container.getElementsByClassName("selected-papers-list")[0].style.opacity).toBe("0");
        expect(container.getElementsByTagName("span").length).toBe(1);

    })

})


describe('search results lists', () => {

    afterEach(cleanup);

    test('scopus search list will show the papers data and their selection', () => {

        const {container} = render(
            testWrap(<PrintScoupusSearchList papersList={papersRes.results} handlePaperSelection={() => undefined} selectedEidList={["2-s2.0-85050251763"]}/>)
        );

        //paper data should be displayed
        expect(container.getElementsByTagName("h3").length).toBe(2)
        expect(container.getElementsByTagName("h3")[0].innerHTML).toBe(papersRes.results[0].title);
        expect(container.getElementsByTagName("h3")[1].innerHTML).toBe(papersRes.results[1].title);
        expect(container.getElementsByClassName("authors")[0].innerHTML).toBe(papersRes.results[0].authors);
        expect(container.getElementsByClassName("eid")[0].innerHTML).toBe(papersRes.results[0].eid);

        //first one should be checked
        expect(container.getElementsByTagName("input")[0].checked).toBe(true);

    });
    
})

describe('search standard form', () => {

    afterEach(cleanup);
    
    test('it renders the query data (empty keyword)', () => {

        const {container} = render(
            testWrap(<SearchStandardForm history={[]} queryData={{...standardSearchQuery, query: ""}} project_id={7}/>)
        );

        //expect search bar to be empty
        expect(container.getElementsByClassName("search-form small").length).toBe(0);
        expect(container.getElementsByTagName("input")[0].value).toBe("");
        //expect arxiv to be selected
        expect(container.getElementsByTagName("input")[1].checked).toBe(false); //scopus
        expect(container.getElementsByTagName("input")[2].checked).toBe(false); //google scholar
        expect(container.getElementsByTagName("input")[3].checked).toBe(true);  //arXiv
        //expect searchBy 'all' to be selected
        expect(container.getElementsByTagName("input")[4].checked).toBe(true); //all
        expect(container.getElementsByTagName("input")[5].checked).toBe(false); //author
        expect(container.getElementsByTagName("input")[6].checked).toBe(false); //content
        expect(container.getElementsByTagName("input")[7].checked).toBe(false); //advanced

    })

    test('it renders the query data', () => {

        const {container} = render(
            testWrap(<SearchStandardForm history={[]} queryData={standardSearchQuery} project_id={7}/>)
        );
        
        //expect search bar to contain keyword
        expect(container.getElementsByClassName("search-form small").length).toBe(1);
        expect(container.getElementsByTagName("input")[0].value).toBe(standardSearchQuery.query);

    })
    
})

describe('search standard page', () => {
    
    test('mounts the search standar components, fetches data and displays search results', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", standardSearchQuery);

        //will intercept the GET request
        const scope = nockGet("/search", standardSearchQuery, papersRes);

        const {container} = render(
            testWrap(<SearchStandardManager project_id={7} 
                        location={{search: "arXiv=true&googleScholar=false&scopus=false&query=man&searchBy=all&orderBy=title&sort=ASC&year=all&start=0&count=10"}} 
                        match={{url: ""}} history={[]}/>)
        );

        //search loading icon among all svg
        for(let i = 0; i < container.getElementsByTagName("svg").length; i++){
            if(container.getElementsByTagName("svg")[i].getAttribute("id") === "loading-icon"){
                foundLoadingIcon = true;
            }
        }

        //expect to find loading icon at first
        expect(foundLoadingIcon).toBe(true);
        
        //wait for papers list to appear
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
        optionsScope.done();
        scope.done();
        
    })

    test('it will render error if it gets error', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", standardSearchQuery);

        //will intercept the GET request
        const scope = nockGet("/search", standardSearchQuery, errorRes, errorRes.statusCode);

        const {container} = render(
            testWrap(<SearchStandardManager project_id={7} 
                        location={{search: "arXiv=true&googleScholar=false&scopus=false&query=man&searchBy=all&orderBy=title&sort=ASC&year=all&start=0&count=10"}} 
                        match={{url: ""}} history={[]}/>)
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

    test('it will empty results icon if it gets 404', async () => {

        let foundLoadingIcon = false;

        //will intercept the OPTIONS request
        const optionsScope = nockOptions("/search", standardSearchQuery);

        //will intercept the GET request
        const scope = nockGet("/search", standardSearchQuery, notFoundRes, notFoundRes.statusCode);

        const {container} = render(
            testWrap(<SearchStandardManager project_id={7} 
                        location={{search: "arXiv=true&googleScholar=false&scopus=false&query=man&searchBy=all&orderBy=title&sort=ASC&year=all&start=0&count=10"}} 
                        match={{url: ""}} history={[]}/>)
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
                return (element.getElementsByClassName("no-results").length === 1)
            }),
            { container }
        )

        //expect that mocked connections have been executed
        optionsScope.done();
        scope.done();
        
    })

})