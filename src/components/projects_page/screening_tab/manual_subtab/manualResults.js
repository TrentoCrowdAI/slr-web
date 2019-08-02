import React, {useState, useEffect, useContext} from "react";
import {withRouter, Link} from "react-router-dom";

import {projectPapersDao} from 'dao/projectPapers.dao';

import LoadIcon from 'components/svg/loadIcon';
import Select from 'components/forms_elements/select';
import {PrintManuallyScreenedPapersList} from 'components/modules/printPapersList';
import OrderArrow from 'components/svg/orderArrow';
import Pagination from "components/modules/pagination";
import {createQueryStringFromObject, createQueryData, getIndexOfObjectArrayByKeyAndValue} from 'utils/index';

import {AppContext} from 'components/providers/appProvider'


//order options
const orderByOptions = [
    { value: 'date_created', label: 'Most Recent' },
    { value: 'title', label: 'Title' }
];

const queryParams = [
    {label: "orderBy", default: "date_created"},
    {label: "sort", default: "ASC"},
    {label: "start", default: 0},
    {label: "count", default: 10},
];

/**
 * the local component that manages the papers which are partially screened in manual mode
 */
const ManualResults = ({project_id, match, location, history}) => {


    //list of papers to display
    const [papersList, setPapersList] = useState([]);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    const queryData = createQueryData(location.search, queryParams);

    //state for the sorting arrow animation
    const [up, setUp] = useState(queryData.sort);

    //effect for getting the list of papers on mount and query parameters changes
    useEffect(() => {

        //flag that represents the state of component
        let  mnt = true;

        //check sort parameter for animation
        if(queryData.orderBy !== "date_created" && up !== queryData.sort){
            setUp(queryData.sort);
            //trigger animation when sorting changes
            document.getElementById("ani-order-arrow").beginElement();
        }

        //a wrapper function ask by react hook
        const fetchData = async () => {
            //hide the page
            setDisplay(false);

            //call the dao for getting the papers
            let resx = await projectPapersDao.getPapersList({project_id, type:"manual", ...queryData});

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

        fetchData();

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mnt = false;
        };
    }, [queryData.start, queryData.count, queryData.sort, queryData.orderBy]); //re-execute when these variables change


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
                <PrintManuallyScreenedPapersList papersList={papersList}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </>
        );
    }

    output = (
        <>
            <div className="right-side-wrapper manual">
                <div className="top-right-description">
                    <p className="manual-description"> 
                    Here you can see the status of the manual
                    screening process. Below each paper you can see the votes related to it<br/>
                    <span className="color-code red-color">RED </span> voted no<br/>
                    <span className="color-code green-color">GREEN </span> voted yes<br/>
                    <span className="color-code blue-color">BLUE </span> voted undecided<br/>
                    </p>
                    <Link to={"/screenings/"+project_id+"/"}>(start your manual screening session)</Link>
                </div>
            </div>
            <div className="left-side-wrapper">
                <div className="paper-card-holder large">
                    <div className="order"
                    style={{
                        pointerEvents: (!display || papersList.length === 0) ? "none" : "",
                        opacity: (papersList.length === 0) ? "0.0" : "1.0"
                    }}
                    >
                        <div className="order-flex-item">
                            <label>sort by:</label>
                            <Select options={orderByOptions} selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)} 
                                handler={handleSelection}
                                type={"medium"}
                                code={0}
                                />
                            <button type="button" onClick={handelOrder} style={{display: (queryData.orderBy === "date_created") ? "none" : ""}}>
                                <OrderArrow up={up}/>
                            </button>
                        </div>
                    </div>
                    {output}
                </div>
            </div>
        </>
    );

    return output;

};


export default withRouter(ManualResults);