import React from "react";

import Image from 'components/modules/image';
import SelectTick from 'components/svg/selectTick';

/**
 * userCheckBox for Formik
 */
const UserCheckbox = ({ user, form, name }) => {

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
            <div className="img-wrapper-cover" style={{opacity: (form.values.screeners.includes(user.id)) ? "0.9" : "0.0"}}>
                <SelectTick color={"white"}/>
            </div>
            <Image className="user-data-image" alt={"profile image"} src={user.data.picture || user.data.image}/>
        </div>
        <p className="user-data-names">{user.data.name} {user.data.surname}</p>
        </button>
    );
    return output;
}

export default UserCheckbox;