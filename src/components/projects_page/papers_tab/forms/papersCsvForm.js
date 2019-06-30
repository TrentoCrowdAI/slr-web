import React, {useState, useContext, useRef, useEffect} from "react";

import {updateFileDao} from "dao/updateFile.dao";

import CloseButton from 'components/svg/closeButton';

import { AppContext } from 'components/providers/appProvider'
import LoadIcon from "components/svg/loadIcon";

/**
 * this is the form for uploading a .csv of papers
 */
function PapersCsvForm(props) {

    //get data from global context
    const appConsumer = useContext(AppContext);

    //title field
    const [title, setTitle] = useState("")

    //year field
    const [year, setYear] = useState("")

    //abstract field
    const [abstract, setAbstract] = useState("")

    //author field
    const [authors, setAuthors] = useState("")

    //id(eid, doi) field
    const [id, setId] = useState("");

    //flag for csv upload
    const [csvUpload, setCsvUpload] = useState(false)

    //reference for the input file field
    const inputElement = useRef(null);

    //function to handle file submission
    async function handleSubmission(){

        //get the file object
        let file = inputElement.current.files[0];
        console.log(file.name);
        //if this file exists
        if(file){

            //check file extension
            if(!/\.(csv|CSV)$/.test(file.name)){
                appConsumer.setNotificationMessage("The file must be a csv!");
            }
            else{
                //open flag of loading
                setCsvUpload(true);

                const map = {
                    "authors" : (authors && authors !== "") ? authors : "Authors",
                    "title" : (title && title !== "") ? title : "Title",
                    "year" : (year && year !== "") ? year : "Year",
                    "date" : "",
                    "source_title" : "", //"Source title",
                    "link" : "", //"Link",
                    "abstract" : (abstract && abstract !== "") ? abstract : "Abstract",
                    "document_type" : "", //"Document Type",
                    "source" : "", //Source",
                    "eid" : (id && (id === "eid" || id === "EID")) ? id : ((!id) ? "EID" : ""), //EID",
                    "abstract_structured" : "", //abstract_structured",
                    "filter_oa_include" : "", //filter_OA_include",
                    "filter_study_include" : "", //filter_study_include",
                    "notes" : "", //notes",
                    "manual" : "", //manual",
                    "doi" : (id && (id === "doi" || id === "DOI")) ? id : "", //doi"
                    /*
                    Authors,Title,Year,Source title,Link,Abstract,
                    Document Type,Source,EID,abstract_structured,
                    filter_OA_include,filter_study_include,notes
                    */
                }

                //prepare the form data for post
                let formData = new FormData();
                formData.append('file', file);
                formData.append('project_id', props.project_id);
                formData.append('fields', JSON.stringify(map));


                //call the dao
               let res = await updateFileDao.uploadCsv(formData);
               console.log(res);

                
                //if there is a error
                if (res && res.message) {
                    //pass error object to global context
                    appConsumer.setNotificationMessage("Error during parsing file");
                
                }
                else{
                    //set paperdata
                    //setPaperData(res);
                    props.setForcePapersFetch(!props.forcePapersFetch);
                    props.setVisibility(!props.visibility);
                }


               setTimeout(() => {
                    //close flag of loading
                    setCsvUpload(false);
                }, 2000);


            }
        }
    }


    let output = "";

    if(csvUpload){
        output = (<LoadIcon/>);
    }else{
        output = (
            <>
            <button type="button" className="close-btn" onClick={(e) => {
                props.setVisibility(!props.visibility);
            }}><CloseButton/></button>

            <h2>Upload papers CSV</h2>

            <div className="field-names">
                <p>Field names<span>(leave empty for default values)</span></p>
                <div className="field-input-row">
                    <div className="field-input-holder">
                        <label>Title : </label>
                        <input
                            name="name"
                            type="text" 
                            placeholder="title" 
                            value={title}
                            onChange={(e) => {setTitle(e.target.value)}}    
                        />
                    </div>
                    <div className="field-input-holder">
                        <label>Year : </label>
                        <input
                            name="name"
                            type="text" 
                            placeholder="year" 
                            value={year}
                            onChange={(e) => {setYear(e.target.value)}}    
                        />
                    </div>
                </div>
                <div className="field-input-row">
                    <div className="field-input-holder">
                        <label>Abstract : </label>
                        <input
                            name="name"
                            type="text" 
                            placeholder="abstract" 
                            value={abstract}
                            onChange={(e) => {setAbstract(e.target.value)}}    
                        />
                    </div>
                    <div className="field-input-holder">
                        <label>Authors : </label>
                        <input
                            name="name"
                            type="text" 
                            placeholder="authors" 
                            value={authors}
                            onChange={(e) => {setAuthors(e.target.value)}}    
                        />
                    </div>
                </div>
                <div className="field-input-row">
                    <div className="field-input-holder">
                        <label>ID : </label>
                        <input
                            name="name"
                            type="text" 
                            placeholder="id, eid, doi, ..." 
                            value={id}
                            onChange={(e) => {setId(e.target.value)}}    
                        />
                    </div>
                </div>
            </div>
            <input type="file"name ="file" id="real-input" ref={inputElement} onChange={handleSubmission}/>
            <button className="file-input" type="button" onClick={() => {inputElement.current.click();}}>Uplaod .csv file</button>
            </>
        );
    }
    return (
        <>
            <form className="modal floating-form add-csv-papers" style={{visibility: (!props.visibility) ? 'hidden' : '' }}>
                {output}
            </form>
        </>
    );


}


export default PapersCsvForm;