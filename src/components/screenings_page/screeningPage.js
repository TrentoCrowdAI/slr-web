import React, {useState, useEffect, useContext, useRef} from "react";
import {Route, Switch, withRouter} from 'react-router-dom';

import {projectsDao} from 'dao/projects.dao';
import {projectFiltersDao} from 'dao/projectFilters.dao';
import {projectScreeningDao} from 'dao/projectScreening.dao';
import Forbidden from 'components/svg/forbidden';

import {AppContext} from 'components/providers/appProvider';
import SinglePredicateScreening from 'components/screenings_page/singlePredicate';
import MultiPredicateScreening from 'components/screenings_page/multiPredicate';
import LoadIcon from "components/svg/loadIcon";


/**
 *this component will show a screenings page
 */
const ScreeningPage = (props) => {

    const mountRef = useRef(false); 

    //screening object of page
    const [screening, setScreening] = useState({data: {name: "loading..."}});

    //flag for unauthorized user
    const [unauthorized, setUnauthorized] = useState(false);

    //get data from global context
    const appConsumer = useContext(AppContext);

    const screening_id = props.match.params.id;

    //filters of the project
    const [filtersList, setFiltersList] = useState([]);

    //display flag
    const [display, setDisplay] = useState(false)

    //set the project title of the screening
    useEffect(() => {

        if(mountRef.current && (screening.data.name === "loading..." || screening.data.name === "UNAUTHORIZED OR INEXISTENT SCREENING")){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{screening.data.name}</h2> </div>);//I set the page title
        }else if(mountRef.current){
            appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">{screening.data.name} screening</h2> </div>);//I set the page title
            appConsumer.setProjectName(screening.data.name);
        }

    }, [screening.data.name]);

    useEffect(() => {

        mountRef.current = true;

        //hide the page before fetching new data
        setDisplay(false);

        //a wrapper function ask by react hook
        const fetchProjectData = async () => {

            //call dao
            let res = await projectScreeningDao.getScreening(screening_id);

            //error checking
            //if unauthorized user or inexistent screening
            if(mountRef.current && res.payload && (res.payload.statusCode === 404 || res.payload.statusCode === 401 || res.payload.message === "the token does not match any user!" || res.payload.message === "empty token id in header, the user must first login!")){
                setUnauthorized(true);
                setScreening({data: {name: "UNAUTHORIZED OR INEXISTENT SCREENING"}});
            }
            //if the component is still mounted and there is some other errors
            else if (mountRef.current && res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if the component is still mounted and res isn't null
            else if (mountRef.current && res ) {

                //the user has access to the screening
                setUnauthorized(false);
                //update state
                setScreening(res);

                //call the dao to also get the filters
                let resx = await projectFiltersDao.getFiltersList({"project_id" : res.project_id, "sort":"ASC"});

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
            }

            //I show the page after I fetched all the data
            setDisplay(true);
            
        };

        fetchProjectData();

        //when the component will unmount
        return () => {
            mountRef.current = false;
        };
    }, [screening_id, appConsumer.user]); //re-execute when these variables change


    let output;

    //if the user doesn't have access
    if(unauthorized){
        output = (
            <div className="forbidden-wrapper">
                <Forbidden/>
                <p>This screening does not exist or maybe you are not allowed to see it</p>
            </div>
        )
    }
    //else if there's a single-predicate screening
    else if(display && screening.data.manual_screening_type === "single-predicate"){
        //I get the page for single-predicate screening
        output = (
            <SinglePredicateScreening screening={screening} filtersList={filtersList}/>
        );
    }
    //else if there's a multi-predicate screening
    else if(display && screening.data.manual_screening_type === "multi-predicate"){
        //I get the page for multi-predicate screening
        output = (
            <MultiPredicateScreening screening={screening} filtersList={filtersList}/>
        );
    }
    //otherwise it means I'm fetching data and I should display a loading icon
    else{
        output = <LoadIcon/>
    }

    return output;
};



export default withRouter(ScreeningPage);
