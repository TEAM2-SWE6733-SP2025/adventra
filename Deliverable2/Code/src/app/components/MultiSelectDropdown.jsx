import React from "react";

const MultiSelectDropdown = ({ options, selected, onChange }) => {
  return (
    <select
      multiple
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full"
    >
      {options.map((option) => (
        <option
          key={option}
          value={option}
          selected={selected.includes(option)}
        >
          {option}
        </option>
      ))}
    </select>
  );
};

export default MultiSelectDropdown;
