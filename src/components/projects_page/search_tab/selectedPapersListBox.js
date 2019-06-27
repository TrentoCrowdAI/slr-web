import React, {useEffect, useContext} from "react";

import {projectPapersDao} from 'dao/projectPapers.dao';

import RemoveButton from 'components/svg/removeButton';

import {AppContext} from 'components/providers/appProvider'



/**
 * component to print the box of list of selected paper
 */
const SelectedPapersListBox = function ({project_id, selectedPapersList, setSelectedPapersList, handlePaperSelection}){

    //boolean flag for handling mount status
    let mounted = true;

    //get the localStorage object (used for saving selected papers)
    const storage = window.localStorage;

    //get data from global context
    const appConsumer = useContext(AppContext);

    useEffect(() => {
        //if exists already this attribute in the local storage
        if (storage.getItem("selectedPapersList")) {
            setSelectedPapersList(JSON.parse(storage.getItem("selectedPapersList")));
        } 

        //when the component will unmount
        return () => {
            mounted = false;
        };
    }, [])

    /*function to post selected papers in the project*/
    async function handleAddPapers(event) {

        let papersToAdd = selectedPapersList;
        //empties the state
        setSelectedPapersList([]);
        //update the storage
        storage.removeItem("selectedPapersList");

        //create a eidList from the list of selected paper
        let arrayEid = papersToAdd.map(element => element.eid);

        console.log("ADDING");
        console.log(arrayEid);

        //call dao
        let res = await projectPapersDao.postPaperIntoProject({
            "arrayEid": arrayEid, "project_id": project_id
        });

        //if there is the error
        if (mounted && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);
            return null;
        }

        //empties the state
        setSelectedPapersList([]);

        //update the storage
        storage.removeItem("selectedPapersList");

        appConsumer.setNotificationMessage("Insert completed");

    }

    let output = "";
    output = (
        <div className="selected-papers-list" style={{opacity: (selectedPapersList.length>0) ? "1.0" : "0.0", pointerEvents: (selectedPapersList.length>0) ? "auto" : "none"}}>
            <h3>
                {"SELECTED PAPERS"} <br/><span>(total : {selectedPapersList.length})</span>
            </h3>
            <div className="submission-wrapper">
                <div className="papers-wrapper" style={{border: (selectedPapersList.length>0) ? "" : "0px"}}>
                    <div className="papers-flex" style={{padding: (selectedPapersList.length>0) ? "" : "0px"}}>
                        {selectedPapersList.map((element, index) =>
                            <p key={index}>
                                <span>{element.title}</span> 
                                <button type="button" className="remove-btn" name={element.title} value={element.eid} //name and value don't work on the button event for some reasons
                                    onClick={(e) => {handlePaperSelection({target: {name: element.title, value:element.eid}})}}>
                                    <RemoveButton/>
                                </button>
                            </p>
                        )}
                    </div>
                </div>
                <button style={{border: (selectedPapersList.length>0) ? "" : "0px", margin: (selectedPapersList.length>0) ? "" : "0px", height: (selectedPapersList.length>0) ? "" : "0px", pointerEvents: (selectedPapersList.length>0) ? "auto" : "none"}} 
                    className="ti-btn add-resultpaper-btn" type="button" value="Submit" onClick={handleAddPapers}>
                    <div className="btn-title">Add Selected Paper</div><div className="btn-icon"> </div>
                </button>
            </div>
        </div>
    );

    return output;

};


export default SelectedPapersListBox;