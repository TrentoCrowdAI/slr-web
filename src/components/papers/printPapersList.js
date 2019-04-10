import React from "react";
import ClampLines from 'react-clamp-lines';
import {Link} from 'react-router-dom';

import CheckBox from "src/components/forms/checkbox";
/**
 * prints the papers list of a local search on the fake database
 */
/*
const PrintLocalSearchList = function ({papersList, handlePaperSelection}) {

    let output = papersList.map((element, index) =>
        <div key={element.id} className="paper-card">
            <CheckBox val={element.id} label={""} handler={handlePaperSelection}/>
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
            <CheckBox val={element.eid} label={""} handler={handlePaperSelection}/>
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

/**
 * prints a list of papers
 */

const PrintPapersList = function ({papersList}) {

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
                        moreText="Expand"
                        lessText="Collapse"
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