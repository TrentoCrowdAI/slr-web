import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom'

import {paperDao} from 'dao/paper.dao';

import CheckBox from "components/forms_elements/checkbox";
import {PrintScoupusSearchList} from 'components/modules/printPapersList';
import Select from 'components/forms_elements/select';
import Pagination from "components/modules/pagination";
import SelectedPapersListBox from "components/projects_page/search_tab/selectedPapersListBox";

import LoadIcon from 'components/svg/loadIcon';
import OrderArrow from 'components/svg/orderArrow';
import NoSearchResults from "components/svg/noSearchResults";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject, createQueryDataForStandardSearch, getIndexOfObjectArrayByKeyAndValue, arrayOfObjectsContains} from 'utils/index';
import SearchStandardForm from "./searchStandardForm";
import Robot from "components/svg/robot";


// Load the lodash build
const _ = require('lodash');

//order options
const orderByOptions = [
    {label: 'Title', value: 'title'},
    {label: 'Date', value: 'date'}
];

/**
 * this is component form to search for the paper in project page
 * */

const SearchStandardManager = function ({project_id, location, match, history}) {

    console.log("FETCHING RESULTS")


    //fetch data
    const [papersList, setPapersList] = useState([]);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(true);

    //total number of results (useful for pagination)
    const [totalResults, setTotalResults] = useState(0);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    let queryData = createQueryDataForStandardSearch(location.search);

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

    //state for sorting arrow animation
    const [up, setUp] = useState(queryData.sort);


    //this will run on mount and every time the url params change
    useEffect(() => {

        //flag that represents the state of component
        let mounted = true;

        //if the sorting parameter changes I update the status and trigger the SVG animation
        if (up !== queryData.sort) {
            setUp(queryData.sort);
            if(document.getElementById("ani-order-arrow")){
                document.getElementById("ani-order-arrow").beginElement();
            }
        }

        //a wrapper function ask by react hook
        const fetchData = async () => {


            //if there is queryString from URL
            if (queryData.query !== "") {

                setDisplay(false);

                //always call the dao to search on scopus
                let res = await paperDao.search(queryData);

                //error checking
                //if the component is still mounted and  is 404 error
                if (mounted && res && res.message === "Not Found") {
                    setPapersList([]);
                    setTotalResults(0);
                    //show the page
                    setDisplay(true);
                }
                //if the component is still mounted and  there are some other errors
                else if (mounted && res && res.message) {
                    //pass error object to global context
                    appConsumer.setError(res);
                }
                //if the component is still mounted and  res isn't null
                else if (mounted && res) {
                    //update state
                    setPapersList(res.results);
                    setTotalResults(res.totalResults);
                    //show the page
                    setDisplay(true);
                }
            }
        };


        fetchData();
        

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mounted = false;
        };

    }, [project_id, queryData.query, queryData.orderBy, queryData.searchBy, queryData.sort, queryData.year, queryData.start, queryData.count, queryData.scopus, queryData.googleScholar, queryData.arXiv]);  //re-execute when these variables change


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
        //update array in local storage
        storage.setItem("selectedPapersList", JSON.stringify(newList));
    }

    /*function to select all papers*/
    function selectAllPapers(event) {

        let newList;

        //if not all papers are selected yet
        if (!arrayOfObjectsContains(selectedPapersList, papersList, "eid")) {

            //I get the list of the papers in the current page
            let allPapersInPage = papersList.map((paper) => {
                return {"eid": paper.eid, "title": paper.title}
            });
            //and merge them with the previously selected ones
            let tmpList = [...allPapersInPage, ...selectedPapersList];
            newList = _.uniqBy(tmpList, 'eid');

        }
        //if all papers are selected, we need to remove them
        else {
            //I get the list of the papers in the current page
            let allPapersInPage = papersList.map((paper) => {
                return {"eid": paper.eid, "title": paper.title}
            });
            //I filter the selectedPapersList by removing the papers that are in the current page
            newList = selectedPapersList.filter(x => !allPapersInPage.some(paper => paper.eid === x.eid));
        }

        //update array
        setSelectedPapersList(newList);
        //update array in local storage
        storage.setItem("selectedPapersList", JSON.stringify(newList));
    }

    /*
     END OF 'RESULT PAPERS HANDLING' ########################################################
     */


    let resultPart = "";

    //if is loading
    if (display === false) {

        resultPart = (
            <div className="paper-card-holder">
                <div className="paper-card-holder-head"
                     style={{pointerEvents: "none"}}>{/* this way the user cannot sort while loading the results */}
                    <div className="select-all">
                        <CheckBox label="Select All" name="select_all" val="" isChecked={false}
                                  handler={selectAllPapers}/>
                    </div>
                    <div className="order">
                        <label>sort by:</label>
                        <Select options={orderByOptions}
                                selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)}
                                handler={handleSelection}/>
                        <button type="button" onClick={handelOrder}><OrderArrow display={true} up={(queryData.sort)}/>
                        </button>
                    </div>
                </div>
                <div className="search-loading-holder">
                    <LoadIcon class={"small"}/>
                </div>
            </div>);
    }

    //if the search results list is empty
    else if (papersList.length === 0 && queryData.query !== "") {
        //the class is used only to workaround a small bug that display not found just as the search start before the loading icon
        resultPart = (
            <div className="no-results"> <NoSearchResults/> <p className="not-found-description"> Nothing was found </p> </div>
        );
    }
    else if (papersList.length > 0 && queryData.query !== "") {

        //create a eidList from the list of selected paper
        let arrayEid = selectedPapersList.map(element => element.eid);

        resultPart = (
            <div className="paper-card-holder">
                <div className="paper-card-holder-head">
                    <div className="select-all">
                        <CheckBox label="Select All" name="select_all" val=""
                                  isChecked={arrayOfObjectsContains(selectedPapersList, papersList, "eid")}
                                  handler={selectAllPapers}/>
                    </div>
                    <div className="order">
                        <label>sort by:</label>
                        <Select options={orderByOptions}
                                selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)}
                                handler={handleSelection}/>
                        <button type="button" onClick={handelOrder}><OrderArrow display={true} up={(queryData.sort)}/>
                        </button>
                    </div>
                </div>
                <SelectedPapersListBox project_id={project_id} selectedPapersList={selectedPapersList} setSelectedPapersList={setSelectedPapersList} handlePaperSelection={handlePaperSelection}/>


                <PrintScoupusSearchList papersList={papersList} handlePaperSelection={handlePaperSelection}
                                        selectedEidList={arrayEid}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults}
                            path={match.url}/>
            </div>
        );
    }


    let output = (
        <>
            <SearchStandardForm
                {...{history, queryData, project_id}}
            />
            <div className="search-automated-option" style={{display: (queryData.query === "") ? "block" : "none"}}>
                <p><i>or</i><br/>let an algorithm provide search results for you</p>
                <Link to={"/projects/" + project_id + "/searchautomated"}>
                    <Robot/>
                </Link>
            </div>
            <div className="search-results">
                {resultPart}
            </div>
        </>
    );

    return output;
};


export default SearchStandardManager;