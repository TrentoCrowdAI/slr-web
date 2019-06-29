import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';

import {paperDao} from 'dao/paper.dao';
import {updateFileDao} from "dao/updateFile.dao";

import RadioBox from "components/forms_elements/radiobox";
import TargetPaper from "components/projects_page/search_tab/search_similar/targetPaper";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject} from 'utils/index';



// Load the lodash build
const _ = require('lodash');

//year options
const startYear = 2017;
const endYear = new Date().getFullYear() + 2;;
//create a int array from startYear to endYear, then convert it to string array, after this concatenate with "all"
const yearOptions = ["all", ...(_.range(startYear, endYear).map(String))];

/**
 * standard search form component
 */
const SearchSimilarForm = function ({history, queryData, project_id, targetPaperData, setTargetPaperData}){

    //bool to check mount status
    const [mounted, setMounted] = useState(true);

    //state for 'similar papers search' form
    const [similarFormVisibility, setSimilarFormVisibility] = useState(false);

    //bool for target similar paper fetching
    const [similarPaperFetch, setSimilarPaperFetch] = useState(false);

    //state for the form
    const [keywords, setKeyWords] = useState(queryData.query);
    const [year, setYear] = useState(queryData.year); //this is not used right now
    const [similarPaperFile, setSimilarPaperFile] = useState(undefined); //the file of the paper to search similarities for


    //get the localStorage object
    const storage = window.localStorage;

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {

        console.log("FETCHING TARGET PAPER")

        console.log(queryData);

        //fetches data when searching for similarities
        const fetchMainPaper = async () => {

            //standard options parameters
            setKeyWords(queryData.query);
            setYear(queryData.year);

            
            //if there's a file I can do an api call to parse it
            if(similarPaperFile){
                
                console.log("FILE NAME : " + similarPaperFile.name);

                //check file extension and its mine type
                if(!/\.(pdf|PDF)$/.test(similarPaperFile.name) || similarPaperFile.type.indexOf("application/pdf") === -1){
                    appConsumer.setNotificationMessage("The file must be a pdf!");
                }
                else{
                    //open flag of loading
                    setSimilarPaperFetch(true);
                    console.log("FETCHING PARSE PDF")
                    //prepare the form data for post
                    let formData = new FormData();
                    formData.append('file', similarPaperFile);

                    //call the dao
                    console.log("CALLING THE PAPER PARSER SERVICE")
                    let res = await updateFileDao.updatePdf(formData);
    
                    //if there is a error
                    if (mounted && res && res.message) {
                        //pass error object to global context
                        appConsumer.setNotificationMessage("Error during parsing file");
                        setSimilarPaperFetch(false);
                    }
                    else if(mounted){
                        console.log(res);
                        //set paperdata(which whill call the useEffect on the paperData)
                        setTargetPaperData(res);
                        //display the paper data
                        setSimilarPaperFetch(false);
                    }

                }
            }
            //if there's a query I can retrieve similar papers based on the query
            else if (queryData.query !== "") {
                
                setSimilarPaperFetch(true);
                //this will be the call to the service identifying a specific paper
                let resx = await paperDao.search({"query" : queryData.query, "scopus": true});


                //if there is a error
                if (mounted && resx && resx.message) {
                    //pass error object to global context
                    appConsumer.setError(resx);
                }else if(mounted){
                    //set paperdata(which whill call the useEffect on the paperData)
                    setTargetPaperData(resx.results[0]);
                    setSimilarPaperFetch(false);

                }
            }
            else{
                console.log("no file (& no similarPaperString)");
            }

        };

        if(!targetPaperData){
            fetchMainPaper();
        }

        //when the component will unmount
        return () => {
            console.log("unmounting searchSimilar component")
            localStorage.removeItem("targetPaperData");
            setMounted(false);
        };

    }, [project_id, similarPaperFile, queryData.query, queryData.year]);  //re-execute when these variables change

    /**
     * effect to handle live update on year change
     */
    useEffect(() => {
        queryData.year = year;

        //send query url
        let queryString = createQueryStringFromObject(queryData);
        //launch to search
        history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router
        
    }, [year])

    /**
     *handle to update hook state by input change
     */
    function handleOnInputChange(event) {

        switch (event.target.name) {
            case "query":
                setKeyWords(event.target.value);
                break;
            case "year":
                setYear(event.target.value);
                break;
            default:
                break;
        }
        

    }

    /*function to send the query*/
    async function handleSendSearch(event) {

        console.log("SUBMITTING SEARCH");
        if(event){
            event.preventDefault();
        }

        console.log("similarity search was called");
        //if query input is empty
        if (keywords === "" && !similarPaperFile) {
            appConsumer.setNotificationMessage("Similar paper string is empty")
        }
        else {
            //synchronize the query data from react state hooks
            //if there isn't any file I search with the string
            if(!similarPaperFile){
                console.log("there isn't a file")
                queryData.query = keywords;
            }else{
                console.log("there's a file")
                queryData.query = "";
            }
            queryData.year = year;

            //send query url
            let queryString = createQueryStringFromObject(queryData);
            //launch to search
            history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router

        }


    }

    return (
        <>
            <form className={(queryData.query === "" && !similarPaperFile && !targetPaperData) ? 'search-form' : 'search-form small'}
                    style={{marginTop: (similarFormVisibility) ? "30px" : "60px"}}
                    onSubmit={handleSendSearch}>
                {/*search form*/}
                
                <TargetPaper style={{boxShadow: "0px 0px 3px -1px rgba(0, 0, 0, 0.25)"}}
                    project_id={project_id}
                    close={setSimilarFormVisibility} handler={handleOnInputChange} 
                    input={keywords} paperInfo={targetPaperData}
                    fetching={similarPaperFetch} setPaperInfo={setTargetPaperData}
                    setPaperFile={setSimilarPaperFile}
                    history={history}/>
                
                {/*<div className="option-holder">

                    <label>Year:</label><br/>
                    <div className="checkboxes-holder" >
                        {
                            yearOptions.map((singleYear, index) =>
                                <RadioBox key={index} label={singleYear} name="year" val={singleYear}
                                          isChecked={year === singleYear} handler={handleOnInputChange}/>
                            )
                        }
                    </div>
                </div>*/}
            </form>
            <div className={(similarPaperFetch || targetPaperData) ? "top-right-side-wrapper search-similar-description-wrapper" : "center-side-wrapper search-similar-description-wrapper"}>
                <div className="search-similar-description">
                    <p>This searching mode leverages AI to find relevant papers based on the topic and focus of the given paper.</p>
                    <Link to={"/projects/"+project_id+"/search"}>(Go back to a normal search)</Link>
                </div>
            </div>
        </>
    );

};




export default SearchSimilarForm;