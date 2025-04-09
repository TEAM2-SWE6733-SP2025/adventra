import React from "react";

const EditableField = ({
  isEditing,
  value,
  onChange,
  type = "text",
  placeholder = "",
  className = "",
  rows = 1,
  children,
}) => {
  return isEditing ? (
    type === "textarea" ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full ${className}`}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full ${className}`}
      />
    )
  ) : (
    <p className={`text-gray-400 text-lg ${className}`}>{children || value}</p>
  );
};

export default EditableField;
