import React, {useState, useEffect, useContext} from "react";
import {Route, Link, Switch, withRouter} from 'react-router-dom';

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
import PapersTab from "components/projects_page/papers_tab/papersTab";
import FiltersTab from "components/projects_page/filters_tab/filtersTab";
import ScreeningTab from "components/projects_page/screening_tab/screeningTab";
import SearchAutomatedManager from "components/projects_page/search_tab/search_automated/searchAutomatedManager";


/**
 *this component will show a projects page
 */
const ScreeningPage = (props) => {

    //project object of page
    const [project, setProject] = useState({data: {name: "loading..."}});

    //flag for unauthorized user
    const [unauthorized, setUnauthorized] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    const project_id = props.match.params.id;

    //set the project title
    useEffect(() => {
        if(project.data.name === "loading..." || project.data.name === "UNAUTHORIZED OR INEXISTENT PROJECTS"){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{project.data.name}</h2> </div>);//I set the page title
        }else{
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{project.data.name} screening</h2> </div>);//I set the page title
            appConsumer.setProjectName(project.data.name);
        }

    }, [project.data.name]);

    useEffect(() => {

        //flag that represents the state of component
        let mnt = true;

        //setDisplay(false);
        //a wrapper function ask by react hook
        const fetchData = async () => {

            //call the dao for main project data
            let res = await projectsDao.getProject(project_id);

            //error checking
            //if unauthorized user
            if(mnt && res.payload && (res.payload.statusCode === 401 || res.payload.message === "the token does not match any user!" || res.payload.message === "empty token id in header, the user must first login!")){
                setUnauthorized(true);
                //setDisplay(true);
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
                //setDisplay(true);
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
               here you'll screening
            </div>
        );
    }

    return output;
};



export default withRouter(ScreeningPage);
