import React from "react";

import RadioTick from 'components/svg/radioTick';

const RadioBox = function ({ label, name, val, isChecked , handler}) {

    let output = "";
    let tick = "";
    if(isChecked){
        tick = <RadioTick/>;
    }

    output= (
        <label className="radiobox-container">
        <input type="radio" value={val} name={name} checked={isChecked} onChange={handler}/>
        <span className="radiomark">{tick}</span>
        <span>{label}</span>
        </label>
    );
    return output;
}

export default RadioBox;