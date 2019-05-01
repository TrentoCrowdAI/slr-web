import React from "react";

import SelectTick from 'components/svg/selectTick';

const CheckBox = function ({ val, name, label, isChecked, handler }) {

    let output = "";
    let tick = "";
    if(isChecked){
        tick = <SelectTick/>;
    }
    
    output = (
        <label className="checkbox-container">
            <input type="checkbox" value={val} name={name} checked={isChecked} onChange={handler} />
            <span className="checkmark">{tick}</span>
            <span className="name">{label}</span>
        </label>
    );
    return output;
}

export default CheckBox;