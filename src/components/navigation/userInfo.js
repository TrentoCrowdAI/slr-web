import React, {useContext} from "react";
import { AppContext } from 'components/providers/appProvider'

import Image from 'components/modules/image';
/*
* this is the component that visualize user information box
* */
const UserInfo = function(props){

    //get data from global context
    const appConsumer = useContext(AppContext);

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
                    <span className="name">{appConsumer.user.name}</span>
                    <span className="surname">{appConsumer.user.surname}</span>
                </div>
            </div>
        );
    }

    return output;

};

export  default  UserInfo;