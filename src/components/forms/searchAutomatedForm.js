import React, {useState, useEffect, useContext} from "react";
import {Route, Link, Switch} from 'react-router-dom';
import queryString from "query-string";
import Textarea from 'react-textarea-autosize';


import {paperDao} from 'dao/paper.dao';
import {projectPapersDao} from 'dao/projectPapers.dao';
import {updateFileDao} from "dao/updateFile.dao";

import CheckBox from "components/forms/checkbox";
import RadioBox from "components/forms/radiobox";
import {PrintSearchAutomatedList} from 'components/modules/printPapersList';
import Select from 'components/forms/select';
import Pagination from "components/modules/pagination";
import SearchSimilarPapers from "components/forms/searchSimilarPapers";

import OrderArrow from 'components/svg/orderArrow';
import LoadIcon from 'components/svg/loadIcon';
import RemoveButton from 'components/svg/removeButton';
import NoSearchResults from "components/svg/noSearchResults";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject, getIndexOfObjectArrayByKeyAndValue, arrayOfObjectsContains} from 'utils/index';
import SearchAutomatedDescription from "components/projects_page/searchAutomatedDescription";
import SearchButton from "components/svg/searchButton";


// Load the lodash build
const _ = require('lodash');


/**
 * 
 * */

const SearchAutomatedForm = function ({project, location, match, history}) {

    //list of result papers data
    const [papersList, setPapersList] = useState([]);

    //bool to control the visualization of the results when fetching results data
    const [display, setDisplay] = useState(true);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //state for search form
    const [keywords, setKeyWords] = useState(project.data.description);


    //set query params from url
    let queryData = createQueryData(location.search);


    //get the localStorage object
    const storage = window.localStorage;
    let selectedPapersListFromStorage;
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

    // list of selected papers
    const [selectedPapersList, setSelectedPapersList] = useState(selectedPapersListFromStorage);


    useEffect(() => {
        
        let mounted = true;

        const fetchPapers= async () => {
            
            setDisplay(false);

            //I call the dao for searching for similar papers based on similarPaperString
            //this will be the call for the similarity search
            let resx = undefined;
            if(!queryData.query || queryData.query === ""){
                resx = await paperDao.search({"query" : "woman", "arXiv" : "true"});
            }else{
                resx = await paperDao.search({"query" : "man", "arXiv" : "true"});
            }

            //error checking
            //if is 404 error
            if (mounted && resx && resx.message === "Not Found") {
                setPapersList([]);
                setTotalResults(0);
                //show the page
                setDisplay(true);
            }
            //if is other error
            else if (mounted && resx && resx.message) {
                //pass error object to global context
                appConsumer.setError(resx);
            }
            //if res isn't null
            else if (mounted && (resx !== null)) {
                //update state
                setPapersList(resx.results);
                setTotalResults(resx.totalResults);
                //show the page
                setDisplay(true);
            }
        }

        fetchPapers();

        //when the component will unmount
        return () => {
            mounted = false;
        };
    }, [queryData.query, queryData.start, queryData.count])

    /*handles the submission of a search */
    function handleSendSearch(event) {
        

        console.log("SUBMITTING SEARCH");
        event.preventDefault();

        //if query input is empty
        if (keywords === "") {
            appConsumer.setNotificationMessage("Similar paper string is empty")
        }
        else {
            //synchronize the query data from react state hooks
            //if there isn't any file I search with the string
            queryData.query = keywords;
            //send query url
            let queryString = createQueryStringFromObject(queryData);
            //launch to search
            history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router

        }


    }

    /*
     #######################################
     need to  create a new child component for the part of <form>, when we have more information on search options
     ######################################
     */
    let formPart = (
        <>
            <form className='search-automated-form'
                    onSubmit={handleSendSearch}>
            <Textarea
                useCacheForDOMMeasurements
                maxRows={6}
                placeholder="search"
                name="query"
                value={keywords}
                onChange={(e) => {setKeyWords(e.target.value)}}
            />
            <button type="submit" disabled={(keywords === project.data.description)}><SearchButton/></button>
            </form>
        </>);


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

    /*function to add the post in the project*/
    async function handleAddPapers(event) {

        event.preventDefault();
        //console.log(selectedPapersList);

        let papersToAdd = selectedPapersList;
        //empties the state
        setSelectedPapersList([]);
        //update the storage
        storage.removeItem("selectedPapersList");

        //create a eidList from the list of selected paper
        let arrayEid = papersToAdd.map(element => element.eid);

        //call dao
        let res = await projectPapersDao.postPaperIntoProject({
            "arrayEid": arrayEid, "project_id": project.id
        });
        //if there is the error
        if (res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);
            return null;
        }

        //empties the state
        setSelectedPapersList([]);

        //update the storage
        storage.removeItem("selectedPapersList");

        appConsumer.setNotificationMessage("Insert completed");

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
                <SelectedPapersListBox selectedPapersList={selectedPapersList}/>
                <div className="search-loading-holder">
                    <LoadIcon class={"small"}/>
                </div>
            </div>);
    }

    //if the search results list is empty
    else if (papersList.length === 0) {
        //the class is used only to workaround a small bug that display not found just as the search start before the loading icon
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
                <SelectedPapersListBox selectedPapersList={selectedPapersList} handlePaperSelection={handlePaperSelection}/>

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
            {formPart}
            <form className="search-results" onSubmit={handleAddPapers}>
                {resultPart}
            </form>
        </>
    );

    return output;
};


/**
 * internal component to print the box of list of selected paper
 */
const SelectedPapersListBox = function ({selectedPapersList, handlePaperSelection}){

    let output = "";
    output = (
        <div className="selected-papers-list" style={{opacity: (selectedPapersList.length>0) ? "1.0" : "0.0", pointerEvents: (selectedPapersList.length>0) ? "auto" : "none"}}>
            <h3>
                {"SELECTED PAPERS"} <br/><span>(total : {selectedPapersList.length})</span>
            </h3>
            <div className="submission-wrapper">
                <div className="papers-wrapper" style={{border: (selectedPapersList.length>0) ? "" : "0px"}}>
                    <div className="papers-flex" style={{padding: (selectedPapersList.length>0) ? "" : "0px"}}>
                        {selectedPapersList.map((element, index) =>
                            <p key={index}>
                                <span>{element.title}</span> 
                                <button type="button" className="remove-btn" name={element.title} value={element.eid} //name and value don't work on the button event for some reasons
                                    onClick={(e) => {handlePaperSelection({target: {name: element.title, value:element.eid}})}}>
                                    <RemoveButton/>
                                </button>
                            </p>
                        )}
                    </div>
                </div>
                <button style={{border: (selectedPapersList.length>0) ? "" : "0px", margin: (selectedPapersList.length>0) ? "" : "0px", height: (selectedPapersList.length>0) ? "" : "0px", pointerEvents: (selectedPapersList.length>0) ? "auto" : "none"}} className="ti-btn add-resultpaper-btn" type="submit" value="Submit">
                    <div className="btn-title">Add Selected Paper</div><div className="btn-icon"> </div>
                </button>
            </div>
        </div>
    );

    return output;

};


/**
 * internal function to prepare a object of queryData
 * @param queryUrl
 * @return object of queryData for the fetch
 */
function createQueryData(queryUrl) {


    //set query params from queryString of url
    let params = queryString.parse(queryUrl);
    let query = params.query || "";

    let start = params.start || 0;
    let count = params.count || 10;

    let queryData = {query, start, count};

    return queryData;

}


export default SearchAutomatedForm;