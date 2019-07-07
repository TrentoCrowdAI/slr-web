import React, {useState, useEffect, useContext, useRef} from "react";
import {withRouter} from 'react-router-dom';
import ClampLines from 'react-clamp-lines';
import KeyboardEventHandler from 'react-keyboard-event-handler';

import {paperDao} from 'dao/paper.dao';

import LoadIcon from 'components/svg/loadIcon';

import {AppContext} from 'components/providers/appProvider'

import {createQueryData} from 'utils/index';


import FiltersAccordion from "components/modules/filtersAccordion";
import Tags from 'components/modules/paperTags';

const queryParams = [
    {label: "question_id", default: ""}
]

/**
 * this is component form to search for the paper in project page
 * */

const SinglePredicateScreening = function ({project_id, filtersList, location, match, history}) {

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


    async function handleSubmission(key){

        console.log("key " + key);

        switch (key) {
            case "left":
                console.log("NO");
                setDecision("no");
                break;
            case "right":
                console.log("YES");
                setDecision("yes");
                break;
            case "down":
                console.log("UND");
                setDecision("und");
                break;
            default:
                break;
        }
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
                <KeyboardEventHandler handleKeys={['left', 'down', 'right']}  handleFocusableElements onKeyEvent={(key) => handleSubmission(key)} />
                <div className="right-side-wrapper filters">
                    <h2>Filters:</h2>
                    <FiltersAccordion filtersList={filtersList}/>
                </div>
                <div className="left-side-wrapper s-paper">
                   <h2 className="paper-title">{paperData.title}</h2>
                   <ClampLines
                        text={paperData.abstract}
                        lines={10}
                        ellipsis="..."
                        className="paragraph"
                        moreText="more"
                        lessText="less"
                    />
                </div>
                <Tags/>
                <form className="light-modal screening-outcome">
                    <h2 className="question">Is the paper relevant to the review?</h2>
                    <div className="screening-choice">
                        <div className="yes-no">
                            <button className="no" style={{backgroundColor: (decision === "no") ? "grey" : ""}}>

                            </button>
                            <button className="yes" style={{backgroundColor: (decision === "yes") ? "grey" : ""}}>
                                
                            </button>
                        </div>
                        <div className="und">
                            <button className="und" style={{backgroundColor: (decision === "und") ? "grey" : ""}}>

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