import React, {useEffect} from 'react';

import Main from 'components/main';

import NavBar from 'components/navigation/navBar';
import SideMenu from 'components/navigation/sideMenu';
import BreadCrumbs from 'components/navigation/breadCrumbs';

import Notification from 'components/modules/notification';

import UsersLogin from 'components/modules/usersLogin';


import  {AppProvider} from 'components/providers/appProvider';


/**
 *this is the start point of application
 */

const App = function(props) {


        return (
                <div className="app">

                    {/*mount a root context object*/}
                    <AppProvider testing={props.testing}>

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
        );

}

export default App;
