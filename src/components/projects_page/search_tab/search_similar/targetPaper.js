import React, {useRef} from "react";
import ClampLines from 'react-clamp-lines';
import {Link} from 'react-router-dom';

import CloseButton from 'components/svg/closeButton';
import GoButton from "components/svg/goButton";
import LoadIcon from "components/svg/loadIcon";

/**
 * the search form component used for inserting the data relative to the paper we are searching for similar ones
 */
const TargetPaper = ({close, //the setter for closing the form when it's visible(sets the visibility to false)
                                style, //style of the component
                                project_id,
                                input, //the string input
                                handler, //handler for the string input
                                paperInfo, //the data of the retrieved paper(should match the paper we are searching similarities for)
                                fetching, //flag to control when the component is fetching the data related to the paper we are searching similarities for
                                setPaperInfo, //sets the info of the paper we are searching similarites for
                                setPaperFile, //handles the input of a file(when we upload a file instead os specifying the paper by a string)
                                history
                            }) => {
    
    let output = "";
    let content = "";
    let topRightButton = "";

    //reference for the input file field
    const inputElement = useRef(null);


    //clicking the button will trigger the input file
    const onButtonClick = () => {
        inputElement.current.click();
    };

    async function handleSubmission(){
        //if the user submits a paper I set the paperFile variable to its content so the main form can work with it
        if(inputElement.current.files[0]){
            setPaperFile(inputElement.current.files[0]);
        }
    }

    //output
    if(fetching){
        content = (<div className="load-icon-similar-paper"><LoadIcon/></div>);
    }else if(paperInfo && paperInfo.title){
        content = (
            <>
            <h3 className="similar-paper-title">{paperInfo.title}</h3>
            <ClampLines
                text={paperInfo.abstract || ""}
                lines={4}
                ellipsis="..."
                className="similar-paper-paragraph"
                moreText="more"
                lessText="less"
            />
            </>
        );
    }else{
        content = (
            <>
                <p className="similar-description">Search for Similar Papers</p>
                <div className="DOI-holder">
                    <input
                        type="text"
                        placeholder="type DOI, EID, or paper title"
                        value={input}
                        onChange={handler}
                        name="query"
                    />
                    <button className="go-search-similar DOI-btn" type="submit" value="Submit">
                        <GoButton/>
                    </button>
                </div>
                <p className="or">or</p>
                <div className="file-input-container">
                    <input type="file" id="real-input" ref={inputElement} onChange={handleSubmission}/>
                    <button type="button" className="browse-btn" onClick={onButtonClick}>
                        Upload a Paper
                    </button>
                </div>
            </>
        );
    }
    if(paperInfo){
        topRightButton = (
            <button type="button" className={"close-btn red-x"} onClick={(e) => {
                setPaperInfo(undefined);//I delete the similar paper info
                setPaperFile(undefined);//I delete its file
                history.push({});
            }}><CloseButton/></button>
        );
    }else{
        topRightButton = (
            <></>
        );
    }
    output = (
        <div style={{...style}} className="light-modal similar-search-paper-upload">
            {topRightButton}
            {content}
        </div>
    );
    return output;
}

export default TargetPaper;