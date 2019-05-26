import React, {useState, useEffect, useContext} from "react";
import queryString from "query-string";


import {paperDao} from 'dao/paper.dao';
import {projectPapersDao} from 'dao/projectPapers.dao';
import {updateFileDao} from "dao/updateFile.dao";

import CheckBox from "components/forms/checkbox";
import RadioBox from "components/forms/radiobox";
import {PrintScoupusSearchList} from 'components/papers/printPapersList';
import Select from 'components/forms/select';
import Pagination from "components/modules/pagination";
import SearchSimilarPapers from "components/forms/searchSimilarPapers";

import OrderArrow from 'components/svg/orderArrow';
import LoadIcon from 'components/svg/loadIcon';
import RemoveButton from 'components/svg/removeButton';
import NoSearchResults from "components/svg/noSearchResults";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject, getIndexOfObjectArrayByKeyAndValue, arrayOfObjectsContains} from 'utils/index';



// Load the lodash build
const _ = require('lodash');

//order options
const orderByOptions = [
    {label: 'Title', value: 'title'},
    {label: 'Date', value: 'date'}
];


//year options
const startYear = 2017;
const endYear = new Date().getFullYear() + 2;;
//create a int array from startYear to endYear, then convert it to string array, after this concatenate with "all"
const yearOptions = ["all", ...(_.range(startYear, endYear).map(String))];


/**
 * this is component form to search for the paper in project page
 * */

const SearchSimilarForm = function ({project_id, location, match, history}) {


    //list of result papers data
    const [papersList, setPapersList] = useState([]);

    //bool to control the visualization of the results when fetching results data
    const [display, setDisplay] = useState(true);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //get data from global context
    const appConsumer = useContext(AppContext);


    //set query params from url
    let queryData = createQueryData(location.search);
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
    if (storage.getItem("similarPaperData")) {
        similarPaperDataFromStorage = JSON.parse(storage.getItem("similarPaperData"));
    }
    //if not exists, we create a new array
    else {
        similarPaperDataFromStorage = null;
    }

    // list of selected papers
    const [selectedPapersList, setSelectedPapersList] = useState(selectedPapersListFromStorage);

    //state for search form
    const [keywords, setKeyWords] = useState("");
    const [source, setSource] = useState({"scopus": true, "googleScholar": false, "arXiv": false});
    const [year, setYear] = useState("all");
    const [similarPaperData, setSimilarPaperData] = useState(similarPaperDataFromStorage); //the data of the paper to search similarities for
    const [similarPaperFile, setSimilarPaperFile] = useState(undefined); //the file of the paper to search similarities for

    //state for sorting arrow animation
    const [up, setUp] = useState(queryData.sort);

    //state for 'similar papers search' form
    const [similarFormVisibility, setSimilarFormVisibility] = useState(false);

    //bool for target similar paper fetching
    const [similarPaperFetch, setSimilarPaperFetch] = useState(false);


    /*
        START OF USEEFFECT FOR HANDLING QUERY PARAMETERS ###################################################
    */

    //effect for query parameters input
    useEffect(() => {

        let mounted = true;

        console.log(queryData);
        //if the sorting parameter changes I update the status and trigger the SVG animation
        if(up !== queryData.sort){
            setUp(queryData.sort);
            if(document.getElementById("ani-order-arrow")){
                document.getElementById("ani-order-arrow").beginElement();
            }
        }


        //fetches data when searching for similarities
        const fetchDataSimilarity = async () => {

            let res = undefined;

            //standard options parameters
            setKeyWords(queryData.query);
            setSource({"scopus": queryData.scopus, "googleScholar": queryData.googleScholar, "arXiv": queryData.arXiv});
            setYear(queryData.year);

            //if there's some data in storage(it means I'm probaly fetching a second page of results)
            if(similarPaperData){
                //open flag of loading
                setDisplay(false);
                
                //I call the dao for searching for similar papers based on the data
                //this will be the call for the similarity search
                res = await paperDao.searchSimilar({"query": "Trento", "start" : queryData.start, "count" : queryData.count});
                setPapersList(res.results);
                
                //close flag of loading
                setDisplay(true);

            }//if there's a file I can do an api call to search for papers similar to the file
            else if(similarPaperFile){
                
                console.log("FILE NAME : " + similarPaperFile.name)

                //check file extension and its mine type
                if(!/\.(pdf|PDF)$/.test(similarPaperFile.name) || similarPaperFile.type.indexOf("application/pdf") === -1){
                    alert("the file must be a pdf");
                }
                else{
                    //open flag of loading
                    setDisplay(false);
                    setSimilarPaperFetch(true);
                    console.log("FETCHING PARSE PDF")
                    //prepare the form data for post
                    let formData = new FormData();
                    formData.append('file', similarPaperFile);

                    //call the dao
                    console.log("CALLING THE PAPER PARSER SERVICE")
                    res = await updateFileDao.updatePdf(formData);
    
                    //if there is a error
                    if (res && res.message) {
                        //pass error object to global context
                        alert("Error during parsing file");
                        setDisplay(true);
                        setSimilarPaperFetch(false);
                    }
                    else{
                        console.log(res);
                        //set paperdata
                        setSimilarPaperData(res);
                        //display the paper data
                        setSimilarPaperFetch(false);
                    }
    
                    //I call the dao for searching for similar papers based on the data
                    //this will be the call for the similarity search
                    res = await paperDao.searchSimilar({"query" : "Trento", "start" : queryData.start, "count" : queryData.count});
                    setPapersList(res.results);
                    
                    //close flag of loading
                    setDisplay(true);

                }
            }//if there's a query I can retrieve similar papers based on the query
            else if (queryData.query !== "") {

                setDisplay(false);
                
                setSimilarPaperFetch(true);
                //this will be the call to the service identifying a specific paper
                let paperData = await paperDao.search({"query": "Torino"});
                setSimilarPaperData(paperData.results[0]);
                setSimilarPaperFetch(false);


                //I call the dao for searching for similar papers based on similarPaperString
                //this will be the call for the similarity search
                let res = await paperDao.searchSimilar({"query" : "Trento", "start" : queryData.start, "count" : queryData.count});
                console.log(res);

                //error checking
                //if is 404 error
                if (res && res.message === "Not Found") {
                    setPapersList([]);
                    setTotalResults(0);
                    //show the page
                    setDisplay(true);
                }
                //if is other error
                else if (res && res.message) {
                    //pass error object to global context
                    appConsumer.setError(res);
                }
                //if res isn't null
                else if (res !== null) {
                    //update state
                    setPapersList(res.results);
                    setTotalResults(res.totalResults);
                    //show the page
                    setDisplay(true);
                }
            }else{
                console.log("no file (& no similarPaperString)");
            }

        };


        fetchDataSimilarity();

        //when the component will unmount
        return () => {
            localStorage.removeItem("similarPaperData");
            mounted = false;
        };

    }, [project_id, similarPaperFile, queryData.query, queryData.orderBy, queryData.sort, queryData.year, queryData.start, queryData.count, queryData.scopus, queryData.googleScholar, queryData.arXiv]);  //re-execute when these variables change


    /*
        END OF USEEFFECT FOR HANDLING QUERY PARAMETERS #######################################################
    */


    //update local storage every time the similar paper data changes
    useEffect(() => {
        console.log("effecting");
        if(similarPaperData){
            storage.setItem("similarPaperData", JSON.stringify(similarPaperData));
        }else{
            storage.removeItem("similarPaperData");
        }
    }, [similarPaperData])

    /*handles the submission of a search */
    function handleSendSearch(event) {

        console.log("SUBMITTING SEARCH");
        if(event){
            event.preventDefault();
        }

        console.log("similarity search was called");
        //if query input is empty
        if (keywords === "" && !similarPaperFile) {
            alert("similar paper string is empty")
        }
        else {
            //synchronize the query data from react state hooks
            //if there isn't any file I search with the string
            if(!similarPaperFile){
                console.log("there isn't a file")
                queryData.query = keywords;
            }else{
                console.log("there's a file")
                queryData.query = "";
            }
            queryData.scopus = source.scopus;
            queryData.googleScholar = source.googleScholar;
            queryData.arXiv = source.arXiv;
            queryData.year = year;

            //send query url
            let queryString = createQueryStringFromObject(queryData);
            //launch to search
            history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router

        }


    }

    /**
     *handle to update hook state by input change on the form fields
     */
    function handleOnInputChange(event) {

        let newSource;

        switch (event.target.name) {
            case "query":
                setKeyWords(event.target.value);
                break;
            case "scopus":
                //copy the old source
                newSource = {...source};
                //switch between true and false
                newSource.scopus = !source.scopus;
                setSource(newSource);
                break;

            case "googleScholar":
                //copy the old source
                newSource = {...source};
                //switch between true and false
                newSource.googleScholar = !source.googleScholar;
                setSource(newSource);
                break;
            case "arXiv":
                //copy the old source
                newSource = {...source};
                //switch between true and false
                newSource.arXiv = !source.arXiv;
                setSource(newSource);
                break;
            case "year":
                setYear(event.target.value);
                break;
            default:
                break;
        }


    }

    /*
     #######################################
     need to  create a new child component for the part of <form>, when we have more information on search options
     ######################################
     */
    let formPart = (
        <>
            <form className={(queryData.query === "" && !similarPaperFile && !similarPaperData) ? 'search-form' : 'search-form small'}
                    style={{marginTop: (similarFormVisibility) ? "30px" : "60px"}}
                    onSubmit={handleSendSearch}>
                {/*search form*/}
                
                <SearchSimilarPapers style={{boxShadow: "0px 0px 3px -1px rgba(0, 0, 0, 0.25)"}}
                    project_id={project_id}
                    close={setSimilarFormVisibility} handler={handleOnInputChange} 
                    input={keywords} paperInfo={similarPaperData}
                    fetching={similarPaperFetch} setPaperInfo={setSimilarPaperData}
                    setPaperFile={setSimilarPaperFile}
                    history={history}/>
                
                <div className="option-holder">
                    <label>Source:</label><br/>

                    <div className="checkboxes-holder">
                        <CheckBox label="Scopus" name="scopus" val="" isChecked={source.scopus}
                                  handler={handleOnInputChange}/>
                        <CheckBox label="Google Scholar" name="googleScholar" val="" isChecked={source.googleScholar}
                                  handler={handleOnInputChange}/>
                        <CheckBox label="arXiv" name="arXiv" val="" isChecked={source.arXiv}
                                  handler={handleOnInputChange}/>
                    </div>

                    <label>Year:</label><br/>
                    <div className="checkboxes-holder" >
                        {
                            yearOptions.map((singleYear, index) =>
                                <RadioBox key={index} label={singleYear} name="year" val={singleYear}
                                          isChecked={year === singleYear} handler={handleOnInputChange}/>
                            )
                        }
                    </div>
                </div>
            </form>
        </>);


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

    /*function to add the post in the project*/
    async function handleAddPapers(event) {

        event.preventDefault();
        //console.log(selectedPapersList);

       //create a eidList from the list of selected paper
        let arrayEid = selectedPapersList.map(element => element.eid);
        //call dao
        let res = await projectPapersDao.postPaperIntoProject({
            "arrayEid": arrayEid, "project_id": project_id
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

        alert("insert completed");

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
                        <label>sort by:</label>
                        <Select options={orderByOptions}
                                selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)}
                                handler={handleSelection}/>
                        <button type="button" onClick={handelOrder}><OrderArrow display={true} up={(queryData.sort)}/></button>
                    </div>
                </div>
                <SelectedPapersListBox selectedPapersList={selectedPapersList}/>
                <div className="search-loading-holder">
                    <LoadIcon class={"small"}/>
                </div>
            </div>);
    }

    //if the search results list is empty
    else if (papersList.length === 0 && (queryData.query !== "" || similarPaperFile || similarPaperData)) {
        //the class is used only to workaround a small bug that display not found just as the search start before the loading icon
        resultPart = (
            <div className="not-found"> <NoSearchResults/> <p className="not-found-description"> Nothing was found </p> </div>
        );
    }
    else if (papersList.length > 0 && (queryData.query !== "" || similarPaperFile || similarPaperData)) {

        //create a eidList from the list of selected paper
        let arrayEid = selectedPapersList.map(element => element.eid);

        resultPart = (
            <div className="paper-card-holder">
                <div className="paper-card-holder-head">
                    <div className="select-all">
                    <CheckBox label="Select All" name="select_all" val="" isChecked={arrayOfObjectsContains(selectedPapersList, papersList, "eid")} handler={selectAllPapers}/>
                    </div>
                    <div className="order">
                        <label>sort by:</label>
                        <Select options={orderByOptions}
                                selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)}
                                handler={handleSelection}/>
                        <button type="button" onClick={handelOrder}><OrderArrow display={true} up={(queryData.sort)}/></button>
                    </div>
                </div>
                <SelectedPapersListBox selectedPapersList={selectedPapersList} handlePaperSelection={handlePaperSelection}/>

                <PrintScoupusSearchList papersList={papersList} handlePaperSelection={handlePaperSelection} selectedEidList={arrayEid}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </div>
        );
    }


    let output = (
        <>
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

    let orderBy = params.orderBy || "title";
    let sort = params.sort || "ASC";
    let start = params.start || 0;
    let count = params.count || 10;


    let scopus;
    if (params.scopus === undefined) {
        scopus = true;
    }
    else {
        scopus = (params.scopus === "true");
    }

    let googleScholar = (params.googleScholar === "true");
    let arXiv = (params.arXiv === "true");

    let year = params.year || "all";

    let queryData = {query, orderBy, sort, scopus, googleScholar, arXiv, year, start, count};

    return queryData;

}


export default SearchSimilarForm;