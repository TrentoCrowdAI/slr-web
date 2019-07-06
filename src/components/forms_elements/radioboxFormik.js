import React, {useState, useEffect} from "react";

import RadioTick from 'components/svg/radioTick';

const RadioBox = function ({ label, name, val, isChecked, form}) {

    let output = "";
    const [tick, setTick] = useState(<></>);
    useEffect(() => {
        if(isChecked){
            setTick(<RadioTick/>);
        }else{
            setTick(<></>)
        }
    }, [isChecked])

    function radioHandler(){
        form.setFieldValue(name, val);
    }

    output= (
        <label className="radiobox-container">
        <input type="radio" value={val} name={name} checked={isChecked} onChange={radioHandler}/>
        <span className="radiomark">{tick}</span>
        <span>{label}</span>
        </label>
    );
    return output;
}

export default RadioBox;