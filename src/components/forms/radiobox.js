import React from "react";

const RadioBox = ({ label, name, val, isChecked , handler}) => (
    <label className="radiobox-container">
      <input type="radio" value={val} name={name} checked={isChecked} onChange={handler}/>
      <span className="radiomark"/>
      <span>{label}</span>
    </label>
);

export default RadioBox;