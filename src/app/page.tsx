// src/app/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import CalendarComponent from "./components/Calendar"; // Correct relative path
import Dropdown from "./components/Dropdown";
import UUIDList from "./components/UUIDList";
import SimpleForm from "./components/Form";
import { HumorCategoryList, firebaseFunctionUrl, HumorDataKey, defaultHumor, Humor } from './util';

const HomePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // const [uuids, setUuids] = useState<string[]>([]);
  const [humorList, setHumorList] = useState<Humor[]>([])
  const [humorFormData, setHumorFormData] = useState<Humor | null>(null); 

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedCategory(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const updateHumorFormData = (key: HumorDataKey, value: string | number, arg?: string | number) => {
    console.log(arg);
    switch(key) {
      case 'author': case 'category': case 'context': case 'created_date': case 'punchline': case 'sender': case 'source': case 'uuid':
        setHumorFormData({...defaultHumor, ...humorFormData, [key]: value});
      return;
    }
  }

  const fetchUuids = async () => {
    console.log('fetchUuid');
    if (selectedDate && selectedCategory) {
      try {
        const response = await fetch(
          `${firebaseFunctionUrl}?category=${selectedCategory}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('data is: ', data);
          // setUuids(data.humorList.map((humor: { id: string }) => humor.id));
          setHumorList(data.humorList.map((humor: Humor) => humor));
        } else {
          console.error("Failed to fetch UUIDs");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchUuids();
  }, [selectedDate, selectedCategory]);

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        <span className="heading">Daily Dose of Humors Admin App</span>
      </Typography>
      <Box mb={4}>
        <span className="subheading">Select Date</span>
        <CalendarComponent onDateChange={handleDateChange} />
      </Box>
      <Box mb={4}>
        <span className="subheading">Choose Category</span>
        <Dropdown options={HumorCategoryList} onCategoryChange={handleCategoryChange} selectedDropdownValue={selectedCategory} />
      </Box>
      {humorList.length > 0 && <div><span className="subheading">Humors List</span><UUIDList humorList={humorList} setHumorFormData={setHumorFormData}/></div>}
      {humorFormData != null && <SimpleForm humorFormData={humorFormData} updateHumorFormData={updateHumorFormData}/>}
    </Container>
  );
};

export default HomePage;
