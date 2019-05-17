import React, {useContext} from 'react';

import { GoogleLogin } from 'react-google-login';
import {usersDao} from 'dao/users.dao'

import {AppContext} from 'components/providers/appProvider';


/**
 * this component handles the login and logout from the platform
 */
const UsersLoginLogout = function(props) {

    //output var
    let output = "";

    //userToken
    let userToken = undefined;

    //get the localStorage object
    const storage = window.localStorage;

    //get data from global context
    const appConsumer = useContext(AppContext);

    /**
     * google response handler
     */
    const responseGoogle = async (response) => {

        let userLoginData = {"tokenId": response.tokenId};

        //call dao for verfying the user and logging him in
        let res = await usersDao.postTokenId(userLoginData);

        //error checking
        if(res.message){
            //pass error object to global context
            appConsumer.setError(res);
        }else{
            //if success I set the user data
            appConsumer.setUser(res.user);
            //and the token
            storage.setItem("userToken", JSON.stringify(res.token));

            props.history.push("/");
        }

        console.log(res);
    }

    /**
     * logout handler
     */
    const logout = (e) => {
        console.log("logging out");

        //remove token from storage
        localStorage.removeItem("userToken");

        //remove user info from context
        appConsumer.setUser(null);

        props.history.push("/");
    }
    
    //if exists already this attribute in the local storage
    if (storage.getItem("userToken")) {
        userToken = JSON.parse(storage.getItem("userToken")).token;
        //if there's token it means the user is logged and I print the logout option
        output = (
            <div className="logout-holder">
                <button type="button" onClick={logout}>Log Out</button>
            </div>
        );
    }else{
        //otherwise I print the login option
        output = (
            <div className="login-holder">
                <GoogleLogin
                    clientId="282160526683-84sdnoqh3bc1obojfpepcbonnfg3uks4.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                />
            </div>
        );
    }

    return output;

}

export default UsersLoginLogout;
