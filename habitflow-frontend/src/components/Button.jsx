import React from "react";

const Button = ({
  onClick= ()=>{},
  label,
  bgColor = "bg-emerald-500",
  hoverColor = "hover:bg-emerald-600",
  textColor = "text-white",
  className = "",
  type="button",
  disabled=false
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 ${bgColor} ${textColor} rounded-lg ${hoverColor} 
        transition-colors duration-200 flex items-center justify-center space-x-2 shadow-md ${className}`}
    >
      <span className="font-semibold">{label}</span>
    </button>
  );
};

export default Button;
