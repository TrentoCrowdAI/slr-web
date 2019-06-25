import React, {useState, useContext, useRef, useEffect} from "react";

import {projectsDao} from 'dao/projects.dao'

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

    //flag for csv upload
    const [csvUpload, setCsvUpload] = useState(false)

    //reference for the input file field
    const inputElement = useRef(null);

    //mounted flag for handling unmounting
    const [mounted, setMounted] = useState(true);

    //set mounted as false when the component is unmounted
    useEffect(() => {
        return () => {
            setMounted(false);
        };
    }, [])

    //function to handle file submission
    async function handleSubmission(){

        //get the file object
        let file = inputElement.current.files[0];
        console.log(file.name);
        //if this file exist
        if(file){

            //check file extension
            if(!/\.(csv|CSV)$/.test(file.name)){
                appConsumer.setNotificationMessage("The file must be a csv!");
            }
            else{
                //open flag of loading
                setCsvUpload(true);

                const map = {
                    "title" : (title && title !== "") ? title : "title",
                    "year" : (year && year !== "") ? year : "year",
                    "abstract" : (abstract && abstract !== "") ? abstract : "abstract",
                    "authors" : (authors && authors !== "") ? authors : "authors",
                }

                //prepare the form data for post
                let formData = new FormData();
                formData.append('file', file);
                formData.append('project_id', props.projectId);
                formData.append('fields', map);

               /*

                //call the dao
               let res = await updateFileDao.updatePdf(formData);

               //if there is a error
                if (mounted && res && res.message) {
                    //pass error object to global context
                    appConsumer.setNotificationMessage("Error during parsing file");
                   
                }
                else if(mounted){
                    //set paperdata
                    setPaperData(res);
                    //display the form
                    setDisplayForm(true);
                }

                */

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