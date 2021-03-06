import React, {useState, useEffect, useContext} from "react";
import queryString from "query-string";

import {projectPapersDao} from 'dao/projectPapers.dao';

import LoadIcon from 'components/svg/loadIcon';
import {PrintPapersList} from 'components/modules/printPapersList';
import Select from 'components/forms_elements/select';
import OrderArrow from 'components/svg/orderArrow';
import Pagination from "components/modules/pagination";
import {createQueryData, createQueryStringFromObject, getIndexOfObjectArrayByKeyAndValue} from 'utils/index';

import {AppContext} from 'components/providers/appProvider'




//order options
const orderByOptions = [
    { value: 'date_created', label: 'Recently Added' },
    { value: 'title', label: 'Title' },
    { value: 'authors', label: 'Authors' }
  ];

const queryParams = [
    {label: "orderBy", default: "date_created"},
    {label: "sort", default: "ASC"},
    {label: "start", default: 0},
    {label: "count", default: 10},
]

/**
 * the local component that shows the papers list of a project
 */
const PapersList = ({project_id, location, match, history, forcePapersFetch}) => {


    //fetch data
    const [papersList, setPapersList] = useState([]);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

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
        if(queryData.orderBy !== "date_created" && up !== queryData.sort){
            setUp(queryData.sort);
            document.getElementById("ani-order-arrow").beginElement();
        }

        //a wrapper function ask by react hook
        const fetchData = async () => {
            //hide the page
            setDisplay(false);

            //call the dao
            let res = await projectPapersDao.getPapersList({project_id, type: "all", ...queryData});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setPapersList([]);
                setTotalResults(0);
                //show the page
                setDisplay(true);
            }
            //if the component is still mounted and  there are some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mnt && res) {

                //update state
                setPapersList(res.results);
                setTotalResults(res.totalResults);
                //show the page
                setDisplay(true);
            }

        };
        fetchData();

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mnt = false;
        };
    }, [queryData.start, queryData.count, queryData.sort, queryData.orderBy, forcePapersFetch]); //re-execute when these variables change


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



    let output;
    //if the page is loading
    if (display === false) {
        //print loading image
        output = (
            <>
                <LoadIcon class={"small"}/>
            </> );
    }
    else {

        output = (
            <>
                <PrintPapersList papersList={papersList} location={location} history={history}/>
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={match.url}/>
            </>
        );
    }

    output = (
        <div className="left-side-wrapper">
            <div className="paper-card-holder">
                <div className="order" 
                    style={{
                        pointerEvents: (!display || papersList.length === 0) ? "none" : "",
                        opacity: (papersList.length === 0) ? "0.0" : "1.0"
                    }}>
                    <div className="order-flex-item">
                        <label>sort by:</label>
                        <Select options={orderByOptions} selected={getIndexOfObjectArrayByKeyAndValue(orderByOptions, "value", queryData.orderBy)} handler={handleSelection}/>
                        <button type="button" onClick={handelOrder} style={{display: (queryData.orderBy === "date_created") ? "none" : ""}}>
                            <OrderArrow up={up}/>
                        </button>
                    </div>
                </div>
                {output}
            </div>
        </div>
    );

    return output;

};


export default PapersList;