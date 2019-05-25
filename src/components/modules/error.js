import React, {useContext, useEffect} from 'react';
import {withRouter} from 'react-router-dom';

import {AppContext} from "components/providers/appProvider";
import {usersDao} from "dao/users.dao";

const Error = function (props) {

    //get data from global context
    const appConsumer = useContext(AppContext);

    //useful router stuff
    const { history } = props;

    useEffect(() => {
        console.log(appConsumer.error.payload.statusCode);

        //once the component is mounted I go immediately back if error is 401
        if(appConsumer.error.payload.statusCode === 401 || appConsumer.error.payload.message === "the token does not match any user!"){
            console.log("unauth call")
            //once I get unauthorized error I check whether the user token is expired
            const storage = window.localStorage;
            if (storage.getItem("userToken")) {
                async function getUserData(){
                    let res = await usersDao.getUserByTokenId(storage.getItem("userToken"));
                    //If the token is expired I remove it and I logout the user
                    if(res && res.message){
                        console.log("INVALID TOKEN");
                        storage.removeItem("userToken");
                        appConsumer.setUser(null);
                    }else{
                        console.log("VALID TOKEN");
                    }
                    
                }
                console.log("checking token")
                getUserData();
            }
            //then I go back
            console.log("pushing back")
            history.goBack();
            appConsumer.setError(null);
        }

        return () => {
            //delete the error, so app can resume its work
            appConsumer.setError(null);
        }

    }, []);
    

    //function to delete the error object in context
    function handleOnRefresh(){
        appConsumer.setError(null);
    }
    //function to return to previous page
    function handleOnGoBack(){
        history.goBack();
        appConsumer.setError(null);
    }

    //console.dir(appConsumer.error);
    let output = <></>;

    //is a error from backend
    if (appConsumer.error.payload) {
        output = (
            <>
                <p>Error code:</p>
                <p>{appConsumer.error.payload.statusCode}</p>
                <p>Error name:</p>
                <p>{appConsumer.error.payload.error}</p>
                <p>Error message</p>
                <p>{appConsumer.error.payload.message}</p>
            </>
        );
    }

    //is a error of other type
    else {
        output = (
            <>
                <p>Error name:</p>
                <p>{appConsumer.error.name}</p>
                <p>Error message</p>
                <p>{appConsumer.error.message}</p>
            </>
        );
    }

    output = (
        <div className="error-wrapper" style={{textAlign: "center"}}>
            {output}
            <br/>
            <button type="button" onClick={handleOnGoBack}><u>return to previous page</u></button>
            <br/>
            <p>or</p>
            <br/>
            <button type="button" onClick={handleOnRefresh}><u>refresh</u></button>

        </div>
    );

    return output;

}


export default withRouter(Error);