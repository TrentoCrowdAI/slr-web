import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';

import {paperDao} from 'dao/paper.dao';
import {updateFileDao} from "dao/updateFile.dao";

import TargetPaper from "components/projects_page/search_tab/search_similar/targetPaper";

import {AppContext} from 'components/providers/appProvider'

import {createQueryStringFromObject} from 'utils/index';



/**
 * standard search form component
 */
const SearchSimilarForm = function ({history, queryData, project_id, targetPaperData, setTargetPaperData}){

    //state for 'similar papers search' form
    const [similarFormVisibility, setSimilarFormVisibility] = useState(false);

    //bool for target similar paper fetching
    const [similarPaperFetch, setSimilarPaperFetch] = useState(false);

    //state for the form
    const [keywords, setKeyWords] = useState(queryData.query);
    //const [year, setYear] = useState(queryData.year); //this is not used right now
    const [targetPaperFile, setTargetPaperFile] = useState(undefined); //the file of the paper to search similarities for


    //get the localStorage object
    const storage = window.localStorage;

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {

        let mnt = true;

        console.log("FETCHING TARGET PAPER")

        console.log(queryData);

        //fetches data when searching for similarities
        const fetchMainPaper = async () => {

            if(mnt){

                //standard options parameters
                setKeyWords(queryData.query);
                //setYear(queryData.year);
                setTargetPaperData(undefined);
            }

            
            //if there's a file I can do an api call to parse it
            if(targetPaperFile && queryData.query === ""){
                
                console.log("FILE NAME : " + targetPaperFile.name);

                //check file extension and its mine type
                if(!/\.(pdf|PDF)$/.test(targetPaperFile.name) || targetPaperFile.type.indexOf("application/pdf") === -1){
                    appConsumer.setNotificationMessage("The file must be a pdf!");
                }
                else{
                    //open flag of loading
                    setSimilarPaperFetch(true);
                    console.log("FETCHING PARSE PDF")
                    //prepare the form data for post
                    let formData = new FormData();
                    formData.append('file', targetPaperFile);

                    //call the dao
                    console.log("CALLING THE PAPER PARSER SERVICE")
                    let res = await updateFileDao.updatePdf(formData);
    
                    //if there is a error
                    if (mnt && res && res.message) {
                        //pass error object to global context
                        appConsumer.setNotificationMessage("Error during parsing file");
                        setSimilarPaperFetch(false);
                        setTargetPaperData(undefined);//I delete the similar paper info
                        setTargetPaperFile(undefined);//I delete its file
                    }
                    else if(mnt){
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
                //if is 404 error
                if (mnt && resx && resx.message === "Not Found") {
                    setTargetPaperData({title:"unable to retrieve paper"});
                    //show the page
                    setSimilarPaperFetch(false);
                }
                else if (mnt && resx && resx.message) {
                    //pass error object to global context
                    appConsumer.setError(resx);
                }else if(mnt){
                    //set paperdata(which whill call the useEffect on the paperData)
                    console.log("setting target paper data");
                    setTargetPaperData(resx.results[0]);
                    setSimilarPaperFetch(false);

                }
            }
            else{
                console.log("no file (& no similarPaperString)");
                setSimilarPaperFetch(false);
            }

        };

        if(!targetPaperData || queryData.query !== keywords){
            fetchMainPaper();
        }
        
        //execute on unmount and every time the useEffect ends
        return () => {
            mnt = false;
        };

    }, [project_id, targetPaperFile, queryData.query]);  //re-execute when these variables change

    
    /**
     * effect to handle live update on year change(not used)
     */
    /*
    useEffect(() => {
        queryData.year = year;

        //send query url
        let queryString = createQueryStringFromObject(queryData);
        //launch to search
        history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router
        
    }, [year])
    */

    /**
     *handle to update hook state by input change
     */
    function handleOnInputChange(event) {

        switch (event.target.name) {
            case "query":
                setKeyWords(event.target.value);
                break;
            case "year":
                //setYear(event.target.value); //not used
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
        if (keywords === "" && !targetPaperFile) {
            appConsumer.setNotificationMessage("Similar paper string is empty")
        }
        else {
            //synchronize the query data from react state hooks
            //if there isn't any file I search with the string
            if(!targetPaperFile){
                console.log("there isn't a file")
                queryData.query = keywords;
            }else{
                console.log("there's a file")
                queryData.query = "";
            }
            //queryData.year = year; (not used)

            //send query url
            let queryString = createQueryStringFromObject(queryData);
            //launch to search
            history.push(queryString);//this allows pushing the same data and refreshing the page with the hash router

        }


    }

    return (
        <>
            <form className={(queryData.query === "" && !targetPaperFile && !targetPaperData) ? 'search-form' : 'search-form small'}
                    style={{marginTop: (similarFormVisibility) ? "30px" : "60px"}}
                    onSubmit={handleSendSearch}>
                {/*search form*/}
                
                <TargetPaper style={{boxShadow: "0px 0px 3px -1px rgba(0, 0, 0, 0.25)"}}
                    project_id={project_id}
                    close={setSimilarFormVisibility} handler={handleOnInputChange} 
                    input={keywords} paperInfo={targetPaperData}
                    fetching={similarPaperFetch} setPaperInfo={setTargetPaperData}
                    setPaperFile={setTargetPaperFile}
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