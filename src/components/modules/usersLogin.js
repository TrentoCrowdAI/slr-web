import React, {useContext} from 'react';
import {withRouter} from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';

import config from 'config/index'

import {AppContext} from 'components/providers/appProvider';


/**
 * this component handles the google login and logout from the platform
 */
const UsersLogin = function (props) {

    //output var
    let output = <></>;

    //get the localStorage object
    const storage = window.localStorage;

    //get data from global context
    const appConsumer = useContext(AppContext);

    /**
     * google response handler function
     */
    async function responseGoogle(response){
        //if the google login is succeeded
        if (response.tokenId) {
            console.log(response.profileObj);
            let user = {"email": response.profileObj.email, 
                        "name": response.profileObj.givenName, 
                        "surname": response.profileObj.familyName, 
                        "image": response.profileObj.imageUrl};

            // set the user data in context provider
            appConsumer.setUser(user);
            //and save the token as string in localStorage
            storage.setItem("userToken", response.tokenId);

            
        }
    }

    //part of visualization-----------------------------

    //if there's no token or I'm not fetching an user
    if (!appConsumer.userFetch && !appConsumer.user) {
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

export default UsersLogin;
