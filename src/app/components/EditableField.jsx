import React from "react";

const EditableField = ({
  isEditing,
  value,
  onChange,
  type = "text",
  children,
}) => {
  return isEditing ? (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full"
    />
  ) : (
    <p className="text-gray-400 text-lg">{children || value}</p>
  );
};

export default EditableField;
