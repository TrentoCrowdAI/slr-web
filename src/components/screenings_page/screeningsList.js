import React, {useState, useEffect, useContext, useRef} from "react";
import {Link, withRouter} from 'react-router-dom';


import {projectScreeningDao} from 'dao/projectScreening.dao';
import LoadIcon from 'components/svg/loadIcon';
import Pagination from 'components/modules/pagination';
import {join} from 'utils';

import {AppContext} from "components/providers/appProvider";
import EmptyFolder from "components/svg/emptyFolder";

import {createQueryData} from 'utils/index';

const queryParams = [
    {label: "start", default: 0},
    {label: "count", default: 10},
]

/**
 *this component will show the projects where the user is a screener
 */

const ScreeningsList = function (props) {

    const mountRef = useRef(false);

    //list of projects to screen
    const [screeningsList, setScreeningsList] = useState([]);

    //bool to show the pagination list
    const [totalResults, setTotalResults] = useState(0);

    //bool to control the visualization of page
    const [display, setDisplay] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    //set query params from url
    const queryData = createQueryData(props.location.search, queryParams);


    //set title when component mounts
    useEffect(() => {
        mountRef.current = true;

        appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">SCREENINGS</h2> </div>);
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
            const res = await projectScreeningDao.getProjectsToScreen({orderBy: "date_last_modified", ...queryData});

            //error checking
            //if the component is still mounted and  is 404 error
            if (mnt && res && res.message === "Not Found") {
                setScreeningsList([]);
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

                setScreeningsList(odd_projs.concat(even_projs));
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


    let output;
    //if the page is loading
    if (display === false) {
        //print svg image
        output = <LoadIcon/>;
    }

    else {

        output = (
            <div>
                {/*print list of projects*/}
                <PrintList screeningsList={screeningsList} path={props.match.url}/>
                {/*set listId and continues value*/}
                <Pagination start={queryData.start} count={queryData.count} totalResults={totalResults} path={props.match.url}/>

            </div>
        );

    }

    return output;


};


/**
 *  internal component only to print the list
 * @param screeningsList projects list data
 * @param path current page url
 * */
const PrintList = function ({screeningsList, path}) {

    let maps;
    //if list is empty, print a notice message
    if (screeningsList.length === 0) {
        maps = (
            <div className="empty-folder-wrapper"> <EmptyFolder/> <p className="empty-folder-description"> You don't have any projects to screen yet </p></div>
        );
    }
    //if list isn't empty, print list of projects
    else {
        maps = (screeningsList.map((element, index) =>
                <div key={element.id} className="light-modal project-card for-screening">
                    <Link to={join(path, "/" + element.id)}>
                        <h3>{element.project_data.name}</h3>
                        <p className="description">{element.project_data.description}</p>
                    </Link>
                </div>
        ));
    }

    let output =  (
        <div className={(screeningsList.length === 0) ? "project-cards-holder-empty" : "project-cards-holder"}>
            {maps}
        </div>
    );

    return output;

};




export default withRouter(ScreeningsList);