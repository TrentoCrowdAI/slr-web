import React, {useState, useEffect, useContext, useRef} from "react";

import {paperDao} from 'dao/paper.dao';

import CheckBox from "components/forms_elements/checkbox";
import {PrintSearchAutomatedList} from 'components/modules/printPapersList';
import Pagination from "components/modules/pagination";
import SelectedPapersListBox from "components/projects_page/search_tab/selectedPapersListBox";

import LoadIcon from 'components/svg/loadIcon';
import NoSearchResults from "components/svg/noSearchResults";

import {AppContext} from 'components/providers/appProvider'

import {createQueryDataForAutomatedSearch, getIndexOfObjectArrayByKeyAndValue, arrayOfObjectsContains} from 'utils/index';
import SearchAutomatedDescription from "components/projects_page/search_tab/search_automated/searchAutomatedDescription";
import SearchAutomatedForm from "components/projects_page/search_tab/search_automated/searchAutomatedForm";


// Load the lodash build
const _ = require('lodash');


/**
 * automated search component
 * */

const SearchAutomatedManager = function ({project, location, match, history}) {

    const mountRef = useRef(false);

    //list of result papers data
    const [papersList, setPapersList] = useState([]);

    //bool to control the visualization of the results when fetching results data
    const [display, setDisplay] = useState(true);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    let queryData = createQueryDataForAutomatedSearch(location.search);

    //keyword hook
    const [keywords, setKeyWords] = useState(project.data.description);

    //get the localStorage object (used for saving selected papers)
    const storage = window.localStorage;
    if (!window.localStorage) {
        console.log("the browser must be support localStorage");
    }

    // list of selected papers
    const [selectedPapersList, setSelectedPapersList] = useState([]);

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    useEffect(() => {

        let mnt = true;

        const fetchPapers= async () => {
            
            setDisplay(false);

            setKeyWords(queryData.query || project.data.description);

            //I call the dao for the automated search
            let resx = undefined;

            resx = await paperDao.searchAutomated({"project_id" : project.id, "query" : queryData.query, 
                                                    "start" : queryData.start, "count" : queryData.count});

            console.log(resx);
            //error checking
            //if is 404 error
            if (mnt && resx && resx.message === "Not Found") {
                setPapersList([]);
                setTotalResults(0);
                //show the page
                setDisplay(true);
            }
            //if is other error
            else if (mnt && resx && resx.message) {
                //pass error object to global context
                appConsumer.setError(resx);
            }
            //if res isn't null
            else if (mnt && (resx !== null)) {
                //update state
                setPapersList(resx.results);
                setTotalResults(resx.totalResults);
                //show the page
                setDisplay(true);
            }
        }

        fetchPapers();

        //execute when the component will unmount and everytime the useEffect will end
        return () => {
            mnt = false;
        };
    }, [queryData.query, queryData.start, queryData.count])

    let resultPart = "";

     /*
        START OF 'RESULT PAPERS HANDLING' ########################################################
    */


    /*function to insert and remove the paper id from selected list*/
    function handlePaperSelection(event) {
        let newList;
        //get eid
        let eid = event.target.value;
        //get ttitle
        let title = event.target.name;
        //if id is not included in the list yet
        if (getIndexOfObjectArrayByKeyAndValue(selectedPapersList, "eid", eid) === -1) {
           //create a copy of array
            newList = [...selectedPapersList];
            //insert into array
            newList.push({"eid": eid, "title": title});

        }
        //if id already exists in the list
        else {
            //remove the  target paper from array
            newList = selectedPapersList.filter(function (element) {
                return element.eid !== eid;
            });
        }

        //update array
        setSelectedPapersList(newList);
        storage.setItem("selectedPapersList", JSON.stringify(newList));
    }

    /*function to select all papers*/
    function selectAllPapers(event) {
        
        let newList;
        
        //if not all papers are selected yet
        if(!arrayOfObjectsContains(selectedPapersList, papersList, "eid")){
            //I get the list of the papers in the current page
            let allPapersInPage = papersList.map((paper) => {return {"eid" : paper.eid, "title" : paper.title}});
            //and merge them with the previously selected ones
            let tmpList = [...allPapersInPage, ...selectedPapersList];
            newList = _.uniqBy(tmpList, 'eid');
        }else{//otherwise
            //I get the list of the papers in the current page
            let allPapersInPage = papersList.map((paper) => {return {"eid" : paper.eid, "title" : paper.title}});
            //I filter the selectedPapersList by removing the papers that are in the current page
            newList = selectedPapersList.filter(x => !allPapersInPage.some(paper => paper.eid === x.eid));
        }
        
        setSelectedPapersList(newList);

        //update array in local storage
        storage.setItem("selectedPapersList", JSON.stringify(newList));
    }

    /*
        END OF 'RESULT PAPERS HANDLING' ########################################################
    */

    //if is loading
    if (display === false) {

        resultPart = (
            <div className="paper-card-holder">
                <div className="paper-card-holder-head" style={{pointerEvents: "none"}}>{/* this way the user cannot sort while loading the results */}
                    <div className="select-all">
                    <CheckBox label="Select All" name="select_all" val="" isChecked={false} handler={selectAllPapers}/>
                    </div>
                </div>
                <div className="search-loading-holder">
                    <LoadIcon class={"small"}/>
                </div>
            </div>);
    }

    //if the search results list is empty
    else if (papersList.length === 0) {
        //the 'no-results' class is used only to workaround a small bug that display not found just as the search start before the loading icon
        resultPart = (
            <div className="no-results"> <NoSearchResults/> <p className="not-found-description"> Nothing was found </p> </div>
        );
    }
    else if (papersList.length > 0) {

        //create a eidList from the list of selected paper
        let arrayEid = selectedPapersList.map(element => element.eid);

        resultPart = (
            <div className="paper-card-holder">
                <div className="paper-card-holder-head">
                    <div className="select-all">
                    <CheckBox label="Select All" name="select_all" val="" isChecked={arrayOfObjectsContains(selectedPapersList, papersList, "eid")} handler={selectAllPapers}/>
                    </div>
                </div>
                <SelectedPapersListBox project_id={project.id} selectedPapersList={selectedPapersList} 
                    setSelectedPapersList={setSelectedPapersList} handlePaperSelection={handlePaperSelection}
                    mounted={mountRef}
                />
                
                <PrintSearchAutomatedList papersList={papersList} handlePaperSelection={handlePaperSelection}
                                        selectedEidList={arrayEid}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </div>
        );
    }


    let output = (
        <>
            {/*<Link className="back-from-search-automated"></Link>*/}
            <SearchAutomatedDescription project_id={project.id}/>
            <SearchAutomatedForm {...{keywords, setKeyWords, history, queryData}} description={project.data.description}/>
            <div className="search-results">
                {resultPart}
            </div>
        </>
    );

    return output;
};

export default SearchAutomatedManager;