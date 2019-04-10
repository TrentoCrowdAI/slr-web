import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from 'react-router-dom'
import ClampLines from 'react-clamp-lines';
import queryString from "query-string";


import {paperDao} from 'src/dao/paper.dao';
import {projectPapersDao} from 'src/dao/projectPapers.dao'

import CheckBox from "src/components/forms/checkbox";
import RadioBox from "src/components/forms/radiobox";
import LoadIcon from 'src/components/svg/loadIcon';
import SearchButton from 'src/components/svg/searchButton';
import {PrintScoupusSearchList} from 'src/components/papers/printPapersList';
import Select from 'src/components/forms/select';
import OrderArrow from 'src/components/svg/orderArrow';
import Pagination from "src/components/modules/pagination";

import {searchCheckboxesToParams, join, createQueryStringFromObject,getIndexOfObjectArrayByKeyAndValue} from 'src/utils/index';

import {AppContext} from 'src/components/providers/appProvider'

// Load the lodash build
var _ = require('lodash');

//order options
const orderByOptions = [
    { value: 'title', label: 'Title' },
    { value: 'date', label: 'Date' }
  ];

//search by  options
const searchByOptions = ["all", "author", "content"];

//year options
const startYear = 2017;
const endYear = 2020;

/**
 * this is component form to search for the paper in project page
 * */

const SearchForm = function ({project_id, location, match, history}) {


    //fetch data
    const [papersList, setPapersList] = useState([]);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(true);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //get data from global context
    const appConsumer = useContext(AppContext);


    //set query params from url
    let queryData = createQueryData(location.search);
    console.log(queryData);

    //selected list of papers
    let selectedPapers = [];


    useEffect(() => {

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //hide the page

            //if there is queryString from URL
            if (queryData.query !== "") {

                setDisplay(false);

                //always call the dao to search on scopus
                let res = await paperDao.search(queryData);

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
            }


        };

        fetchData();

    }, [project_id, queryData.query, queryData.orderBy, queryData.searchBy, queryData.sort, queryData.year, queryData.start, queryData.count,  queryData.scopus, queryData.googleScholar, queryData.arXiv]);  //re-execute when these variables change


    //handler for sort selection
    function handleSelection(e){
        //get index
        let index = parseInt(e.target.getAttribute('data-value'));
        //get value by index
        queryData.orderBy=orderByOptions[index].value;
        //update url
        let queryString = createQueryStringFromObject(queryData);
        history.push(queryString);

    }

    //handler for order selection(ASC|DESC)
    function handelOrder(e){
        //trigger svg animation
        document.getElementById("ani-order-arrow").beginElement();

        if(queryData.sort === "ASC"){
            queryData.sort = "DESC";
        }
        else{
            queryData.sort = "ASC";
        }
        //update url
        let queryString = createQueryStringFromObject(queryData);
        history.push(queryString);
    }


    /*function to insert and remove the paper id from selected list*/
    function handlePaperSelection(event) {
        let id = event.target.value;
        //if id is not included in the list yet
        if (!selectedPapers.includes(id)) {
            //insert into array
            selectedPapers.push(id);

        }
        //if id already exists in the list
        else {
            //remove the  target paper id
            selectedPapers = selectedPapers.filter(function (value) {
                return value !== id;
            });
        }
    }

    /*function to add the post in the project*/
    async function handleAddPapers(event) {

        event.preventDefault();

        //console.log(selectedPapers);
        //for to insert papers into DB
        
        //call dao
        let res = await projectPapersDao.postPaperIntoProject({
            arrayEid: selectedPapers, project_id: project_id
        });
        //if there is the error
        if (res.message) {
            //pass error object to global context
            appConsumer.setError(res);
            return null;
        }

        alert("insert completed");
        window.location.reload();
    }


    /*function to send the query*/
    async function handleSendSearch(event) {

        event.preventDefault();
        //if query input is empty
        if (queryData.query === "") {
            alert("search string is empty")
        }
        else {

            //update url
            let queryString = createQueryStringFromObject(queryData);
            //launch to search
            history.push(queryString);

        }

    }

    /**
     *synchronizes the value between queryData and input form
     */
    function handleOnInputChange(event){

        switch (event.target.name) {
            case "query":
                queryData.query=event.target.value;
                break;
            case "Scopus":
                //switch between true and false
                if(queryData.scopus ==="false"){
                    queryData.scopus = "true";
                }
                else{
                    queryData.scopus = "false";
                }
                break;
            case "Google Scholar":
                //switch between true and false
                if(queryData.googleScholar ==="false"){
                    queryData.googleScholar = "true";
                }
                else{
                    queryData.googleScholar = "false";
                }
                break;
            case "arXiv":
                //switch between true and false
                if(queryData.arXiv ==="false"){
                    queryData.arXiv = "true";
                }
                else{
                    queryData.arXiv = "false";
                }
                break;
            case "searchBy":
                queryData.searchBy=event.target.value;
                break;
            case "year":
                //if value is "all", deletes the year property
                if(event.target.value==="all"){
                    delete queryData.year;
                }
                //else get year value
                else{
                    queryData.year=event.target.value;
                }
                break;
        }


    }

    /*
     #######################################
     need to  create a new child component for the part of <form>, when we have more information on search options
     ######################################
     */
    let formPart = (//creare un componente a part
        <>{}
            <form className={(queryData.query === "") ? 'search-form' : 'search-form small'}
                  onSubmit={handleSendSearch}>
                {/*search form*/}
                <div style={{position: 'relative'}}>
                    <input
                        type="text"
                        placeholder="search"
                        name="query"
                        defaultValue={queryData.query}
                        onChange={handleOnInputChange}
                    />
                    <button type="submit" value="Submit">
                        <SearchButton/>
                    </button>
                </div>

                <div className="option-holder">
                    <label>Source:</label><br/>

                    <div className="checkboxes-holder">
                        <CheckBox label="Scopus" val="" isChecked={queryData.scopus==="true" } handler={handleOnInputChange}/>
                        <CheckBox label="Google Scholar" val="" isChecked={queryData.googleScholar ==="true"} handler={handleOnInputChange}/>
                        <CheckBox label="arXiv" val="" isChecked={queryData.arXiv ==="true"} handler={handleOnInputChange}/>
                    </div>

                    <label>Search by:</label><br/>

                    <div className="checkboxes-holder" onChange={handleOnInputChange}>
                        <RadioBox label={searchByOptions[0]} name ="searchBy" val={searchByOptions[0]} isChecked={queryData.searchBy===searchByOptions[0]} />
                        <RadioBox label={searchByOptions[1]} name ="searchBy" val={searchByOptions[1]} isChecked={queryData.searchBy===searchByOptions[1]} />
                        <RadioBox label={searchByOptions[2]} name ="searchBy"  val={searchByOptions[2]} isChecked={queryData.searchBy===searchByOptions[2]} />
                    </div>

                    <label>Year:</label><br/>
                    <div className="checkboxes-holder" onChange={handleOnInputChange}>
                        <RadioBox label={"all"} name ="year" val={"all"} isChecked={queryData.year==="all"} />
                        {
                            _.range(startYear,endYear).map((year, index)=>
                                <RadioBox key={index} label={year} name ="year" val={year} isChecked={parseInt(queryData.year)===year} />
                            )
                        }
                    </div>
                </div>

            </form>
        </>);


    let resultPart="";

    //if the search results list is empty
    if (display === true && papersList.length === 0 && queryData.query !== "") {
        //the class is used only to workaround a small bug that display not found just as the search start before the loading icon
        resultPart = (
            <div className="not-found"> not found :( </div> 
        );
    }
    else if(papersList.length > 0 && queryData.query !== ""){


        let printList = (<PrintScoupusSearchList papersList={papersList} handlePaperSelection={handlePaperSelection}/>);


        resultPart = (
            <div className="paper-card-holder">
                <div className="order">
                        <label>sort by:</label>
                        <Select options={orderByOptions} selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value",queryData.orderBy)} handler={handleSelection}/>
                        <button type="button" onClick={handelOrder}><OrderArrow up={(queryData.sort)}/></button>
                </div>
                {printList}
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
                <button className="bottom-left-btn" type="submit" value="Submit">
                    +
                </button>
            </div>
        );
    }

    //if is loading
    if (display === false) {

        resultPart = (
            <div className="paper-card-holder">
                <div className="order" style={{pointerEvents: "none"}}>{/* this way the user cannot sort while loading the results */}
                        <label>sort by:</label>
                        <Select options={orderByOptions} selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value",queryData.orderBy)} handler={handleSelection}/>
                        <button type="button" onClick={handelOrder}><OrderArrow up={(queryData.sort)}/></button>
                </div>
                <div className="search-loading-holder">
                    <LoadIcon class={"small"}/>
                </div>
            </div>);
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
 * internal function to prepare a object of queryData
 * @param queryUrl
 * @return object of queryData for the fetch
 */
function createQueryData(queryUrl){



    //set query params from queryString of url
    let params = queryString.parse( queryUrl);
    let query = params.query || "";

    let searchBy = params.searchBy || "all";
    let orderBy = params.orderBy || "title";
    let sort = params.sort || "ASC";
    let start = params.start || 0;
    let count = params.count || 10;

    let scopus = params.scopus || "false";
    let googleScholar = params.googleScholar|| "false";
    let arXiv = params.arXiv|| "false";

    let year = params.year || "all";

    let queryData = {query, searchBy,orderBy, sort, scopus ,googleScholar,arXiv, start, count };
    //set year property only when year value is not "all"
    if(year !== "all"){
        queryData.year = year;
    }


    return queryData;

}


export default SearchForm;