import React, {useContext, useEffect} from "react";

import {withRouter} from 'react-router-dom';

import {AppContext} from "components/providers/appProvider";

/**
 * this is home component
 */
const Home = function (props) {


    //get data from global context
    const appConsumer = useContext(AppContext);

    //set title when component mounts
    useEffect(() => {
        appConsumer.setTitle(<div className="nav-elements"> <h2 className="static-title">HOME</h2> </div>);
    },[])//run on component mount

    const { history, location } = props;

    useEffect(() => {
        //if user is not logged it I redirect to homepage
        if(!appConsumer.user){
            history.push("/");
        }
    }, [location.pathname]) //every time location changes

    return (
        <>
            <h1>
                Systematic Literature Review manager
            </h1>
            <h2 style={{fontSize: 22, fontWeight: "normal"}}>the system right now allows you to</h2>
            <ul style={{fontSize: 18, fontWeight: "lighter"}}>
                <li>browse and manage a list of prjects</li>
                <li>browse the list of papers on a project</li>
                <li>search(from Scopus or arXiv) and add papers to a project</li>
                <li>add custom papers based on a file or form data</li>
                <li>'fake search' similar papers or relevant papers</li>
                <li>select collaborators and screeners</li>
                <li>browse and manage a list of screenings</li>
                <li>screen project papers</li>
            </ul>
            <h2 style={{fontSize: 22, fontWeight: "normal"}}>notes</h2>
            <ul style={{fontSize: 18, fontWeight: "lighter"}}>
                <li><i>the scopus search works partially(can't retrieve the description)</i>
                    <ul><li style={{fontSize: 16}}><i>from Elsevier developer portal : "The data available depends on your institutional subscriptions, and only when you're making calls from within your institutional network are you considered a subscriber"</i></li></ul>
                </li>
                <li><i>the options don't affect the search, for now</i></li>
            </ul>
        </>
    );




};


export default withRouter(Home); //I export passing router componets to the Home so it can access history and location