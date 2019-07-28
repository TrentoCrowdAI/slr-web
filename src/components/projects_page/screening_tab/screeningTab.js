import React from "react";
import {Route, Link, Switch, withRouter, Redirect} from 'react-router-dom';

import {join} from 'utils';

import PageNotFound from "components/modules/pageNotFound";
import ScreeningBacklog from 'components/projects_page/screening_tab/backlog_subtab/screeningBacklog';
import ManualResults from 'components/projects_page/screening_tab/manual_subtab/manualResults';
import ScreenedPapers from 'components/projects_page/screening_tab/screened_subtab/screenedPapers';


/**
 *this component will manage the screening sub tabs
 */
const ScreeningTab = ({project_id, project, match, notFound, setNotFound}) => {

    let output;

    output = (
        <>
            <ScreeningPageNavigation notFound={notFound} match={match}/>
            <Switch>
                    <Route exact path={match.url} render={function(props){
                        return (<Redirect to={join(match.url, '/backlog')} />);
                    }}/>
                    <Route exact path={match.url + "/backlog"} render={function(props){
                        return (<ScreeningBacklog project_id={project_id} project={project}/>);
                    }}/>
                    <Route exact path={match.url + "/manual"} render={function(props){
                        return (<ManualResults project_id={project_id}/>);
                    }}/>

                    <Route exact path={match.url + "/crowdsource"} render={function(props){
                        return (<p>crowdsource</p>);
                    }}/>

                    <Route path={match.url + "/screened"} render={function(props){
                        return (<ScreenedPapers project_id={project_id}/>);
                    }}/>

                    <Route render={(props) => {setNotFound(true);return <PageNotFound/>}}/>
                </Switch>

        </>
    );

    return output;
};

/**
 * this is the local component to print the navigation tabs of the screening page
 */
const ScreeningPageNavigation = function ({notFound, match}) {
    //hash  -> #/projects/6/search/ || #/projects/6/search/
    const lc = window.location.hash.split("?")[0];
    var slider = "hide";
    switch (true) {
        case /#\/projects\/\d+\/screening\/backlog\/?/.test(lc): //papers tab
            slider = "4px";
            break;

        case /#\/projects\/\d+\/screening\/manual\/?/.test(lc): //filters tab
            slider = "28px";
            break;

        case /#\/projects\/\d+\/screening\/crowdsource\/?/.test(lc): //search tab
            slider = "52px";
            break;

        case /#\/projects\/\d+\/screening\/screened\/?/.test(lc): //screening tab
            slider = "76px";
            break;

        default:
            break;
    }
    let output = (
        <>
            <div className="screening-nav-link-wrapper" style={{display: (notFound || slider === "hide") ? "none" : ""}}>
                <div className="nav-link">
                    <Link to={join(match.url, "/backlog")} style={{paddingRight: (slider === "4px") ? "0px" : "", color: (slider === "4px") ? "black" : ""}}>backlog</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/manual")} style={{paddingRight: (slider === "28px") ? "0px" : "", color: (slider === "28px") ? "black" : ""}}>manual</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/crowdsource")} style={{paddingRight: (slider === "52px") ? "0px" : "", color: (slider === "52px") ? "black" : ""}}>crowdsourcing</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/screened")} style={{paddingRight: (slider === "76px") ? "0px" : "", color: (slider === "76px") ? "black" : ""}}>screened</Link>
                </div>
                {/*<div className="verline" style={{top: slider}}/>*/}
            </div>
        </>
    );

   return output;

};


export default withRouter(ScreeningTab);
