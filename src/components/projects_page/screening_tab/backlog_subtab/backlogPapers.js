import React, {useState, useEffect, useContext} from "react";
import {withRouter} from "react-router-dom";

import {paperDao} from 'dao/paper.dao';
import {projectFiltersDao} from 'dao/projectFilters.dao';

import LoadIcon from 'components/svg/loadIcon';
import Select from 'components/forms_elements/select';
import {PrintBacklogPapersList} from 'components/modules/printPapersList';
import OrderArrow from 'components/svg/orderArrow';
import Pagination from "components/modules/pagination";
import {createQueryStringFromObject, createQueryData, getIndexOfObjectArrayByKeyAndValue} from 'utils/index';

import {AppContext} from 'components/providers/appProvider'

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
var minConfidenceValues = [{label : "0.00", value: 0.0}];
//will keep valid maximum values
var maxConfidenceValues = [{label : "1.00", value: 1.0}];

//order options
const orderByOptions = [
    { value: 'date_created', label: 'Recently Added' },
    { value: 'title', label: 'Title' }
];

const queryParams = [
    {label: "orderBy", default: "date_created"},
    {label: "min_confidence", default: 0.0},
    {label: "max_confidence", default: 1.0},
    {label: "sort", default: "ASC"},
    {label: "start", default: 0},
    {label: "count", default: 10},
];

/**
 * the local component that manages the papers in the backlog of a project
 */
const BacklogPapers = ({project_id, match, location, history}) => {


    //fetch data
    const [papersList, setPapersList] = useState([]);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //filters
    const [filtersList, setFiltersList] = useState([]);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    const queryData = createQueryData(location.search, queryParams);

    const [up, setUp] = useState(queryData.sort);

    useEffect(() => {

        //flag that represents the state of component
        let  mnt = true;
        console.log(queryData);
        if(queryData.orderBy !== "date_created" && up !== queryData.sort){
            setUp(queryData.sort);
            console.log("calling animation")
            document.getElementById("ani-order-arrow").beginElement();
        }

        //a wrapper function ask by react hook
        const fetchData = async () => {
            //hide the page
            setDisplay(false);

            //max confidence that can be selected must be above the min value
            maxConfidenceValues = confidenceValues.filter(c => c.value > parseFloat(queryData.min_confidence));
            //min confidence that can be selected must be below the max value
            minConfidenceValues = confidenceValues.filter(c => c.value < parseFloat(queryData.max_confidence));

            //call the dao for getting the filters
            let res = await projectFiltersDao.getFiltersList({"project_id" : project_id});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setFiltersList([]);
            }
            //if the component is still mounted and  there are some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mnt && res) {
                //update state
                setFiltersList(res.results);
            }

            //call the dao for getting the papers
            let resx = await paperDao.searchAutomated({"project_id" : project_id, "start" : queryData.start, "count" : queryData.count,
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
            console.log(resx.results)
        }

        fetchData();

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mnt = false;
        };
    }, [queryData.start, queryData.count, queryData.sort, queryData.orderBy, queryData.min_confidence, queryData.max_confidence]); //re-execute when these variables change


    /*
        START OF 'RESULT PAPERS HANDLING' ########################################################
    */

    //handler for sort selection
    function handleSelection(e){
        let index = parseInt(e.target.getAttribute('data-value'));

        //if I previously ordered by 'most recent' then I sort the next order by ASC
        if(queryData.orderBy === "date_created"){
            queryData.sort = "ASC";
        }
        queryData.orderBy=orderByOptions[index].value;

        //update url
        let queryString = createQueryStringFromObject(queryData);
        history.push(queryString);
    }

    //handler for order selection(ASC|DESC)
    function handelOrder(e){
        console.log("doing my part")
        //trigger svg animation
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

    //handler for min confidence selection
    function handleMinConfidenceSelection(e) {
        //get index value
        let index = parseInt(e.target.getAttribute('data-value'));
        //get value by index
        queryData.min_confidence = minConfidenceValues[index].value;
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

    /*
        END OF 'RESULT PAPERS HANDLING' ########################################################
    */


    let output;
    //if the page is loading
    if (display === false) {
        //print loading image
        output = (
            <>
                <LoadIcon class={"small"}/>
            </>
        );
    }
    else {
        //print results
        output = (
            <>
                <PrintBacklogPapersList papersList={papersList} filtersList={filtersList}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </>
        );
    }

    output = (
        <div className="left-side-wrapper">
            <div className="paper-card-holder large">
                <div className="order">
                    <div className="order-flex-item">
                        <label>sort by:</label>
                        <Select options={orderByOptions} selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)} 
                            handler={handleSelection}
                            type={"medium"}
                            code={0}
                            />
                        <button type="button" onClick={handelOrder}><OrderArrow display={queryData.orderBy !== "date_created"} up={up}/></button>
                    </div>
                    <div className="order-flex-item">
                        <label>min confidence:</label>
                        <Select options={minConfidenceValues}
                                selected={getIndexOfObjectArrayByKeyAndValue(minConfidenceValues, "value", parseFloat(queryData.min_confidence))}
                                handler={handleMinConfidenceSelection}
                                //optional fields
                                type={"mini"} //displays select menu with a smaller width
                                code={1} //you can put here a random number in case you have multiple selects on the same page
                                            //this way you won't trigger the arrow animation for all the selects at the same time
                                />
                        <label>max confidence:</label>
                        <Select options={maxConfidenceValues}
                                selected={getIndexOfObjectArrayByKeyAndValue(maxConfidenceValues, "value", parseFloat(queryData.max_confidence))}
                                handler={handleMaxConfidenceSelection}
                                type={"mini"}
                                code={2}/>
                    </div>
                </div>
                {output}
            </div>
        </div>
    );

    return output;

};


export default withRouter(BacklogPapers);