import React, {useState, useEffect, useContext, useRef} from "react";
import {withRouter} from 'react-router-dom';
import ClampLines from 'react-clamp-lines';

import {paperDao} from 'dao/paper.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'

import {createQueryData} from 'utils/index';


import MultiPredicateForm from "components/screenings_page/multiPredicateForm";
import Tags from 'components/modules/paperTags';

const queryParams = [
    {label: "question_id", default: ""}
]

/**
 * this is component form to search for the paper in project page
 * */

const MultiPredicateScreening = function ({project_id, filtersList, location, match, history}) {

    const mountRef = useRef(false);

    //fetch data
    const [paperData, setPaperData] = useState(undefined);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //decision variable
    const [decision, setDecision] = useState("");

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    let queryData = createQueryData(location.search, queryParams);


    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    //this will run on mount and every time the url params change
    useEffect(() => {

        //flag that represents the state of component
        let mnt = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {


            //if there is queryString from URL
            if (queryData.question_id !== "") {

                setDisplay(false);

                //always call the dao to search on scopus
                let res = await paperDao.search({"arXiv":"true","googleScholar":"false","scopus":"false","query":"a","searchBy":"all","orderBy":"title","sort":"ASC","year":"all","start":"0","count":"10"});

                //error checking
                //if the component is still mounted and  is 404 error
                if (mnt && res && res.message === "Not Found") {
                    setPaperData({title:"nothing here"});
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
                    console.log(res.results[2])
                    setPaperData(res.results[2]);
                    //show the page
                    setDisplay(true);
                }
            }
        };


        fetchData();
        

        //when the component will unmount or the useEffect will finish
        return () => {
            //set flag as unmounted
            mnt = false;
        };

    }, [project_id, queryData.question_id]);  //re-execute when these variables change

    let resultPart = "";

    //if is loading
    if (display === false && queryData.question_id !== "") {
        resultPart = (
                <LoadIcon/>
            );
    }

    else if (display && queryData.question_id !== "") {


        resultPart = (
            <>
                <div className="right-side-wrapper tags-holder" style={{flexDirection: "row"}}>
                    <Tags class="right"/>
                </div>
                <div className="left-side-wrapper s-paper">
                   <h2 className="paper-title">{paperData.title}</h2>
                   <div className="paragraph">
                       {paperData.abstract}
                   </div>
                </div>
                {(filtersList.length === 0) ? 
                    <p className="empty-filters-description"> There are no filters here, add new filters before starting here</p>
                    :
                    <>
                    <MultiPredicateForm filtersList={filtersList} mountRef={mountRef}/>
                    </>
                }
            </>
        );
    }


    let output = (
        <>
            <div className="multi-predicate-screening-wrapper">
                {resultPart}
            </div>
        </>
    );

    return output;
};


export default withRouter(MultiPredicateScreening);