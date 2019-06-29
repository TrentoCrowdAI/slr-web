import React, {useContext, useState} from "react";
import { AppContext } from 'components/providers/appProvider'
import NoImage from "components/svg/noImage";

/*
* this is the component that visualize user information box
* */
const UserInfo = function(props){

    //get data from global context
    const appConsumer = useContext(AppContext);

    //profile image fetch error
    const [fetchError, setFetchError] = useState(false);

    //not logged in as default
    let output = (
        <div className="user">
            <h3>you're not logged in</h3>
        </div>
    );

    let img = <></>;

    if(fetchError){
        img = <div className="no-face" alt="error loading image"><NoImage/></div>
    }else{
        img = <img className="face" alt="profile" src={appConsumer.user.image} onError={() => {setFetchError(true)}}/>
    }

    //if user is logged in I load his data
    if(appConsumer.user){
        output = (
            <div className="user" >
                {img}
                <div className="user-info">
                    {appConsumer.user.name}
                    <br/>
                    {appConsumer.user.surname}
                </div>
            </div>
        );
    }

    return output;

};

export  default  UserInfo;