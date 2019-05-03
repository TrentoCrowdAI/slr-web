import React, {useEffect, useState, useRef} from "react";
import PaperForm from 'components/forms/custompaper';
import LoadIcon from "components/svg/loadIcon";


function CustomPaperPage({projectId, url, history}) {

    const [paperDataFetch, setPaperDataFetch] = useState(false);
    const [paperData, setPaperData] = useState(undefined);
    const [displayForm, setdisplayForm] = useState(false);

    //reference for the input file field
    const inputElement = useRef(null);

    async function handleSubmission(){
        //if the user submits a paper I set the paperFile variable to its content so the main form can work with it
        if(inputElement.current.files[0]){
            console.log(inputElement.current.files[0].name);

            setPaperDataFetch(true);
            
            //imaginary api call for retrieving paper data
            //setPaperData(the result of the call)
            //setPaperDataFetch(false)
            //setDisplayForm(true)
        }
    }

    let output = "";

    if(!displayForm && !paperDataFetch){
        output = (
            <>
                <div className="file-input-container">
                    <input type="file" id="real-input" ref={inputElement} onChange={handleSubmission}/>
                    <button type="button" className="browse-btn" onClick={() => {inputElement.current.click();}}>
                        Upload a Paper
                    </button>
                </div>
                    or<br/>
                <button type="button"
                    onClick={() => {setdisplayForm(true)}}
                >insert data manually</button>
            </>
        );
    }else if(paperDataFetch){
        output = (
            <>
                <div className="file-input-container">
                    <input type="file" id="real-input"/>
                    <button type="button" className="browse-btn">
                        <LoadIcon/>
                    </button>
                </div>
                    or<br/>
                <button type="button"
                    onClick={() => {/* reset connection to api if necessary */ setPaperDataFetch(false); setdisplayForm(true);}}
                >abort and insert data manually</button>
            </>
        );
    }else{
        output = (
            <PaperForm projectId={projectId} url={url} history={history} paper={paperData}/>
        );
    }

    return output;

}


export default CustomPaperPage;