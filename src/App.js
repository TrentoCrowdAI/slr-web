import React from 'react';
import {HashRouter as Router} from "react-router-dom";



import Main from 'components/main';

import NavBar from 'components/navigation/navBar';
import SideMenu from 'components/navigation/sideMenu';
import BreadCrumbs from 'components/modules/breadCrumbs';

import Notification from 'components/modules/notification';

import UsersLogin from 'components/modules/usersLogin';


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

                        <BreadCrumbs/>

                        <Notification/>

                        <Main/>

                        <UsersLogin/>

                    </AppProvider>
                </div>
            </Router>
        );

}

export default App;
