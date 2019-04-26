import React, {useContext} from "react";
import ClampLines from 'react-clamp-lines';
import {Link} from 'react-router-dom';

import CheckBox from "components/forms/checkbox";
import SideOptions from 'components/modules/sideOptions';
import {projectPapersDao} from 'dao/projectPapers.dao';
import {AppContext} from 'components/providers/appProvider'
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
const PrintScoupusSearchList = function ({papersList, handlePaperSelection}) {



    let output = papersList.map((element, index) =>
        <div key={index} className="paper-card">
            <CheckBox name={""} label={""} val={element.eid}  handler={handlePaperSelection}/>
            <Link to={"#"}><h3>{element.title}</h3></Link>
            <div className="extra-info">
                <p className="authors">{element.authors}</p>
                <p className="eid">{element.eid}</p>
                <p className="date">{element.date}</p>
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

const PrintPapersList = function ({papersList}) {

    //get data from global context
    const appConsumer = useContext(AppContext);

    //side options
    let sideOptions= ["delete"];

    //handle for the side options
    async function handleSideOptions(id, name){
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

                alert("DELETED SUCCESSFULLY!");
                window.location.reload();
            }
        }
    }

    let output;
    //if list is empty, print a notice message
    if (papersList.length === 0) {
        output = (
            <div>there are no papers here, you can add new ones by searching</div>
        );
    }
    //if list isn't empty, print list of papers
    else {
        output = (
            papersList.map((element) =>
                <div key={element.id} className="paper-card">
                    <SideOptions options={sideOptions} handler={handleSideOptions} target={element.id} cls="card-options paper-card-options"/>
                    <Link to={"#"}>
                        <h3>{element.data.title}</h3>
                    </Link>
                    <div className="extra-info">
                        <p className="authors">{element.data.authors}</p>
                        <p className="eid">{element.data.eid}</p>
                        <p className="date">{element.data.date}</p>
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

export  {PrintPapersList, PrintScoupusSearchList};