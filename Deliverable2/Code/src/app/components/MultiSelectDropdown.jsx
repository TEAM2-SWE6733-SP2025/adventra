import React from "react";
import Select from "react-select";

export default function MultiSelectDropdown({ options, selected, onChange }) {
  const formattedOptions = options.map((option) => ({
    value: option,
    label: option,
  }));

  const formattedSelected = selected.map((value) => ({
    value,
    label: value,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "rgb(31 41 55)",
      borderColor: "rgb(234 179 8)",
      color: "white",
      padding: "0.5rem",
      borderRadius: "0.375rem",
      boxShadow: "none",
      "&:hover": {
        borderColor: "rgb(202 138 4)",
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "rgb(31 41 55)",
      color: "white",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "rgb(55 65 81)",
      color: "white",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "white",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "white",
      "&:hover": {
        backgroundColor: "rgb(202 138 4)",
        color: "white",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgb(55 65 81)" : "rgb(31 41 55)",
      color: "white",
      "&:hover": {
        backgroundColor: "rgb(55 65 81)",
      },
    }),
  };

  return (
    <Select
      isMulti
      options={formattedOptions}
      value={formattedSelected}
      onChange={(selectedOptions) =>
        onChange(selectedOptions.map((option) => option.value))
      }
      styles={customStyles}
      className="w-full"
      classNamePrefix="react-select"
    />
  );
}
