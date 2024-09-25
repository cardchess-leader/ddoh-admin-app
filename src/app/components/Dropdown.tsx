// components/Dropdown.tsx
"use client";

import React from "react";
import Select, { SingleValue } from "react-select";
interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: readonly {label: string, value: string}[];
  onChange: (value: string) => void;
  selectedDropdownValue: string | null;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onChange, selectedDropdownValue }) => {
  // Define the type for selectedOption using SingleValue<Option>
  const handleChange = (selectedOption: SingleValue<Option>) => {
    // Check if selectedOption is not null before accessing its value
    if (selectedOption) {
      onChange(selectedOption.value);
    }
  };

  const selectedOption = options.find(option => option.value === selectedDropdownValue) || null;

  return (
    <Select
      options={options}
      onChange={handleChange}
      placeholder="Select a Category"
      value={selectedOption}
    />
  );
};

export default Dropdown;
