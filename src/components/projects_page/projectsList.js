import React, {useState, useEffect, useContext, useRef} from "react";

import {projectsDao} from 'dao/projects.dao';
import LoadIcon from 'components/svg/loadIcon';
import ProjectForm from 'components/projects_page/projectForm';
import Pagination from 'components/modules/pagination';
import Cover from 'components/modules/cover';

import {AppContext} from "components/providers/appProvider";
import EmptyFolder from "components/svg/emptyFolder";

import {createQueryData} from 'utils/index';
import ProjectCard from "./projectCard";

const queryParams = [
    {label: "start", default: 0},
    {label: "count", default: 10},
]

/**
 *this component will show a projects list page
 */

const ProjectsList = function (props) {

    const mountRef = useRef(false);

    //fetch data
    const [projectsList, setProjectsList] = useState([]);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //bool to control the visualization of input form
    const [toggleform, setToggleForm] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    const queryData = createQueryData(props.location.search, queryParams);


    //set title when component mounts
    useEffect(() => {
        mountRef.current = true;

        appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">PROJECTS</h2> </div>);
        //I remove any old project name that was previously saved
        appConsumer.setProjectName("");

        return () => {
            mountRef.current = false;
        };
    },[]); //run on component mount

    useEffect(() => {

        let mnt = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //hide the page
            setDisplay(false);
            console.log(queryData);
            //call the dao
            const res = await projectsDao.getProjectsList({orderBy: "date_last_modified", ...queryData});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setProjectsList([]);
                setTotalResults(0);
                //show the page
                setDisplay(true);
            }
            //if the component is still mounted and  there are some other errors
            else if (mnt && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mnt && res) {
                //update state

                //I put even first and then odd ones so I can display 2 columns with left-right flow 
                var even_projs = [];
                even_projs = res.results.filter(function(element, index){ if( index % 2 ) return element;});
                var odd_projs = [];
                odd_projs = res.results.filter(function(element, index){ if( !(index % 2) ) return element;});

                setProjectsList(odd_projs.concat(even_projs));
                setTotalResults(res.totalResults);
                //show the page
                setDisplay(true);
            }
        };

        fetchData();

        //when the component will unmount or this useEffect will stop
        return () => {
            mnt = false;
        };
    }, [queryData.start, queryData.count]); //re-execute when these variables change


    //handle to delete project
    async function handleDelete(id){

        console.log("deleting " + id);
        //call the dao
        let res = await projectsDao.deleteProject(id);

        //empty string is the response from the dao layer in case of success(rember that empty string is a falsy value)
        if(mountRef.current && res === ""){
            //create a new array without the project deleted
            let newProjectsList = projectsList.filter((project)=>project.id !== id);
            //update project list state
            setProjectsList(newProjectsList);

            appConsumer.setNotificationMessage("Successfully deleted");
        }
        //error checking
        //if is other error
        else if (mountRef.current && res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);  
        }
    }



    let output;
    //if the page is loading
    if (display === false) {
        //print svg image
        output = <LoadIcon/>;
    }

    else {

        output = (
            <div>
                <Cover cls={toggleform ? "full-screen" : ""} handler={setToggleForm}/>
                {/*print list of projects*/}
                <PrintList projectsList={projectsList} path={props.match.url} handleDelete={handleDelete}/>
                {/*set listId and continues value*/}
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={props.match.url}/>

                {/*print the input form to create/update the projects*/}
                <ProjectForm visibility={toggleform} setVisibility={setToggleForm} history={props.history}/>
                {/*button to show input form*/}
                <div className="bottom-right-button-holder">
                    <button className="bottom-right-btn add-project-btn" type="button" value="toggle-insert-form" 
                    onClick={(e) => {
                        setToggleForm(!toggleform);
                    }}>
                        <div className="btn-title">Add Project</div><div className="btn-icon"> </div>
                    </button>
                </div>
            </div>
        );

    }

    return output;


};


/**
 *  internal component only to print the list
 * @param projectsList projects list data
 * @param path current page url
 * @param handleDelete function to delete the project
 * */
const PrintList = function ({projectsList, path, handleDelete}) {

    let maps;
    //if list is empty, print a notice message
    if (projectsList.length === 0) {
        maps = (
            <div className="empty-folder-wrapper"> <EmptyFolder/> <p className="empty-folder-description"> You don't have any projects yet </p></div>
        );
    }
    //if list isn't empty, print list of projects
    else {
        maps = (projectsList.map((element, index) =>
                <div key={element.id} className="light-modal project-card">
                    <ProjectCard callDelete={handleDelete} path={path} project={element}/>
                </div>
        ));
    }

    let output =  (
        <div className={(projectsList.length === 0) ? "project-cards-holder-empty" : "project-cards-holder"}>
            {maps}
        </div>
    );

    return output;

};

export default ProjectsList;