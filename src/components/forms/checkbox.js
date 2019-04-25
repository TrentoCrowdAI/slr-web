import React from "react";

const CheckBox = ({ val, name, label, isChecked, handler }) => (
    <label className="checkbox-container">
      <input type="checkbox" value={val} name={name} defaultChecked={isChecked} onChange={handler} />
      <span className="checkmark"></span>
      <span>{label}</span>
    </label>
);

export default CheckBox;