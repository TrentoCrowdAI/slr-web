import React, {useState, useContext} from "react";
import {Link} from 'react-router-dom';

import { AppContext } from 'components/providers/appProvider'
import {usersDao} from 'dao/users.dao';

import UserInfo from 'components/navigation/userInfo';
import config from 'config/index';
import MenuButton from 'components/svg/menuButton';
import Cover from 'components/modules/cover';

/**
 *this is the side menu component
 */
const SideMenu = function (props) {

    //get data from global context
    const appConsumer = useContext(AppContext);

    //bool to control the visualization of menu
    const [shown, setShown] = useState(false);
    const [firstTime, setFirstTime] = useState(true);


    //function to open/close the menu
    function handleToggleMenuButton() {
        setShown(!shown);
        setFirstTime(false);
    }

    //function to close the menu
    function handleMenuBlur(e) {
        setShown(false);
    }

    /**
     * logout handler function
     */
    async function logout (e){
        console.log("logging out");

        //this way we won't trigger the menu animation again if the user logs in again 
        setFirstTime(true);

        appConsumer.setUserFetch(true);

        //call dao for logging user out
        let res = await usersDao.logoutUser();

        //error checking
        if (res && res.message) {
            //pass error object to global context
            appConsumer.setError(res);
        }
        //if success
        else if (res) {

            //remove token from storage
            localStorage.removeItem("userToken");
            //remove user info from context
            appConsumer.setUser(null);
            //redirect to home page
            //props.history.push("/");

        }

        appConsumer.setUserFetch(false);

    }

    //change the class of element by menu state
    var clsidemenu = "modal side-menu up";
    var clsbutton = "button-wrapper close";

    if (firstTime) {
        clsidemenu = "modal side-menu"
    }
    if (shown) {
        clsbutton = "button-wrapper open"
        clsidemenu = "modal side-menu down"
    }

    if(appConsumer.user){
        return (
            <div className="menu">
                <Cover cls={(shown) ? "full-screen-transparent" : ""} handler={handleMenuBlur}/>
                <div className={clsbutton} onClick={handleToggleMenuButton}>
                    <MenuButton/>
                </div>

                <div className={clsidemenu} tabIndex={-1}>

                    {/*user info box*/}
                    <UserInfo/>
                    <PrintMenu handleMenuBlur={handleMenuBlur}/>
                    <div className="entry-holder">
                        <button type="button" className="menu-option" onClick={logout} onMouseUp={handleMenuBlur}>Log out</button>
                    </div>
                </div>
            </div>
        );
    }else{
        return (
            <div className="menu">
            </div>
        );
    }
};

/**
 *internal component that is used only for print menu items
 */
const PrintMenu = function (props) {

    let output = (
        config.menu_list.map((element, index) => (
                <div key={index} className="entry-holder">
                    <Link to={element.link} className="menu-option"
                          onMouseUp={props.handleMenuBlur}>{element.content}</Link>
                </div>
            )
        )
    );
    return output;


}


export default SideMenu;