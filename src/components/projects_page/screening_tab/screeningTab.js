import React, {useContext} from "react";
import {Route, Link, Switch, withRouter, Redirect} from 'react-router-dom';

import {join} from 'utils';

import {AppContext} from 'components/providers/appProvider';
import PageNotFound from "components/modules/pageNotFound";
import ScreeningBacklog from 'components/projects_page/screening_tab/backlog_subtab/screeningBacklog';


/**
 *this component will manage the screening sub tabs
 */
const ScreeningTab = ({project_id, match, notFound, setNotFound}) => {

    //get data from global context
    const appConsumer = useContext(AppContext);

    let output;

    output = (
        <>
            <ScreeningPageNavigation notFound={notFound} match={match}/>
            <Switch>
                    <Route exact path={match.url} render={function(props){
                        return (<Redirect to={join(match.url, '/backlog')} />);
                    }}/>
                    <Route exact path={match.url + "/backlog"} render={function(props){
                        return (<ScreeningBacklog project_id={project_id}/>);
                    }}/>
                    <Route exact path={match.url + "/manual"} render={function(props){
                        return (<p>manual</p>);
                    }}/>

                    <Route exact path={match.url + "/crowdsource"} render={function(props){
                        return (<p>crowdsource</p>);
                    }}/>

                    <Route path={match.url + "/screened"} render={function(props){
                        return (<p>screened</p>);
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
                    <Link to={join(match.url, "/backlog")}>backlog</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/manual")}>manual</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/crowdsource")}>crowdsourcing</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/screened")}>screened</Link>
                </div>
                <div className="verline" style={{top: slider}}/>
            </div>
        </>
    );
    /*
    let output = (
        <>
            <div className="project-nav-link-wrapper" style={{display: (notFound || slider === "hide") ? "none" : ""}}>
                <div className="nav-link">
                    <Link to={match.url}>papers</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/filters")}>filters</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/search")}>search</Link>
                </div>
                <div className="nav-link">
                    <Link to={join(match.url, "/screening")}>screening</Link>
                </div>
                <div className="underline" style={{left: slider}}/>
            </div>
        </>
    );
    return output;
    */
   return output;

};


export default withRouter(ScreeningTab);