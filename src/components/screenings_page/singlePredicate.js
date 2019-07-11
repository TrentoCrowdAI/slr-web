import React, {useState, useEffect, useContext, useRef} from "react";
import {withRouter} from 'react-router-dom';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import {paperDao} from 'dao/paper.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'

import {createQueryData} from 'utils/index';


import FiltersAccordion from "components/modules/filtersAccordion";
import Tags from 'components/modules/paperTags';
import HighLighter from 'components/modules/highlighter';
import InfoTooltip from "components/modules/infoTooltip";

const queryParams = [
    {label: "question_id", default: ""}
]

/**
 * this is component form to search for the paper in project page
 * */

const SinglePredicateScreening = function ({project_id, filtersList, filtersFetch, location, match, history}) {

    const mountRef = useRef(false);

    //fetch data
    const [paperData, setPaperData] = useState(undefined);

    //paper wrapper-height js animation
    const [paperHeight, setPaperHeight] = useState(220)

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //decision variable
    const [decision, setDecision] = useState("");

    //highlighted data
    const [highlightedData, setHighlightedData] = useState(undefined);

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
                    setPaperData(res.results[queryData.question_id]);
                    setHighlightedData([{data: res.results[queryData.question_id].abstract, start: 0, end: res.results[queryData.question_id].abstract.length-1, type:"not_highlighted"}])
                    //setHighlightedData([{data: res.results[queryData.question_id].abstract, start: 0, end: res.results[queryData.question_id].abstract.length-1, type:"not_highlighted"}]);
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

    useEffect(() =>{
        if(!filtersFetch && display){
            setPaperHeight(document.getElementsByClassName('s-paper')[0].clientHeight+20);
        }
    }, [display, filtersFetch])

    async function sendSubmission(key) {
        let screeningData = {outcome: "", highlights: highlightedData, tags: tagsData};

        switch (key) {
            case "a":
                console.log("NO");
                setDecision("no");
                screeningData.outcome = "no";
                break;
            case "s":
                console.log("YES");
                setDecision("yes");
                screeningData.outcome = "yes";
                break;
            case "d":
                console.log("UND");
                setDecision("und");
                screeningData.outcome = "und";
                break;
            default:
                break;
        }
        console.log("data to send _> ");
        console.log(screeningData)
        /*
        //call the dao
        let res = await projectsDao.deleteProject(id);

        //empty string is the response from the dao layer in case of success(rember that empty string is a falsy value)
        if(mountRef.current && res === ""){
            //create a new array without the project deleted
            let newProjectsList = projectsList.filter((project)=>project.id !== id);
            //update project list state
            setProjectsList(newProjectsList);

            appConsumer.setNotificationMessage("Successfully deleted");
        }
        //error checking
        //if is other error
        else if (mountRef.current && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);  
        }
        */
        //history.push(match.url + "?question_id=" + "9");
    }
    function handleKey(key){
        if(document.activeElement.type !== "text" && display){
            sendSubmission(key);
        }
    }

    let resultPart = "";
    let paperToDisplay = "";

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

    //if is loading
    if (filtersFetch) {
        resultPart = (
                <LoadIcon/>
            );
    }

    else {


        resultPart = (
            <>
                <KeyboardEventHandler handleKeys={['a', 's', 'd']}  handleFocusableElements onKeyEvent={(key) => handleKey(key)} />
                <div className="right-side-wrapper filters">
                    <h2>Filters:</h2>
                    <FiltersAccordion filtersList={filtersList}/>
                </div>
                {/*div wrapper to set height animation*/}
                <div style={{height: paperHeight+"px",overflow:"hidden", transition: "all 0.5s linear"}}>
                    {/*content of the animated div*/}
                    <div className="left-side-wrapper s-paper">
                        {paperToDisplay}
                    </div>
                </div>
                <Tags question_id={queryData.question_id} display={display}
                    setTagsData={setTagsData}
                />
                <form className="light-modal screening-outcome">
                    <InfoTooltip className={"s-p-form"}>
                        You can cast your vote by using the keyboard:<br/>
                        <b>A : </b> <i>no</i><br/>
                        <b>S : </b> <i>yes</i><br/>
                        <b>D : </b> <i>undecided</i><br/>
                    </InfoTooltip>
                    <h2 className="question">Is the paper relevant to the review?</h2>
                    <p className="hl-tip">Please highlight in the text the evidence that supports your answer</p>
                    <div className="screening-choice">
                        <div className="yes-no-und">
                            <button className="no" style={{backgroundColor: (decision === "no") ? "grey" : ""}}
                                onClick={() => {handleKey("a")}}
                            >

                            </button>
                            <button className="yes" style={{backgroundColor: (decision === "yes") ? "grey" : ""}}
                                onClick={() => {handleKey("s")}}
                            >
                                
                            </button>
                            <button className="und" style={{backgroundColor: (decision === "und") ? "grey" : ""}}
                                onClick={() => {handleKey("d")}}
                            >

                            </button>
                        </div>

                    </div>
                </form>
            </>
        );
    }


    let output = (
        <>
            <div className="single-predicate-screening-wrapper">
                {resultPart}
            </div>
        </>
    );

    return output;
};


export default withRouter(SinglePredicateScreening);