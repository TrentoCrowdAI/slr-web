import React, {useState, useEffect} from "react";

import Image from 'components/modules/image';

/**
 * userCheckBox for Formik
 */
const UserCheckbox = ({ selected, user, form, name }) => {

    function selectHandler() {
        if(form.values.screeners.includes(user.id)){
            form.setFieldValue(name, form.values.screeners.filter((id) => id !== user.id));
        }else{
            form.setFieldValue(name, [...(form.values.screeners), user.id]);
        }
    }

    var output = (
        <button type="button" className="user-data"
            onClick={selectHandler}
        >   
        <div className="user-data-image-wrapper">
            <div className="img-wrapper-cover" style={{opacity: (selected) ? "0.5" : "0.0"}}/>
            <Image className="user-data-image" alt={"profile image"} src={user.image}/>
        </div>
        <p className="user-data-names">{user.name} {user.surname}</p>
        </button>
    );
    return output;
}

export default UserCheckbox;