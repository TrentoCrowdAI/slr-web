import React from 'react';
import {HashRouter as Router} from 'react-router-dom';

import App from 'App';

/**
 *this is the router wrapper of application
 */

const AppRouter = function(props) {


        return (
            <Router>
                <App/>
            </Router>
        );

}

export default AppRouter;
