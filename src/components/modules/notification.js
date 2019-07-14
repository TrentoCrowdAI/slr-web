import React, {useContext, useRef} from "react";

import { AppContext } from 'components/providers/appProvider'
import CloseButton from 'components/svg/closeButton';

/**
 * component for notification
 */
const Notification = function (props) {

    //get data from global context
    const appConsumer = useContext(AppContext);

    const notificationTimeout = useRef();

    let output = <></>;

    //if there's a notification I sent it in input
    if(appConsumer.notificationMessage){

        //I automatically remove it after 5 seconds
        notificationTimeout.current = setTimeout(() => {
            appConsumer.setNotificationMessage(undefined);
        }, 5000);

        output = (
            <div className="top-right-notification">
                <div className="message-content">
                    {appConsumer.notificationMessage}
                </div>
                <button type="button" className="close-notification-btn" 
                    onClick={(e) => {
                        appConsumer.setNotificationMessage(undefined);
                        clearTimeout(notificationTimeout.current);
                    }}>
                    <CloseButton/>
                </button>
            </div>
        );
    }
    return output;
};

export default Notification;