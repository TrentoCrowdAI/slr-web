import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";



import Main from 'components/main';
import Home from 'components/home';

import NavBar from 'components/navigation/navBar';
import SideMenu from 'components/navigation/sideMenu';

import ProjectsList from 'components/projects/projectsList';
import ProjectPage from 'components/projects/projectPage';


import  {AppProvider} from 'components/providers/appProvider';


/**
 *this is the start point of application
 */

const App = function(props) {


        return (
            <Router basename={"slr-web/"}>
                <div className="app">

                    {/*mount a root context object*/}
                    <AppProvider>

                        <NavBar>
                            {/*component menu*/}
                            <SideMenu/>
                        </NavBar>
                        <Main>
                            <Switch>
                                <Route exact path="/" render={() => <Home/> }/>
                                <Route exact path="/projects" render={(props) => <ProjectsList {...props} />}/>
                                <Route path="/projects/:id" render={(props) => <ProjectPage {...props} />}/>
                                <Route render={(props) => <div>404</div>}/>
                            </Switch>

                        </Main>

                    </AppProvider>
                </div>
            </Router>
        );

}

export default App;
