import React, {useState} from "react";
import ClampLines from 'react-clamp-lines';
import {Link} from 'react-router-dom';

import SideOptions from 'components/modules/sideOptions';

const ProjectPaperCard = function({callOptions, paper}){
    const [disabled, setDisabled] = useState(false);

    //side options
    let sideOptions= ["delete", "search similar"];

    //handle for the side options
    function handleSideOptions(id, name, data){
        if(name === "delete"){
            setDisabled(true);
        }
        callOptions(id, name, data);
    }

    return(
        <div className={(disabled) ? "disabled" : ""}>
            <SideOptions options={sideOptions} handler={handleSideOptions} target={paper.id} data={paper.data} cls="card-options"/>
            <Link to={"#"}><h3>{(paper.data.title) ? paper.data.title : "[MISSING TITLE]"}</h3></Link>
            <div className="extra-info">
                <p className="authors">{(paper.data.authors) ? paper.data.authors : "[MISSING AUTHORS]"}</p>
                <p className="eid">{(paper.data.eid) ? paper.data.eid : "[MISSING EID]"}</p>
                <p className="date">{(paper.data.year) ? paper.data.year : "[MISSING YEAR]"}</p>
            </div>
            <ClampLines
                text={(paper.data.abstract) ? paper.data.abstract : "[MISSING ABSTRACT]"}
                lines={4}
                ellipsis="..."
                className="paragraph"
                moreText="more"
                lessText="less"
            />
        </div>
    )
}

export default ProjectPaperCard;