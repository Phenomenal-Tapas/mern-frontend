import React from "react";
import ReactDOM from "react-dom";
import "../../../styles/Backdrop.css";

const Backdrop = (props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document.getElementById("drawer-backdrop")
  );
};

export default Backdrop;