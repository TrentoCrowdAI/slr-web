import React, {useContext, useState, useEffect, useRef} from "react";
import ClampLines from 'react-clamp-lines';
import {Link, withRouter} from 'react-router-dom';

import CheckBox from "components/forms_elements/checkbox";
import SideOptions from 'components/modules/sideOptions';
import {projectPapersDao} from 'dao/projectPapers.dao';
import {AppContext} from 'components/providers/appProvider'

import NoPapers from "components/svg/noPapers";

import {join} from 'utils/index';
import PaperConfidence from "components/projects_page/search_tab/search_automated/paperConfidence";
/**
 * prints the papers list of a local search on the fake database
 */
/*
const PrintLocalSearchList = function ({papersList, handlePaperSelection}) {

    let output = papersList.map((element, index) =>
        <div key={element.id} className="paper-card">
            <CheckBox name={""} label={""} val={element.eid}  handler={handlePaperSelection}/>
            <Link to={"#"}><h3>{element.data && element.data.title}</h3></Link>
            <ClampLines
                text={element.data && element.data.abstract}
                lines={4}
                ellipsis="..."
                moreText="Expand"
                lessText="Collapse"
                className="paragraph"
                moreText="more"
                lessText="less"
            />
        </div>
    );
    return output;

};
*/

/**
 * prints the results of a search on scopus
 */
const PrintScoupusSearchList_w = function ({papersList, handlePaperSelection, selectedEidList, history, match, setTargetPaperData}) {

    //side options
    let sideOptions= ["search similar"];

    //get data from global context
    const appConsumer = useContext(AppContext);

    //handle for the side options
    async function handleSideOptions(id, name, data){
        if(name === "search similar"){
            console.log("here you want to search for a similar paper");
            console.log(data);

            //I extract the path to check if I'm on /search or /searchsimilar
            let path = (match.path[match.path.length - 1] === "/") ? match.path.substring(0, match.path.length - 1) : match.path;
            let goSimilar = path;
            if(path[path.length - 1] === "h"){
                goSimilar = path + "similar";
                //I set the paper in the storage before switching page
                const storage = window.localStorage;
                storage.setItem("targetPaperData", JSON.stringify(data));
                history.push(goSimilar);
            }else{
                setTargetPaperData(data);
            }

        }
    }

    let output = papersList.map((element, index) =>
        <div key={index} className="generic-card paper-card">
            <CheckBox name={element.title} label={""} val={element.eid}  isChecked ={selectedEidList.includes(element.eid)} handler={handlePaperSelection}/>
            <SideOptions options={sideOptions} handler={handleSideOptions} target={element.id} data={element} cls="card-options"/>
            <Link to={"#"}><h3>{(element.title) ? element.title : "[MISSING TITLE]"}</h3></Link>
            <div className="extra-info">
                <p className="authors">{(element.authors) ? element.authors : "[MISSING AUTHORS]"}</p>
                <p className="eid">{(element.eid) ? element.eid : "[MISSING EID]"}</p>
                <p className="date">{(element.year) ? element.year : "[MISSING YEAR]"}</p>
            </div>
            <ClampLines
                text={(element.abstract) ? element.abstract : "[MISSING ABSTRACT]"}
                lines={4}
                ellipsis="..."
                className="paragraph"
                moreText="more"
                lessText="less"
            />
        </div>
    );
    return output;

};

/**
 * prints a list of papers and handles their removal from the project
 */

const PrintPapersList_w = function ({papersList, location, history}) {

    const mountRef = useRef(false);

    const [localPaperList, setLocalPaperList] = useState(papersList);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //side options
    let sideOptions= ["delete", "search similar"];

    useEffect(() => {
        mountRef.current = true;
        //execute only on unmount
        return () => {
            mountRef.current = false;
        };
    },[]);

    //handle for the side options
    async function handleSideOptions(id, name, data){
        if(name === "delete"){
            console.log("deleting " + id);
            //call the dao
            let res = await projectPapersDao.deletePaper(id);
            //error checking
            //if is other error
            if (mountRef.current && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if res isn't null
            else if (mountRef.current && res !== null) {

                appConsumer.setNotificationMessage("Successfully deleted");
                let newPapersList = localPaperList.filter((paper)=>paper.id !== id);
                setLocalPaperList(newPapersList);
            }
        }else if(name === "search similar"){
            console.log("here you want to search for a similar paper");
            console.log(location);

            const storage = window.localStorage;
            storage.setItem("targetPaperData", JSON.stringify(data));
            history.push(join(location.pathname, "/searchsimilar"));
        }
    }

    let output;
    //if list is empty, print a notice message
    if (localPaperList.length === 0) {
        output = (
            <div className="empty-list-wrapper"> <NoPapers/> <p className="empty-list-description"> There are no papers here, you can add new ones by searching </p></div>
        );
    }
    //if list isn't empty, print list of papers
    else {
        output = (
            localPaperList.map((element) =>
                <div key={element.id} className="generic-card paper-card">
                    <SideOptions options={sideOptions} handler={handleSideOptions} target={element.id} data={element.data} cls="card-options"/>
                    <Link to={"#"}><h3>{(element.data.title) ? element.data.title : "[MISSING TITLE]"}</h3></Link>
                    <div className="extra-info">
                        <p className="authors">{(element.data.authors) ? element.data.authors : "[MISSING AUTHORS]"}</p>
                        <p className="eid">{(element.data.eid) ? element.data.eid : "[MISSING EID]"}</p>
                        <p className="date">{(element.data.year) ? element.data.year : "[MISSING YEAR]"}</p>
                    </div>
                    <ClampLines
                        text={(element.data.abstract) ? element.data.abstract : "[MISSING ABSTRACT]"}
                        lines={4}
                        ellipsis="..."
                        className="paragraph"
                        moreText="more"
                        lessText="less"
                    />
                </div>
            )
        );
    }
    return output;


};

const PrintSearchAutomatedList_w = function ({papersList, handlePaperSelection, selectedEidList}) {

    let output = papersList.map((element, index) =>
        <div key={index} className="generic-card paper-card">
            <CheckBox name={element.title} label={""} val={element.eid}  isChecked ={selectedEidList.includes(element.eid)} handler={handlePaperSelection}/>
            <PaperConfidence confidence={{value : 0.78, details : [{detail: "detail 1", percentage : "67%"},{detail: "detail 2", percentage : "64%"},{detail: "detail 3", percentage : "59%"}]}}/>
            <Link to={"#"}><h3 className="auto-paper-title">{element.title}</h3></Link>
            <div className="extra-info">
                <p className="authors">{element.authors}</p>
                <p className="eid">{element.eid}</p>
                <p className="date">{element.year}</p>
            </div>
            <ClampLines
                text={element.abstract}
                lines={4}
                ellipsis="..."
                className="paragraph"
                moreText="more"
                lessText="less"
            />
        </div>
    );
    return output;

};

export const PrintPapersList = PrintPapersList_w;
export const PrintScoupusSearchList = withRouter(PrintScoupusSearchList_w);
export const PrintSearchAutomatedList = withRouter(PrintSearchAutomatedList_w);