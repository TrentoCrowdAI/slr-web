import React, {useContext} from 'react';

import {GoogleLogin} from 'react-google-login';
import {usersDao} from 'dao/users.dao'

import {AppContext} from 'components/providers/appProvider';


/**
 * this component handles the google login and logout from the platform
 */
const UsersLoginLogout = function (props) {

    //output var
    let output = "";

    //userToken
    let userToken = undefined;

    //get the localStorage object
    const storage = window.localStorage;

    //get data from global context
    const appConsumer = useContext(AppContext);

    /**
     * google response handler function
     */
    async function responseGoogle  (response){
        console.log(response);

        //if the google login is succeeded
        if (response.tokenId) {

            let userLoginData = {"tokenId": response.tokenId};

            //call dao for verfying the user and logging him in
            let res = await usersDao.postTokenId(userLoginData);

            //error checking
            if (res && res.message) {
                //pass error object to global context
                appConsumer.setError(res);
            }
            //if success
            else if (res) {
                // set the user data in context provider
                appConsumer.setUser(res.user);
                //and save the token in localStorage
                storage.setItem("userToken", JSON.stringify(res.token));
                //redirect to home page
                props.history.push("/");
            }
            console.log(res);
        }
    }

    /**
     * logout handler function
     */
    function logout (e){
        console.log("logging out");

        //remove token from storage
        localStorage.removeItem("userToken");
        //remove user info from context
        appConsumer.setUser(null);
        //redirect to home page
        props.history.push("/");
    }

    //part of visualization-----------------------------

    //if user is logged, so exists already this attribute in the local storage
    if (storage.getItem("userToken")) {

        //userToken = JSON.parse(storage.getItem("userToken")).token;
        //if there's token it means the user is logged and I print the logout option
        output = (
            <div className="logout-holder">
                <button type="button" onClick={logout}>Log Out</button>
            </div>
        );
    }
    //otherwise I print the login button
    else {

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
