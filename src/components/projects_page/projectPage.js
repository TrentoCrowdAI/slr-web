import React, {useState, useEffect, useContext} from "react";
import {Route, Link, Switch} from 'react-router-dom';

import SearchStandardManager from 'components/projects_page/search_tab/search_standard/searchStandardManager';
import SearchSimilarManager from 'components/projects_page/search_tab/search_similar/searchSimilarManager';
import CustomPaperPage from 'components/projects_page/papers_tab/customPaperPage';
import {projectsDao} from 'dao/projects.dao';
import ProjectName from 'components/projects_page/projectName';
import {join} from 'utils';

import LoadIcon from 'components/svg/loadIcon';
import Forbidden from 'components/svg/forbidden';

import {AppContext} from 'components/providers/appProvider';
import PageNotFound from "components/modules/pageNotFound";
import PapersTab from "./papers_tab/papersTab";
import FiltersTab from "./filters_tab/filtersTab";
import SearchAutomatedManager from "components/projects_page/search_tab/search_automated/searchAutomatedManager";


/**
 *this component will show a projects page
 */
const ProjectPage = (props) => {

    //project object of page
    const [project, setProject] = useState({data: {name: "loading..."}});

    //collaborators
    const [collaborators, setCollaborators] = useState([]);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //notFound state for hiding the navbar
    const [notFound, setNotFound] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //flag for unauthorized user
    const [unauthorized, setUnauthorized] = useState(false);

    const project_id = props.match.params.id;

    //set the project title
    useEffect(() => {
        if(project.data.name === "loading..." || project.data.name === "UNAUTHORIZED OR INEXISTENT PROJECTS"){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{project.data.name}</h2> </div>);//I set the page title
        }else{
            appConsumer.setTitle(<ProjectName project={project} setProject={setProject}/>);
            appConsumer.setProjectName(project.data.name);
        }

    }, [project.data.name]);

    useEffect(() => {

        //flag that represents the state of component
        let mnt = true;

        setDisplay(false);
        //a wrapper function ask by react hook
        const fetchData = async () => {

            //call the dao for main project data
            let res = await projectsDao.getProject(project_id);

            //error checking
            //if unauthorized user
            if(mnt && res.payload && (res.payload.statusCode === 401 || res.payload.message === "the token does not match any user!" || res.payload.message === "empty token id in header, the user must first login!")){
                setUnauthorized(true);
                setDisplay(true);
                setProject({data: {name: "UNAUTHORIZED OR INEXISTENT PROJECTS"}});
            }
            //if the component is still mounted and there is some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mnt && res ) {
                setUnauthorized(false);
                //update state
                setProject(res);
                //show the page
                setDisplay(true);
            }


        };
        fetchData();
        //when the component will unmount
        return () => {

            //set flag as unmounted
            mnt = false;
        };
    }, [project_id, appConsumer.user]); //re-execute when these variables change


    let output;

    //if the page is loading
    if (display === false) {
        //print svg image
        output = <LoadIcon/>;
    }
    else if(unauthorized){
        output = (
            <div className="forbidden-wrapper">
                <Forbidden/>
                <p>This project does not exist or maybe you are not allowed to see it</p>
            </div>
        )
    }
    else {
        output = (
            <div className="project-wrapper">
                {/*<div>
                    {JSON.stringify(project)}
                    <button style={{marginLeft: "20px"}} onClick={() => {
                        let newProject = project;
                        newProject.data.name = "__°°__";
                        //setProject(newProject);
                        setProject({...newProject});
                        console.log(project)
                    }}>i</button>
                </div>*/}
                <ProjectPageHead match={props.match} notFound={notFound}/>

                {/*route the papers list*/}
                <Switch>
                    <Route exact  path={props.match.url} render={function(props){
                        setNotFound(false);
                        return (<PapersTab project_id={project_id} project={project} setProject={setProject} collaborators={collaborators} setCollaborators={setCollaborators} {...props}/>);
                    }}/>

                    {/*route the form of search*/}
                    <Route exact path={props.match.url + "/search"} render={function(props){
                        setNotFound(false);
                        return (<SearchStandardManager project_id={project_id} {...props} />);
                    }}/>

                    <Route exact path={props.match.url + "/filters"} render={function(props){
                        setNotFound(false);
                        return (<FiltersTab project_id={project_id} project={project} {...props}/>);
                    }}/>

                    <Route exact path={props.match.url + "/screening"} render={function(props){
                        setNotFound(false);
                        return (<p>screening page</p>);
                    }}/>

                    <Route exact path={props.match.url + "/searchautomated"} render={function(props){
                        setNotFound(false);
                        return (<SearchAutomatedManager project={project} {...props} />);
                    }}/>

                    <Route exact path={props.match.url + "/searchsimilar"} render={function(props){
                        setNotFound(false);
                        return (<SearchSimilarManager project_id={project_id} {...props} />);
                    }}/>

                    <Route path = {props.match.url + "/addpaper"} render={function(props){
                        setNotFound(false);
                        return (
                            <>
                                <Link className="back" to={props.match.url.substr(0, props.match.url.length - 9 )}>  </Link>
                                <CustomPaperPage projectId={project.id} url={props.match.url} history={props.history}/>
                            </>
                        );
                    }} />
                    <Route render={(props) => {setNotFound(true); return <PageNotFound/>}}/>
                </Switch>

            </div>
        );
    }

    return output;
};

/**
 * this is the local component to print head of project page
 */
const ProjectPageHead = function ({match, notFound}) {
    //hash  -> #/projects/6/search/ || #/projects/6/search/
    const lc = window.location.hash.split("?")[0];
    var slider = "hide";
    switch (true) {
        case /^#\/projects\/\d+\/?$/.test(lc): //papers tab
            slider = "20px";
            break;

        case /^#\/projects\/\d+\/filters\/?$/.test(lc): //filters tab
            slider = "190px";
            break;

        case /#\/projects\/\d+\/search\/?/.test(lc): //search tab
            slider = "360px";
            break;

        case /^#\/projects\/\d+\/screening\/?$/.test(lc): //screening tab
            slider = "530px";
            break;

        default:
            console.log("no tab");
            break;
    }
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

};


export default ProjectPage;
