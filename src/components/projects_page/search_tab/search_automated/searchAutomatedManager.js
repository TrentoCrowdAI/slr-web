import React, {useState, useEffect, useContext, useRef} from "react";

import {paperDao} from 'dao/paper.dao';

import CheckBox from "components/forms_elements/checkbox";
import {PrintSearchAutomatedList} from 'components/modules/printPapersList';
import Select from 'components/forms_elements/select';
import Pagination from "components/modules/pagination";
import SelectedPapersListBox from "components/projects_page/search_tab/selectedPapersListBox";

import LoadIcon from 'components/svg/loadIcon';
import NoSearchResults from "components/svg/noSearchResults";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject, createQueryDataForAutomatedSearch, getIndexOfObjectArrayByKeyAndValue, arrayOfObjectsContains} from 'utils/index';
import SearchAutomatedDescription from "components/projects_page/search_tab/search_automated/searchAutomatedDescription";


// Load the lodash build
const _ = require('lodash');

//confidence value array
const confidenceValues = [
    {label : "0.00", value: 0.0},
    {label : "0.10", value: 0.1},
    {label : "0.20", value: 0.2},
    {label : "0.30", value: 0.3},
    {label : "0.40", value: 0.4},
    {label : "0.50", value: 0.5},
    {label : "0.60", value: 0.6},
    {label : "0.70", value: 0.7},
    {label : "0.80", value: 0.8},
    {label : "0.90", value: 0.9},
    {label : "1.00", value: 1.0},
];

//will keep valid minimum values
var minConfidenceValues = [];
//will keep valid maximum values
var maxConfidenceValues = [];;

/**
 * automated search component
 * */

const SearchAutomatedManager = function ({project, location, match, history}) {

    const mountRef = useRef(false);

    //list of result papers data
    const [papersList, setPapersList] = useState([]);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //filters
    const [filtersList, setFiltersList] = useState([]);

    //bool to control the visualization of the results when fetching results data
    const [display, setDisplay] = useState(true);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    let queryData = createQueryDataForAutomatedSearch(location.search);

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
            
            //I call the dao for the automated search
            let resx = undefined;

            console.log(queryData);

            //max confidence that can be selected must be above the min value
            maxConfidenceValues = confidenceValues.filter(c => c.value > parseFloat(queryData.min_confidence));
            //min confidence that can be selected must be below the max value
            minConfidenceValues = confidenceValues.filter(c => c.value < parseFloat(queryData.max_confidence));

            resx = await paperDao.searchAutomated({"project_id" : project.id, "start" : queryData.start, "count" : queryData.count,
                                                    "min_confidence": queryData.min_confidence, "max_confidence": queryData.max_confidence});

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
    }, [queryData.start, queryData.count, queryData.min_confidence, queryData.max_confidence])

    let resultPart = "";

     /*
        START OF 'RESULT PAPERS HANDLING' ########################################################
    */

    //handler for min confidence selection
    function handleMinConfidenceSelection(e) {
        //get index value
        let index = parseInt(e.target.getAttribute('data-value'));
        //get value by index
        queryData.min_confidence = confidenceValues[index].value;
        //update url
        let queryString = createQueryStringFromObject(queryData);
        history.push(queryString);

    }

    //handler for max confidence selection
    function handleMaxConfidenceSelection(e) {
        //get index value
        let index = parseInt(e.target.getAttribute('data-value'));
        //get value by index
        queryData.max_confidence = maxConfidenceValues[index].value;
        //update url
        let queryString = createQueryStringFromObject(queryData);
        history.push(queryString);

    }

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
                    <div className="order">
                        <label>min confidence:</label>
                        <Select options={minConfidenceValues}
                                selected={getIndexOfObjectArrayByKeyAndValue(minConfidenceValues, "value", parseFloat(queryData.min_confidence))}
                                handler={handleMinConfidenceSelection}
                                //optional fields
                                type={"mini"} //displays select menu with smaller width
                                code={0} //you can put here a random number in case you have multiple selects on the same page
                                         //this way you won't trigger the arrow animation for all the selects at the same time
                                />
                        <label>max confidence:</label>
                        <Select options={maxConfidenceValues}
                                selected={getIndexOfObjectArrayByKeyAndValue(maxConfidenceValues, "value", parseFloat(queryData.max_confidence))}
                                handler={handleMaxConfidenceSelection}
                                type={"mini"}
                                code={1}/>
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
                    <div className="order">
                        <label>min confidence:</label>
                        <Select options={minConfidenceValues}
                                selected={getIndexOfObjectArrayByKeyAndValue(minConfidenceValues, "value", parseFloat(queryData.min_confidence))}
                                handler={handleMinConfidenceSelection}
                                //optional fields
                                type={"mini"} //displays select menu with smaller width
                                code={0} //you can put here a random number in case you have multiple selects on the same page
                                         //this way you won't trigger the arrow animation for all the selects at the same time
                                />
                        <label>max confidence:</label>
                        <Select options={maxConfidenceValues}
                                selected={getIndexOfObjectArrayByKeyAndValue(maxConfidenceValues, "value", parseFloat(queryData.max_confidence))}
                                handler={handleMaxConfidenceSelection}
                                type={"mini"}
                                code={1}/>
                    </div>
                </div>
                <SelectedPapersListBox project_id={project.id} selectedPapersList={selectedPapersList} 
                    setSelectedPapersList={setSelectedPapersList} handlePaperSelection={handlePaperSelection}
                    mounted={mountRef}
                />
                
                <PrintSearchAutomatedList papersList={papersList} filtersList={filtersList} 
                                        handlePaperSelection={handlePaperSelection} selectedEidList={arrayEid}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </div>
        );
    }


    let output = (
        <>
            {/*<Link className="back-from-search-automated"></Link>*/}
            <SearchAutomatedDescription project_id={project.id} filtersList={filtersList} setFiltersList={setFiltersList}/>
            <div className="search-results auto">
                {resultPart}
            </div>
        </>
    );

    return output;
};

export default SearchAutomatedManager;