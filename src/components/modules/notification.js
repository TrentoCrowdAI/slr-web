import React, {useContext, useRef} from "react";

import { AppContext } from 'components/providers/appProvider'
import CloseButton from 'components/svg/closeButton';

/**
 * component for notification
 */
const Notification = function (props) {

    //get data from global context
    const appConsumer = useContext(AppContext);

    const mountKeyRef = useRef("_");

    let output = <></>;

    //if there's a notification I sent it in input
    if(appConsumer.notificationMessage){
        let key = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        mountKeyRef.current = key;

        //I automatically remove it after 5 seconds
        setTimeout(() => {
            console.log((key === mountKeyRef.current));
            if(appConsumer.notificationMessage && (key === mountKeyRef.current)){
                appConsumer.setNotificationMessage(undefined);
            }
        }, 5000);

        output = (
            <div className="top-right-notification">
                <div className="message-content">
                    {appConsumer.notificationMessage}
                </div>
                <button type="button" className="close-notification-btn" onClick={(e) => {appConsumer.setNotificationMessage(undefined)}}>
                    <CloseButton/>
                </button>
            </div>
        );
    }
    return output;
};

export default Notification;