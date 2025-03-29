import React from "react";

function Button(props) {
  return (
    <button
      className={`cursor-pointer px-4 py-1 rounded-2xl transition-all duration-300 bg-${props.color} hover:text-white hover:shadow-lg hover:scale-105`}
    >
      {props.value}
    </button>
  );
}

export default Button;
