import React, {useState, useEffect, useContext, useRef} from "react";


import {paperDao} from 'dao/paper.dao';

import CheckBox from "components/forms_elements/checkbox";
import {PrintScoupusSearchList} from 'components/modules/printPapersList';
import Select from 'components/forms_elements/select';
import Pagination from "components/modules/pagination";

import OrderArrow from 'components/svg/orderArrow';
import LoadIcon from 'components/svg/loadIcon';
import NoSearchResults from "components/svg/noSearchResults";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject, getIndexOfObjectArrayByKeyAndValue, arrayOfObjectsContains, createQueryData} from 'utils/index';
import SelectedPapersListBox from "components/projects_page/search_tab/selectedPapersListBox";
import SearchSimilarForm from "./searchSimilarForm";



// Load the lodash build
const _ = require('lodash');

//order options
const orderByOptions = [
    {label: 'Title', value: 'title'},
    {label: 'Date', value: 'date'}
];

const queryParams = [
        {label: "query", default: ""},
        {label: "orderBy", default: "title"},
        {label: "sort", default: "ASC"},
        {label: "start", default: 0},
        {label: "count", default: 10},
];

/**
 * this is component form to search for the paper in project page
 * */

const SearchSimilarManager = function ({project_id, location, match, history}) {

    const mountRef = useRef(false);

    //remove similar paper data once the page is
    window.onbeforeunload = function(e){
        window.localStorage.removeItem("targetPaperData");
    }

    //list of result papers data
    const [papersList, setPapersList] = useState([]);

    //bool to control the visualization of the results when fetching results data
    const [display, setDisplay] = useState(true);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //get data from global context
    const appConsumer = useContext(AppContext);


    //set query params from url
    let queryData = createQueryData(location.search, queryParams);
    //console.log(queryData);

    //get the localStorage object
    const storage = window.localStorage;
    let selectedPapersListFromStorage;
    let similarPaperDataFromStorage;
    if (!window.localStorage) {
        console.log("the browser must be support localStorage");
    }
    
    //if exists already this attribute in the local storage
    if (storage.getItem("selectedPapersList")) {
        selectedPapersListFromStorage = JSON.parse(storage.getItem("selectedPapersList"));
    }
    //if not exists, we create a new array
    else {
        selectedPapersListFromStorage = [];
    }

    //if exists already this attribute in the local storage
    if (storage.getItem("targetPaperData")) {
        similarPaperDataFromStorage = JSON.parse(storage.getItem("targetPaperData"));
    }
    //if not exists, we create a new array
    else {
        similarPaperDataFromStorage = null;
    }

    // list of selected papers
    const [selectedPapersList, setSelectedPapersList] = useState(selectedPapersListFromStorage);

    const [targetPaperData, setTargetPaperData] = useState(similarPaperDataFromStorage); //the data of the paper to search similarities for

    //state for sorting arrow animation
    const [up, setUp] = useState(queryData.sort);


    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    //update local storage every time the similar paper data changes
    useEffect(() => {

        let mnt = true;

        console.log("FETCHING RESULTS");

        //if the sorting parameter changes I update the status and trigger the SVG animation
        if (up !== queryData.sort) {
            setUp(queryData.sort);
            if(document.getElementById("ani-order-arrow")){
                document.getElementById("ani-order-arrow").beginElement();
            }
        }

        if(targetPaperData){
            //fetches for similar papers
            const fetchSimilarPapers= async () => {
                
                setDisplay(false);
                storage.setItem("targetPaperData", JSON.stringify(targetPaperData));

                //I call the dao for searching for similar papers based on similarPaperString
                //this will be the call for the similarity search
                let resx = await paperDao.searchSimilar({"paperData" : targetPaperData, "start" : queryData.start, "count" : queryData.count, "scopus": true});

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
                    console.log("SETTING RESULTS");
                    //update state
                    setPapersList(resx.results);
                    setTotalResults(resx.totalResults);
                    //show the page
                    setDisplay(true);
                }else{
                    console.log("can't set enything")
                }
            }

            fetchSimilarPapers();
        }else{
            storage.removeItem("targetPaperData");
        }

        //execute on unmount and every time the useEffect ends
        return () => {
            mnt = false;
        };

    }, [targetPaperData, queryData.orderBy, queryData.sort, queryData.start, queryData.count])


    let resultPart = "";

     /*
        START OF 'RESULT PAPERS HANDLING' ########################################################
    */

    //handler for sort selection
    function handleSelection(e) {
        //get index
        let index = parseInt(e.target.getAttribute('data-value'));
        //get value by index
        queryData.orderBy = orderByOptions[index].value;
        //update url
        let queryString = createQueryStringFromObject(queryData);
        history.push(queryString);

    }

    //handler for order selection(ASC|DESC)
    function handelOrder(e) {

        if (queryData.sort === "ASC") {
            queryData.sort = "DESC";
        }
        else {
            queryData.sort = "ASC";
        }
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
    if (display === false || (!targetPaperData && queryData.query !== "")) {

        resultPart = (
            <div className="paper-card-holder similar-holder">
                <div className="paper-card-holder-head" style={{pointerEvents: "none"}}>{/* this way the user cannot sort while loading the results */}
                    <div className="select-all">
                    <CheckBox label="Select All" name="select_all" val="" isChecked={false} handler={selectAllPapers}/>
                    </div>
                    <div className="order">
                        <div className="order-flex-item">
                            <label>sort by:</label>
                            <Select options={orderByOptions}
                                    selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)}
                                    handler={handleSelection}/>
                            <button type="button" onClick={handelOrder}><OrderArrow display={true} up={(queryData.sort)}/></button>
                        </div>
                    </div>
                </div>
                <div className="search-loading-holder">
                    <LoadIcon class={"small"}/>
                </div>
            </div>);
    }

    //if the search results list is empty
    else if (papersList.length === 0 && targetPaperData) {
        //the class is used only to workaround a small bug that display not found just as the search start before the loading icon
        resultPart = (
            <div className="no-results"> <NoSearchResults/> <p className="not-found-description"> Nothing was found </p> </div>
        );
    }
    else if (papersList.length > 0 && targetPaperData) {

        //create a eidList from the list of selected paper
        let arrayEid = selectedPapersList.map(element => element.eid);

        resultPart = (
            <div className="paper-card-holder">
                <div className="paper-card-holder-head">
                    <div className="select-all">
                    <CheckBox label="Select All" name="select_all" val="" isChecked={arrayOfObjectsContains(selectedPapersList, papersList, "eid")} handler={selectAllPapers}/>
                    </div>
                    <div className="order">
                        <div className="order-flex-item">
                            <label>sort by:</label>
                            <Select options={orderByOptions}
                                    selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)}
                                    handler={handleSelection}/>
                            <button type="button" onClick={handelOrder}><OrderArrow display={true} up={(queryData.sort)}/></button>
                        </div>
                    </div>
                </div>
                <SelectedPapersListBox project_id={project_id} selectedPapersList={selectedPapersList} 
                    setSelectedPapersList={setSelectedPapersList} handlePaperSelection={handlePaperSelection}
                    mounted={mountRef}    
                />

                <PrintScoupusSearchList papersList={papersList} handlePaperSelection={handlePaperSelection} selectedEidList={arrayEid} setTargetPaperData={setTargetPaperData}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </div>
        );
    }


    let output = (
        <>
            <SearchSimilarForm {...{history, queryData, project_id, targetPaperData, setTargetPaperData}}/>
            <div className="search-results">
                {resultPart}
            </div>
        </>
    );

    return output;
};


export default SearchSimilarManager;