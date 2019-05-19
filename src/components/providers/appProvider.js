import React, {useState, useRef, useEffect} from 'react';

import NavBar from 'components/navigation/navBar';
import Main from 'components/main';
import Error from 'components/modules/error';

import {usersDao} from 'dao/users.dao';

//create a context object
const AppContext = React.createContext();

/**
 * this is the component that include a context object that it can be access by all its children component
 */
const AppProvider = function (props) {

    //user data
    const [user, setUser] = useState(null);

    //user data fetch flag
    const [userFetch, setUserFetch] = useState(true);

    //error
    const [error, setError] = useState(null);

    //title
    const [title, setTitle] = useState(<div className="nav-elements"> <h2 className="static-title">HOME</h2> </div>);

    const [projectName, setProjectName] = useState("");

    //preparate an object to be insertd into context
    const contextObject ={
        user,
        setUser,
        userFetch,
        setUserFetch,
        error,
        setError,
        title,
        setTitle,
        projectName,
        setProjectName
    };


    //effect on context mount to fetch user data if he's logged
    useEffect(() => {
        //get the localStorage object
        const storage = window.localStorage;

        if (storage.getItem("userToken")) {
            async function getUserData(){


                let res = await usersDao.getUserByTokenId(storage.getItem("userToken"));

                // set the user data in context provider
                setUser(res.user);

                setUserFetch(false);
            }
            getUserData();
        }

        
    }, [])

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