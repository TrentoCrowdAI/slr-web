import React, {useContext, useState} from "react";
import ClampLines from 'react-clamp-lines';
import {Link, withRouter} from 'react-router-dom';

import CheckBox from "components/forms/checkbox";
import SideOptions from 'components/modules/sideOptions';
import {projectPapersDao} from 'dao/projectPapers.dao';
import {AppContext} from 'components/providers/appProvider'

import NoPapers from "components/svg/noPapers";

import {join} from 'utils/index';
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
const PrintScoupusSearchList_w = function ({papersList, handlePaperSelection, selectedEidList, history, match, setSimilarPaperData}) {

    //side options
    let sideOptions= ["search similar"];

    //get data from global context
    const appConsumer = useContext(AppContext);

    //handle for the side options
    async function handleSideOptions(id, name, data){
        if(name === "delete"){
            console.log("deleting " + id);
            //call the dao
            let res = await projectPapersDao.deletePaper(id);
            //error checking
            //if is other error
            if (res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if res isn't null
            else if (res !== null) {

                appConsumer.setNotificationMessage("Successfully deleted!");

            }
        }else if(name === "search similar"){
            console.log("here you want to search for a similar paper");
            console.log(data);

            const storage = window.localStorage;
            storage.setItem("similarPaperData", JSON.stringify(data));

            //I extract the path to check if I'm on /search or /searchsimilar
            let path = (match.path[match.path.length - 1] === "/") ? match.path.substring(0, match.path.length - 1) : match.path;
            let goSimilar = path;
            if(path[path.length - 1] === "h"){
                goSimilar = path + "similar";
                history.push(goSimilar);
            }else{
                window.location.reload();
            }

        }
    }

    let output = papersList.map((element, index) =>
        <div key={index} className="paper-card">
            <CheckBox name={element.title} label={""} val={element.eid}  isChecked ={selectedEidList.includes(element.eid)} handler={handlePaperSelection}/>
            <SideOptions options={sideOptions} handler={handleSideOptions} target={element.id} data={element} cls="card-options paper-card-options"/>
            <Link to={"#"}><h3>{element.title}</h3></Link>
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

/**
 * prints a list of papers and handles their removal from the project
 */

const PrintPapersList_w = function ({papersList, location, history}) {

    const [localPaperList, setLocalPaperList] = useState(papersList);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //side options
    let sideOptions= ["delete", "search similar"];

    //handle for the side options
    async function handleSideOptions(id, name, data){
        if(name === "delete"){
            console.log("deleting " + id);
            //call the dao
            let res = await projectPapersDao.deletePaper(id);
            //error checking
            //if is other error
            if (res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if res isn't null
            else if (res !== null) {

                appConsumer.setNotificationMessage("Successfully deleted");
                let newPapersList = localPaperList.filter((paper)=>paper.id !== id);
                setLocalPaperList(newPapersList);
            }
        }else if(name === "search similar"){
            console.log("here you want to search for a similar paper");
            console.log(location);

            const storage = window.localStorage;
            storage.setItem("similarPaperData", JSON.stringify(data));
            history.push(join(location.pathname, "/searchsimilar"));
        }
    }

    let output;
    //if list is empty, print a notice message
    if (localPaperList.length === 0) {
        output = (
            <div className="empty-project-wrapper"> <NoPapers/> <p className="empty-project-description"> There are no papers here, you can add new ones by searching </p></div>
        );
    }
    //if list isn't empty, print list of papers
    else {
        output = (
            localPaperList.map((element) =>
                <div key={element.id} className="paper-card">
                    <SideOptions options={sideOptions} handler={handleSideOptions} target={element.id} data={element.data} cls="card-options paper-card-options"/>
                    <Link to={"#"}>
                        <h3>{element.data.title}</h3>
                    </Link>
                    <div className="extra-info">
                        <p className="authors">{element.data.authors}</p>
                        <p className="eid">{element.data.eid || element.data.doi}</p>
                        <p className="date">{element.data.year}</p>
                    </div>
                    <ClampLines
                        text={element.data.abstract}
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

export const PrintPapersList = PrintPapersList_w;
export const PrintScoupusSearchList = withRouter(PrintScoupusSearchList_w);