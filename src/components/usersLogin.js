import React, {useContext} from 'react';
import {withRouter} from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';

import config from 'config/index'

import {usersDao} from 'dao/users.dao'

import {AppContext} from 'components/providers/appProvider';


/**
 * this component handles the google login and logout from the platform
 */
const UsersLogin = function (props) {

    //output var
    let output = <></>;

    //get the localStorage object
    const storage = window.localStorage;

    //get history element from router
    const { history } = props;

    //get data from global context
    const appConsumer = useContext(AppContext);

    /**
     * google response handler function
     */
    async function responseGoogle(response){

        //if the google login is succeeded
        if (response.tokenId) {

            let userLoginData = {"tokenId": response.tokenId};

            appConsumer.setUserFetch(true);

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
                //and save the token as string in localStorage
                storage.setItem("userToken", res.token);


                //redirect to home page
                history.push("/");
            }
            
            appConsumer.setUserFetch(false);
        }
    }

    //part of visualization-----------------------------

    //if there's no token or I'm not fetching an user
    if (!storage.getItem("userToken") && !appConsumer.userFetch) {

        output = (
            <div className="login-holder">
                <GoogleLogin
                    clientId={config.google_login_client_id}
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

export default withRouter(UsersLogin); //I export passing router components
