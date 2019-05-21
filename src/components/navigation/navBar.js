import React, {useContext} from "react";

import {AppContext} from "components/providers/appProvider";
import EditButton from "components/svg/editButton";

/**
 * this is the head component of page
 * @param props
 * @param "menu_elements" contains the list of menu-items
 */


const NavBar = function(props){

    //get data from global context
    const appConsumer = useContext(AppContext);

    
    return (
        <div className="navigation-wrapper">

            {/*background of the menu-bar*/}
            <nav className={appConsumer.user ? "main-nav" : "main-nav nav-title-to-left"}>
                {appConsumer.title}
            </nav>
            {props.children}

        </div>
    );
}

export default NavBar;