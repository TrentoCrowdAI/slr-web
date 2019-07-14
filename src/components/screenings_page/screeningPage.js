import React, {useState, useEffect, useContext, useRef} from "react";
import {Route, Switch, withRouter} from 'react-router-dom';

import {projectsDao} from 'dao/projects.dao';
import {projectFiltersDao} from 'dao/projectFilters.dao';
import Forbidden from 'components/svg/forbidden';

import {AppContext} from 'components/providers/appProvider';
import SinglePredicateScreening from 'components/screenings_page/singlePredicate';
import MultiPredicateScreening from 'components/screenings_page/multiPredicate';


/**
 *this component will show a projects page
 */
const ScreeningPage = (props) => {

    const mountRef = useRef(false); 

    //project object of page
    const [project, setProject] = useState({data: {name: "loading..."}});

    //flag for unauthorized user
    const [unauthorized, setUnauthorized] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    const project_id = props.match.params.id;

    //filters of the project
    const [filtersList, setFiltersList] = useState([]);

    //filtersFetch flag
    const [filtersFetch, setFiltersFetch] = useState(true);

    //set the project title
    useEffect(() => {
        if(mountRef.current && (project.data.name === "loading..." || project.data.name === "UNAUTHORIZED OR INEXISTENT PROJECTS")){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{project.data.name}</h2> </div>);//I set the page title
        }else if(mountRef.current){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{project.data.name} screening</h2> </div>);//I set the page title
            appConsumer.setProjectName(project.data.name);
        }

    }, [project.data.name]);

    useEffect(() => {

        mountRef.current = true;

        //setDisplay(false);
        //a wrapper function ask by react hook
        const fetchProjectData = async () => {

            //call the dao for main project data
            let res = await projectsDao.getProject(project_id);

            //error checking
            //if unauthorized user
            if(mountRef.current && res.payload && (res.payload.statusCode === 401 || res.payload.message === "the token does not match any user!" || res.payload.message === "empty token id in header, the user must first login!")){
                setUnauthorized(true);
                //setDisplay(true);
                setProject({data: {name: "UNAUTHORIZED OR INEXISTENT PROJECTS"}});
            }
            //if the component is still mounted and there is some other errors
            else if (mountRef.current && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mountRef.current && res ) {
                setUnauthorized(false);
                //update state
                setProject(res);
                //show the page
                //setDisplay(true);
            }


            //call the dao
            let resx = await projectFiltersDao.getFiltersList({"project_id" : project_id});
            console.log(resx);

            //error checking
            //if the component is still mounted and  is 404 error
            if (mountRef.current && resx && resx.message === "Not Found") {
                setFiltersList([]);
            }
            //if the component is still mounted and  there are some other errors
            else if (mountRef.current && resx && resx.message) {
                //pass error object to global context
                appConsumer.setError(resx);
            }
            //if the component is still mounted and  res isn't null
            else if (mountRef.current && resx) {
                //update state
                setFiltersList([...resx.results]);
            }
            setFiltersFetch(false);
            
        };

        fetchProjectData();
        //when the component will unmount
        return () => {
            mountRef.current = false;
        };
    }, [project_id, appConsumer.user]); //re-execute when these variables change


    let output;

    //if the page is loading
    if(unauthorized){
        output = (
            <div className="forbidden-wrapper">
                <Forbidden/>
                <p>This project does not exist or maybe you are not allowed to see it</p>
            </div>
        )
    }
    else {
        output = (
           <div>
               <Switch>
                    {/*route the form of search*/}
                    <Route exact path={props.match.url + "/single_predicate"} render={function(props){
                        return (<SinglePredicateScreening project_id={project_id} filtersList={filtersList} filtersFetch={filtersFetch}/>);
                    }}/>

                    <Route exact path={props.match.url + "/multi_predicate"} render={function(props){
                        return (<MultiPredicateScreening project_id={project_id} filtersList={filtersList} filtersFetch={filtersFetch}/>);
                    }}/>
                </Switch>
            </div>
        );
    }

    return output;
};



export default withRouter(ScreeningPage);
