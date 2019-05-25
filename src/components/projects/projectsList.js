import React, {useState, useEffect, useContext} from "react";
import {Link} from 'react-router-dom';
import queryString from 'query-string';


import {projectsDao} from 'dao/projects.dao';
import LoadIcon from 'components/svg/loadIcon';
import ProjectForm from 'components/forms/projectForm';
import Pagination from 'components/modules/pagination';
import {join} from 'utils/index';
import Cover from 'components/modules/cover';
import SideOptions from 'components/modules/sideOptions';

import {AppContext} from "components/providers/appProvider";
import EmptyFolder from "components/svg/emptyFolder";

/**
 *this component will show a projects list page
 */

const ProjectsList = function (props) {


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
    const queryData = createQueryData(props.location.search);


    //set title when component mounts
    useEffect(() => {
        appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">PROJECTS</h2> </div>);
        //I remove any old project name that was previously saved
        appConsumer.setProjectName("");
    },[]); //run on component mount

    useEffect(() => {

        //flag that represents the state of component
        let mounted = true;

        //a wrapper function ask by react hook
        const fetchData = async () => {

            //hide the page
            setDisplay(false);

            //call the dao
            const res = await projectsDao.getProjectsList({orderBy: "date_last_modified", ...queryData});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mounted && res && res.message === "Not Found") {
                setProjectsList([]);
                setTotalResults(0);
                //show the page
                setDisplay(true);
            }
            //if the component is still mounted and  there are some other errors
            else if (mounted && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and  res isn't null
            else if (mounted && res) {
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

        //when the component will unmount
        return () => {
            //set flag as unmounted
            mounted = false;
        };
    }, [queryData.start, queryData.count]); //re-execute when these variables change


    //handle to delete project
    async function handleDelete(id){

        console.log("deleting " + id);
        //call the dao
        let res = await projectsDao.deleteProject(id);
        //error checking
        //if is other error
        if (res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);  
        }
        //if res isn't null
        else if (res && res !== null) {
            //create a new array without the project deleted
            let newProjectsList = projectsList.filter((project)=>project.id !== id);
            //update project list state
            setProjectsList(newProjectsList);

            alert("DELETED SUCCESSFULLY!");
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
                <button className="bottom-left-btn add-project-btn" type="button" value="toggle-insert-form" 
                onClick={(e) => {
                    setToggleForm(!toggleform);
                }}>
                    <div className="btn-title">Add Project</div><div className="btn-icon"> </div>
                </button>
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

    let sideOptions= ["delete"];

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
                    <SideOptions options={sideOptions} handler={handleDelete} target={element.id} cls="card-options project-card-options"/>
                    <Link to={join(path, "/" + element.id)}>
                        <h3>{element.data.name}</h3>
                        <p className="description">{element.data.description}</p>
                        <div className="project-dates">
                            <p>{/*created on <i>{element.date_created.slice(0, 10)}</i>*/}</p>
                            <p>last modified on <i>{element.date_last_modified.slice(0, 10)}</i></p> 
                        </div>
                    </Link>
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

/**
 * internal function to prepare a object of queryData
 * @param query
 * @return object of queryData for the fetch
 */
function createQueryData(query){

    //set query params from queryString of url
    let params = queryString.parse( query);
    let count = params.count || 10;
    let start = params.start || 0;

    //if "before" is defined by query then insert it in object, else insert "after" in object
    let queryData = {start, count};
    return queryData;

}





export default ProjectsList;