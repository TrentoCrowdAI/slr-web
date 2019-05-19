import React from 'react';
import {HashRouter as Router, Route, Switch} from "react-router-dom";



import Main from 'components/main';

import NavBar from 'components/navigation/navBar';
import SideMenu from 'components/navigation/sideMenu';
import BreadCrumbs from 'components/breadCrumbs';

import UsersLoginLogout from 'components/usersLoginLogout';


import  {AppProvider} from 'components/providers/appProvider';


/**
 *this is the start point of application
 */

const App = function(props) {


        return (
            <Router>
                <div className="app">

                    {/*mount a root context object*/}
                    <AppProvider>

                        <NavBar>
                            {/*component menu*/}
                            <SideMenu/>
                        </NavBar>
                        <Switch>
                            {/* this route will always be rendered*/}
                            <Route render={(props) => <div className="relative-header"><BreadCrumbs {...props}/><UsersLoginLogout {...props}/></div>}/>
                        </Switch> 

                        <Main/>
                    
                    </AppProvider>
                </div>
            </Router>
        );

}

export default App;
