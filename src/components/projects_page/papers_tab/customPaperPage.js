import React, {useEffect, useState, useRef, useContext} from "react";
import CustomPaperForm from 'components/projects_page/papers_tab/forms/customPaperForm';
import LoadIcon from "components/svg/loadIcon";

import {updateFileDao} from "dao/updateFile.dao";

import {AppContext} from 'components/providers/appProvider';

function CustomPaperPage({projectId, url, history}) {

    const mountRef = useRef(false);

    const [paperDataFetch, setPaperDataFetch] = useState(false);
    const [paperData, setPaperData] = useState(undefined);
    const [displayForm, setDisplayForm] = useState(false);

    //reference for the input file field
    const inputElement = useRef(null);

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    async function handleSubmission(){

        //get the file object
        let file = inputElement.current.files[0];
        //if this file exist
        if(file){

            //check file extension and its mine type
            if(!/\.(pdf|PDF)$/.test(file.name) || file.type.indexOf("application/pdf") === -1){
                appConsumer.setNotificationMessage("The file must be a pdf!");
            }
            else{
                //open flag of loading
                setPaperDataFetch(true);

                //prepare the form data for post
                let formData = new FormData();
                formData.append('file', file);

                //call the dao
               let res = await updateFileDao.updatePdf(formData);

               //if there is a error
                if (mountRef.current && res && res.message) {
                    //pass error object to global context
                    appConsumer.setNotificationMessage("Error during parsing file");
                   
                }
                else if(mountRef.current){
                    //set paperdata
                    setPaperData(res);
                    //display the form
                    setDisplayForm(true);
                }
                if(mountRef.current){
                    //close flag of loading
                    setPaperDataFetch(false);
                }

            }
        }
    }

    let output = "";

    if(!displayForm && !paperDataFetch){
        output = (
            <div className="new-paper-page-wrapper">
                <div>
                    <div className="file-input-container">
                        <input type="file"name ="file" id="real-input" ref={inputElement} onChange={handleSubmission}/>
                        <button type="button" className="browse-btn" onClick={() => {inputElement.current.click();}}>
                            Upload a Paper
                        </button>
                    </div>
                        or<br/>
                    <button type="button"
                        onClick={() => {setDisplayForm(true)}}
                    >insert data manually</button>
                </div>
            </div>
        );
    }else if(paperDataFetch){
        output = (
            <div className="new-paper-page-wrapper">
                <div className="file-input-container">
                    <input type="file" id="real-input"/>
                    <button type="button" className="browse-btn">
                        <LoadIcon/>
                    </button>
                </div>
                    or<br/>
                <button type="button"
                    onClick={() => {/* reset connection to api if necessary */ setPaperDataFetch(false); setDisplayForm(true);}}
                >abort and insert data manually</button>
            </div>
        );
    }else{
        output = (
            <CustomPaperForm projectId={projectId} url={url} history={history} customPaper={paperData}/>
        );
    }

    return output;

}


export default CustomPaperPage;