import React, {useState} from "react";
import SelectArrow from 'components/svg/selectArrow';


/**
 * this component acts as an html <select>
 * it needs an array of options, the index of the selected one and the hadler to change the status of the upper component calling this one
 */
const Select = ({ options, selected, handler, type, code }) => {
    
    //this is useful for the animation
    const [focused, setFocused] = useState(false);



    function handleFocus(e){
        //handle arrow animation and focus of menu
        document.getElementById((code) ? "ani-select-arrow" : "ani-select-arrow" + code).beginElement();//trigger svg animation
        setFocused(!focused);
    }

    var output = (
        <div className={(type) ? "custom-select " + type: "custom-select"}>
            <div className="selected" tabIndex={-2} onBlur={handleFocus} onFocus={handleFocus}>{(options[selected]) ? options[selected].label : "[!]"} <div className="arrow">
                <SelectArrow focused={focused} code={code}/>
            </div></div>
            <div className="options-holder" style={{fontSize: (!focused) ? '0px' : '15px', borderBottom: (!focused) ? "0px solid #d7d7d7" : "1px solid #d7d7d7", borderLeft: (!focused) ? "0px solid #d7d7d7" : "1px solid #d7d7d7", borderRight: (!focused) ? "0px solid #d7d7d7" : "1px solid #d7d7d7", borderTop:"none"}}>
                {options.map((element, index) => (
                <div key={index} data-value={index} className="option" style={{padding: (!focused) ? '0px' : '2px' }} onMouseDown={handler}>
                    {element.label}
                </div>))}
            </div>
        </div>
    );
    return output;
}

export default Select;