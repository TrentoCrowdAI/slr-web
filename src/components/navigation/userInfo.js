import React, {useContext, useState} from "react";
import { AppContext } from 'components/providers/appProvider'

import Image from 'components/modules/image';
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

    //if user is logged in I load his data
    if(appConsumer.user){
        output = (
            <div className="user" >
                <Image className="face" alt="profile picture" src={appConsumer.user.image}/>
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