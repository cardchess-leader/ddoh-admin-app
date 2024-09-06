// components/Dropdown.tsx
"use client";

import React from "react";
import Select, { SingleValue } from "react-select";
// import { HumorCategoryList } from "../util";

// Define the structure of your dropdown options
interface Option {
  value: string;
  label: string;
}

// const options: Option[] = HumorCategoryList.map(humorCategory => ({
//   value: humorCategory,
//   label: humorCategory,
// }));

interface DropdownProps {
  options: readonly string[];
  onCategoryChange: (category: string) => void;
  selectedDropdownValue: string | null;
}

const Dropdown: React.FC<DropdownProps> = ({ options, onCategoryChange, selectedDropdownValue }) => {
  // Define the type for selectedOption using SingleValue<Option>
  const handleChange = (selectedOption: SingleValue<Option>) => {
    // Check if selectedOption is not null before accessing its value
    if (selectedOption) {
      onCategoryChange(selectedOption.value);
    }
  };

  const selectOptions:Option[] = options.map(option => ({value: option, label: option}));
  // const selectedOption = options.find(option => option.value === selectedDropdownValue) || null;
  const selectedOption = selectOptions.find(option => option.value === selectedDropdownValue) || null;

  return (
    <Select
      options={selectOptions}
      onChange={handleChange}
      placeholder="Select a Category"
      value={selectedOption}
    />
  );
};

export default Dropdown;
