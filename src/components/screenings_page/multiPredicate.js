import React, {useState, useEffect, useContext, useRef} from "react";
import {Link} from 'react-router-dom';

import {projectScreeningDao} from 'dao/projectScreening.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'


import MultiPredicateForm from "components/screenings_page/multiPredicateForm";
import HighLighter from 'components/modules/highlighter';
import Tags from 'components/modules/paperTags';

const _array = require('lodash/array');

/**
 * multi-predicate screening page
 * */

const MultiPredicateScreening = function ({screening, filtersList}) {

    const mountRef = useRef(false);

    //paper to screen data
    const [paperData, setPaperData] = useState(undefined);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //paper wrapper-height js animation
    const [paperHeight, setPaperHeight] = useState(220)

    //highlighted data
    const [highlightedData, setHighlightedData] = useState([]);

    //selected tags
    const [selectedTags, setSelectedTags] = useState([]);

    //available tags (there's no need to re-render the page when these changes because they're hidden, that's why I use useRef)
    const availableTags = useRef(screening.data.tags);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //bool to trigger next paper fetch
    const [nextPaper, setNextPaper] = useState(false);

    //component lifecycle hook
    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    //effect for updating the paper wrapper height once it's displayed
    useEffect(() =>{
        if(display){
            setPaperHeight(document.getElementsByClassName('s-paper')[0].clientHeight+20);
        }
    }, [display])

    //this will run on mount and every time the user votes a paper so we ask for a new one to vote
    useEffect(() => {

        //flag that represents the state of component
        let mnt = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //I hide the page before fetching a new paper
            setDisplay(false);

            //I reset the tags
            availableTags.current = _array.union(availableTags.current, selectedTags);
            setSelectedTags([]);

            //call dao for getting next paper
            let res = await projectScreeningDao.getProjectPaperToScreen(screening.id);

            //error checking
            //if the component is still mounted and  is 404 error it means there are no more papers to screen
            if (mnt && res && res.message === "Not Found") {

                //I create a 'fake' paper data so the user knows he's done
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
            //otherwise it means I got a paper to screen
            else if (mnt && res) {

                //I set the paper
                setPaperData(res);
                //and reset the highlighted data
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

    }, [screening, nextPaper]);  //re-execute when these variables change

    //function to clear highlights
    function clearHighlights(type = "not_highlighted"){
        if(highlightedData && paperData){
            setHighlightedData([{data: paperData.data.abstract, start: 0, end: paperData.data.abstract.length-1, type: type}])
        }
    }

    //page parts
    let resultPart = <></>;
    let paperToDisplay = <></>;

    //if I don't have paper to display yet
    if(display === false){
        //I display a loading icon
        paperToDisplay = <LoadIcon class="small"/>
    }
    //otherwise
    else if(paperData.data){
        //I display the paper
        paperToDisplay = (
            <>
                <h2 className="paper-title">{paperData.data.title}</h2>
                <HighLighter data={paperData.data.abstract} disabled={paperData.data.title==="Finished!"} className={"paragraph"} 
                    highlightedData={highlightedData} setHighlightedData={setHighlightedData}
                />
            </>
        )
    }

    //I create the resulting page to display
    resultPart = (
        <>
            <div className="right-side-wrapper tags-holder" style={{display: (paperData && paperData.data && paperData.data.title==="Finished!") ? "none" : ""}}>
                <Tags className={"right"} display={display} selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                    availableTags={availableTags}
                />
            </div>
            
            {/*div wrapper to set height animation*/}
            <div style={{height: paperHeight+"px",overflow:"hidden", transition: "all 0.5s linear"}}>
                {/*content of the animated div*/}
                <div className="left-side-wrapper s-paper">
                {paperToDisplay}
                </div>
            </div>

            {/*I check whether there are filters*/}
            {(filtersList.length === 0) ? 
                <p className="empty-filters-description"> There are no filters here, add new filters before starting here</p>
                :
                <>
                <MultiPredicateForm paperData={paperData}
                    tagsData={selectedTags} nextPaper={nextPaper} setNextPaper={setNextPaper}
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