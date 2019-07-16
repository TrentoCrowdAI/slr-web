import React, {useState, useEffect} from 'react';

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

    //notification message
    const [notificationMessage, setNotificationMessage] = useState(undefined);

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
        notificationMessage,
        setNotificationMessage,
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

                //if I receive an error I remove the deprecated token
                if((res && res.message) || !res.email){
                    storage.removeItem("userToken");
                }else{
                    let user = {"email": res.email, 
                                "name": res.given_name, 
                                "surname": res.family_name, 
                                "image": res.picture};
                    setUser(user);
                }

                setUserFetch(false);
            }
            getUserData();
        }else if(props.testing){ //data setup for testing
            let user = {"email": "gmail@gmail", 
                        "name": "bob", 
                        "surname": "man", 
                        "image": "invalid"};
            setUser(user);
            setUserFetch(false);
        }else{
            setUserFetch(false);
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