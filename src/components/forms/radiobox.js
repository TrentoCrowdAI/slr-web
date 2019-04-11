import React from "react";

const RadioBox = ({ label, name, val, isChecked }) => (
    <label className="radiobox-container">
      <input type="radio" value={val} name={name} defaultChecked={isChecked} />
      <span className="radiomark"></span>
      <span>{label}</span>
    </label>
);

export default RadioBox;