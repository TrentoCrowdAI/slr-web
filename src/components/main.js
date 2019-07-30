import React, {useContext} from "react";
import {Route, Switch} from "react-router-dom";

import {AppContext} from 'components/providers/appProvider';

import Home from 'components/home';
import ProjectsList from 'components/projects_page/projectsList';
import ProjectPage from 'components/projects_page/projectPage';
import ScreeningsList from 'components/screenings_page/screeningsList';
import ScreeningPage from 'components/screenings_page/screeningPage';
import LoadIcon from 'components/svg/loadIcon';
import PageNotFound from "./modules/pageNotFound";

/**
 * compotent main of page
 */
const Main = function(props){

    let output = "";

    //get data from global context
    const appConsumer = useContext(AppContext);

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
                <Route exact path="/screenings" render={() => <ScreeningsList />}/>
                <Route path="/screenings/:id" render={() => <ScreeningPage />}/>
                <Route render={(props) => <PageNotFound/>}/>
            </Switch>
        );
    }
    else{
        output = (
            <Switch>
                <Route path="/projects/:id" render={(props) => <ProjectPage {...props} />}/>
                <Route render={() => <Home/>}/>
            </Switch>
        );
    }

    return output;
};

export default Main;