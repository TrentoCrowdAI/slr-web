import React, {useContext} from "react";
import {Route, Switch} from "react-router-dom";

import {AppContext} from 'components/providers/appProvider';

import Home from 'components/home';
import ProjectsList from 'components/projects/projectsList';
import ProjectPage from 'components/projects/projectPage';
import LoadIcon from 'components/svg/loadIcon';

/**
 * compotent main of page
 */
const Main = function(props){

    let output = "";

    //get data from global context
    const appConsumer = useContext(AppContext);

    console.log(typeof appConsumer.userFetch);

    console.log(appConsumer.userFetch);

    console.log(appConsumer.user);

    //If I'm fecthing the user I dispay a loading icon
    if(appConsumer.userFetch){
        output = (<LoadIcon/>);
    }
    //I render routes only if the user is logged
    else if(appConsumer.user){
        output = (
            <Switch>
                <Route exact path="/" render={() => <Home/> }/>
                <Route exact path="/projects" render={(props) => <ProjectsList {...props} />}/>
                <Route path="/projects/:id" render={(props) => <ProjectPage {...props} />}/>
                <Route render={(props) => <div>404</div>}/>
            </Switch>
        );
    }
    //otherwise if the user is not logged in display the home
    else if(!appConsumer.user){
        output = (<Home/>);
    }else{
        output = (<LoadIcon/>);
    }

    return (
        <div className="main-wrapper">
            {output}
        </div>
    );
};

export default Main;