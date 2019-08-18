import React from "react";

import Image from 'components/modules/image';
import SelectTick from 'components/svg/selectTick';

/**
 * userCheckBox for Formik. It's a component, displaying the user data,
 * that acts like a checkbox
 */
const UserCheckbox = ({ user, alreadyScreeners, form, name }) => {

    console.log(alreadyScreeners.current);

    function selectHandler() {
        if(!alreadyScreeners.current.includes(user.id)){
            if(form.values.screeners.includes(user.id)){
                form.setFieldValue(name, form.values.screeners.filter((id) => id !== user.id));
            }else{
                form.setFieldValue(name, [...(form.values.screeners), user.id]);
            }
        }
    }

    var output = (
        <button type="button" className="user-data"
            onClick={selectHandler}
            disabled={alreadyScreeners.current.includes(user.id)}
        >   
        <div className="user-data-image-wrapper">
            <div className="img-wrapper-cover" style={{opacity: (form.values.screeners.includes(user.id) || alreadyScreeners.current.includes(user.id)) ? "0.9" : "0.0"}}>
                <SelectTick color={"white"}/>
            </div>
            <Image className="user-data-image" alt={"profile image"} src={user.data.picture || user.data.image} type= {"profile-pic"}/>
        </div>
        <p className="user-data-names">{user.data.name} {user.data.surname}</p>
        </button>
    );
    return output;
}

export default UserCheckbox;