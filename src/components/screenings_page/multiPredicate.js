import React, {useState, useEffect, useContext, useRef} from "react";
import {withRouter} from 'react-router-dom';
import ClampLines from 'react-clamp-lines';

import {paperDao} from 'dao/paper.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'

import {createQueryData} from 'utils/index';


import MultiPredicateForm from "components/screenings_page/multiPredicateForm";
import HighLighter from 'components/modules/highlighter';
import Tags from 'components/modules/paperTags';

const queryParams = [
    {label: "question_id", default: ""}
]

/**
 * this is component form to search for the paper in project page
 * */

const MultiPredicateScreening = function ({project_id, filtersList, filtersFetch, location, match, history}) {

    const mountRef = useRef(false);

    //fetch data
    const [paperData, setPaperData] = useState(undefined);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //paper wrapper-height js animation
    const [paperHeight, setPaperHeight] = useState(220)

    //highlighted data
    const [highlightedData, setHighlightedData] = useState([]);

    //tags data
    const [tagsData, setTagsData] = useState([]);

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

    useEffect(() =>{
        if(!filtersFetch && display){
            setPaperHeight(document.getElementsByClassName('s-paper')[0].clientHeight+20);
        }
    }, [display, filtersFetch])

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

                console.log(res);
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
                    //console.log(res.results[2])
                    setPaperData(res.results[queryData.question_id]);
                    setHighlightedData([{data: res.results[queryData.question_id].abstract, start: 0, end: res.results[queryData.question_id].abstract.length-1, type:"not_highlighted"}])
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

    function clearHighlights(type = "not_highlighted"){
        if(highlightedData && paperData){
            setHighlightedData([{data: paperData.abstract, start: 0, end: paperData.abstract.length-1, type: type}]);
        }
    }
    let resultPart = "";
    let paperToDisplay = "";

    //if I don't have paper to display yet
    if(display === false  && queryData.question_id !== ""){
        paperToDisplay = <LoadIcon class="small"/>
    }else if(paperData){
        paperToDisplay = (
            <>
                <h2 className="paper-title">{paperData.title}</h2>
                <HighLighter data={paperData.abstract} className={"paragraph"} 
                    highlightedData={highlightedData} setHighlightedData={setHighlightedData}
                />
            </>
        )
    }

    //if is loading filters
    if (filtersFetch) {
        resultPart = (
                <LoadIcon/>
            );
    }

    else{


        resultPart = (
            <>
                <div className="right-side-wrapper tags-holder">
                    <Tags class="right" question_id={queryData.question_id} display={display}
                        setTagsData={setTagsData}
                    />
                </div>
                {/*div wrapper to set height animation*/}
                <div style={{height: paperHeight+"px",overflow:"hidden", transition: "all 0.5s linear"}}>
                    {/*content of the animated div*/}
                    <div className="left-side-wrapper s-paper">
                    {paperToDisplay}
                    </div>
                </div>
                {(filtersList.length === 0) ? 
                    <p className="empty-filters-description"> There are no filters here, add new filters before starting here</p>
                    :
                    <>
                    <MultiPredicateForm filtersList={filtersList} display={display} mountRef={mountRef}
                        clearHighlights={clearHighlights}
                        highlightedData={highlightedData} setHighlightedData={setHighlightedData}
                    />
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