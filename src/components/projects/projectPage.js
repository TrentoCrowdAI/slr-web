import React, {useState, useEffect, useContext} from "react";
import {Route, Link, Switch} from 'react-router-dom';

import SearchForm from 'components/forms/searchform';
import SearchSimilarForm from 'components/forms/searchSimilarForm';
import CustomPaperPage from 'components/papers/customPaperPage';
import {projectsDao} from 'dao/projects.dao';
import ProjectName from 'components/projects/projectName';
import {join} from 'utils/index';

import LoadIcon from 'components/svg/loadIcon';
import Forbidden from 'components/svg/forbidden';

import {AppContext} from 'components/providers/appProvider'
import PageNotFound from "components/modules/pageNotFound";
import PapersTab from "./papersTab";
import FiltersTab from "./filtersTab";
import SearchAutomatedForm from "components/forms/searchAutomatedForm";


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
        if(project.data.name === "loading..."){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{project.data.name}</h2> </div>);//I set the page title
        }else{
            appConsumer.setTitle(<ProjectName name={project.data.name} update={updateProject}/>);
            appConsumer.setProjectName(project.data.name);
        }
    
    }, [project]);

    useEffect(() => {

        //flag that represents the state of component
        let mounted = true;

        setDisplay(false);
        //a wrapper function ask by react hook
        const fetchData = async () => {
            console.log("fetch project page");

            //call the dao for main project data
            let res = await projectsDao.getProject(project_id);

            //error checking
            //if unauthorized user
            if(mounted && res.payload && (res.payload.statusCode === 401 || res.payload.message === "the token does not match any user!" || res.payload.message === "empty token id in header, the user must first login!")){
                setUnauthorized(true);
                setDisplay(true);
                setProject({data: {name: "UNAUTHORIZED OR INEXISTENT PROJECTS"}});
            }
            //if the component is still mounted and there is some other errors
            else if (mounted && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mounted && res ) {
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
            mounted = false;
        };
    }, [project_id, appConsumer.user]); //re-execute when these variables change
    

    //function for updating the description and name
    async function updateProject(){

        let new_name = document.getElementById("edit-project-name-input").value;
        let new_desc = document.getElementById("edit-project-description-input").value;


        //if the new name o description are difference from the old name o description
        if(new_name !== project.data.name || new_desc !== project.data.description){

            //call the dao
            let res = await projectsDao.putProject(project_id, {name: new_name, description : new_desc});

            //error checking
            //if is other error
            if (res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if res isn't null
            else if (res && res !== null) {
                console.log("UPDATED SUCCESSFULLY!");
                window.location.reload();
            }


        }
    }


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
                <ProjectPageHead match={props.match} notFound={notFound}/>

                {/*route the papers list*/}
                <Switch>
                    <Route exact  path={props.match.url} render={function(props){
                        setNotFound(false);
                        return (<PapersTab project_id={project_id} project={project} collaborators={collaborators} setCollaborators={setCollaborators} updateProject={updateProject} {...props}/>);
                    }}/>

                    {/*route the form of search*/}
                    <Route exact path={props.match.url + "/search"} render={function(props){
                        setNotFound(false);
                        return (<SearchForm project_id={project_id} {...props} />);
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
                        return (<SearchAutomatedForm project={project} {...props} />);
                    }}/>

                    <Route exact path={props.match.url + "/searchsimilar"} render={function(props){
                        setNotFound(false);
                        return (<SearchSimilarForm project_id={project_id} {...props} />);
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
            slider = "25px";
            break;

        case /^#\/projects\/\d+\/filters\/?$/.test(lc): //filters tab
            slider = "175px";
            break;
    
        case /#\/projects\/\d+\/search\/?/.test(lc): //search tab
            slider = "325px";
            break;

        case /^#\/projects\/\d+\/screening\/?$/.test(lc): //screening tab
            slider = "475px";
            break;
        
        default:
            console.log("no tab");
            break;
    }
    console.log(slider);
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