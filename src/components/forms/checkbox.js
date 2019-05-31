import React, {useState, useEffect} from "react";

import SelectTick from 'components/svg/selectTick';

const CheckBox = function ({ val, name, label, isChecked, handler }) {

    let output = "";
    const [tick, setTick] = useState(<></>);
    useEffect(() => {
        if(isChecked){
            setTick(<SelectTick/>);
        }else{
            setTick(<></>)
        }
    }, [isChecked])

    
    output = (
        <label className="checkbox-container">
            <input type="checkbox" value={val} name={name} checked={isChecked} onChange={(e) => {handler(e)}} />
            <span className="checkmark">{tick}</span>
            <span className="name">{label}</span>
        </label>
    );
    return output;
}

export default CheckBox;