import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from 'react-router-dom';

import {projectScreeningDao} from 'dao/projectScreening.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'


import MultiPredicateForm from "components/screenings_page/multiPredicateForm";
import HighLighter from 'components/modules/highlighter';
import Tags from 'components/modules/paperTags';

/**
 * this is component form to search for the paper in project page
 * */

const MultiPredicateScreening = function ({project_id, filtersList}) {

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

    //bool to trigger next paper fetch
    const [nextPaper, setNextPaper] = useState(false);


    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    useEffect(() =>{
        if(display){
            setPaperHeight(document.getElementsByClassName('s-paper')[0].clientHeight+20);
        }
    }, [display])

    //this will run on mount and every time the url params change
    useEffect(() => {

        //flag that represents the state of component
        let mnt = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            setDisplay(false);
            console.log("Fetching paper")
            //call dao for getting next paper
            let res = await projectScreeningDao.getProjectPaperToScreen(project_id);
            
            console.log(res);
            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setPaperData({data: {title:"Finished!", 
                abstract:(
                    <>There are no more papers to screen in this project<br/>
                        <Link to={"/screenings"}>Go back to screenings list</Link>
                    </>
                    )}});
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
                setPaperData(res);
                setHighlightedData([{data: res.data.abstract, start: 0, end: res.data.abstract.length-1, type:"not_highlighted"}])
                //show the page
                setDisplay(true);
            }
        };


        fetchData();
        

        //when the component will unmount or the useEffect will finish
        return () => {
            //set flag as unmounted
            mnt = false;
        };

    }, [project_id, nextPaper]);  //re-execute when these variables change

    function clearHighlights(type = "not_highlighted"){
        if(highlightedData && paperData){
            setHighlightedData([{data: paperData.data.abstract, start: 0, end: paperData.data.abstract.length-1, type: type}])
        }
    }
    let resultPart = "";
    let paperToDisplay = "";

    //if I don't have paper to display yet
    if(display === false){
        paperToDisplay = <LoadIcon class="small"/>
    }else if(paperData.data){
        paperToDisplay = (
            <>
                <h2 className="paper-title">{paperData.data.title}</h2>
                <HighLighter data={paperData.data.abstract} disabled={paperData.data.title==="Finished!"} className={"paragraph"} 
                    highlightedData={highlightedData} setHighlightedData={setHighlightedData}
                />
            </>
        )
    }

    resultPart = (
        <>
            <div className="right-side-wrapper tags-holder" style={{display: (paperData && paperData.data && paperData.data.title==="Finished!") ? "none" : ""}}>
                <Tags class="right" question_id={1} display={display}
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
                <MultiPredicateForm paperData={paperData}
                    tagsData={tagsData} nextPaper={nextPaper} setNextPaper={setNextPaper}
                    filtersList={filtersList} display={display} mountRef={mountRef}
                    clearHighlights={clearHighlights}
                    highlightedData={highlightedData} setHighlightedData={setHighlightedData}
                />
                </>
            }
        </>
    );

    let output = (
        <>
            <div className="multi-predicate-screening-wrapper">
                {resultPart}
            </div>
        </>
    );

    return output;
};


export default MultiPredicateScreening;