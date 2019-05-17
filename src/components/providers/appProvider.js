import React, {useState, useRef} from 'react';

import NavBar from 'components/navigation/navBar';
import Main from 'components/main';
import Error from 'components/modules/error';

//create a context object
const AppContext = React.createContext();

/**
 * this is the component that include a context object that it can be access by all its children component
 */
const AppProvider = function (props) {

    //user data
    const [user, setUser] = useState(null);

    //error
    const [error, setError] = useState(null);

    //title
    const [title, setTitle] = useState(<div className="nav-elements"> <h2 className="static-title">HOME</h2> </div>);

    const [projectName, setProjectName] = useState("");

    //preparate an object to be insertd into context
    const contextObject ={
        user,
        setUser,
        error,
        setError,
        title,
        setTitle,
        projectName,
        setProjectName
    };


    //if there isn't error
    if (!error) {

        return (
            //*set the values of contenxt*
            <AppContext.Provider value={contextObject}>

                {/*mount all components children*/}
                {props.children}

            </AppContext.Provider>
        );
    }
    //if there is a error
    else {
        return (
            //*set the values of contenxt*
            <AppContext.Provider value={contextObject}>

                    <Error/>

            </AppContext.Provider>
        )
    }


}

export {AppContext, AppProvider};