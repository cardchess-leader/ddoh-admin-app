// src/app/page.tsx
"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Container, Typography, Box } from "@mui/material";
import CalendarComponent from "./components/Calendar"; // Correct relative path
import Dropdown from "./components/Dropdown";
import UUIDList from "./components/UUIDList";
import SimpleForm from "./components/Form";
import { HumorCategoryList, firebaseFunctionUrl, HumorDataKey, defaultHumor, Humor, formatDateToYYYYMMDD } from './util';

const HomePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [humorList, setHumorList] = useState<Humor[] | null>(null)
  const [humorFormData, setHumorFormData] = useState<Humor | null>(null);
  const [submitType, setSubmitType] = useState<'update' | 'create' | null>(null);
  const [isHttpRunning, setIsHttpRunning] = useState<boolean>(false); 
  const [httpMessage, setHttpMessage] = useState<string>('');

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date); // this is set
    setSelectedCategory(null);
    setHumorList(null);
    setHumorFormData(null);
    setSubmitType(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category); // this is set
    setHumorList(null); // this is set (later)
    setHumorFormData(null);
    setSubmitType(null);
    fetchUuids(category); // side effect
  };

  const setFromExistingHumor = (humor: Humor) => {
    setHumorFormData(humor); // this is set
    setSubmitType('update'); // this is set
  }

  const createNewHumor = () => {
    setHumorFormData({...defaultHumor, uuid: uuidv4(), index: humorList?.length || 0}); // this is set
    setSubmitType('create'); // this is set
  }

  const updateHumorFormData = (key: HumorDataKey, value: string | number, arg?: string | number) => {
    console.log(arg);
    switch (key) {
      case 'author': case 'category': case 'context': case 'created_date': case 'punchline': case 'sender': case 'source': case 'uuid':
        setHumorFormData({ ...defaultHumor, ...humorFormData, [key]: value });
        return;
      case 'index':
        setHumorFormData({ ...defaultHumor, ...humorFormData, [key]: Number(value) });
        return;
      case 'context_list':
        const newHumor = { ...defaultHumor, ...humorFormData };
        if (arg === 'add') {
          newHumor[key].push('');
        } else if (arg === 'remove') {
          const index = +value;
          newHumor[key].splice(index, 1);
        } else {
          const index = +(arg ?? 0);
          newHumor[key][index] = String(value);
        }
        setHumorFormData(newHumor);
        return;
    }
  }

  const handleSubmit = async () => {
    try {
      setIsHttpRunning(true);
      let requestUrl = '';
      if (submitType === 'update') {
        requestUrl = `${firebaseFunctionUrl}/updateDailyHumors`;
      } else {
        requestUrl = `${firebaseFunctionUrl}/addDailyHumors`;
      }
      const response = await fetch(
        requestUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...humorFormData!, date: formatDateToYYYYMMDD(selectedDate || new Date())}),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHttpMessage(data.message);
        setSubmitType('update');
      } else {
        console.error(`${submitType} operation Failed`);
      }
    } catch (error) {
      console.error(`${submitType} operation Failed`, error);
    } finally {
      setIsHttpRunning(false);
    }
  }

  const fetchUuids = async (category: string) => {
    console.log('fetchUuid');
    if (category && selectedDate) {
      try {
        setHumorList(null);
        setIsHttpRunning(true);
        const response = await fetch(
          `${firebaseFunctionUrl}/getDailyHumors?category=${category}&date=${formatDateToYYYYMMDD(selectedDate)}`
        );
        if (response.ok) {
          const data = await response.json();
          console.log('data is: ', data);
          setHumorList(data.humorList.map((humor: Humor) => humor));
        } else {
          console.error("Failed to fetch UUIDs");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsHttpRunning(false);
      }
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        <span className="heading">Daily Dose of Humors Admin App</span>
      </Typography>
      <br />
      <Box mb={4}>
        <span className="subheading">Select Date</span>
        <CalendarComponent onDateChange={handleDateChange} />
        <br />
      </Box>
      {selectedDate &&
        <Box mb={4}>
          <span className="subheading">Choose Category</span>
          <Dropdown options={HumorCategoryList} onCategoryChange={handleCategoryChange} selectedDropdownValue={selectedCategory} />
          <br />
        </Box>}
      {selectedDate && selectedCategory &&
        <Box mb={4}>
          <span className="subheading">Select Humors</span><button id='refresh' onClick={() => fetchUuids(selectedCategory || '')}>&#x1F503;</button>
          <div>
            <button className="add-humor" onClick={createNewHumor}>Add Humor</button>
            {!humorList && "Loading Humor List..."}
            {humorList && <UUIDList humorList={humorList} setFromExistingHumor={setFromExistingHumor} />}
          </div>
          <br />
        </Box>}
      {submitType && 
        <Box mb={4}>
          <span className="subheading">Update/Add Humor Details</span>
          {humorFormData != null && <SimpleForm actionName={submitType ?? 'create'} humorFormData={humorFormData} updateHumorFormData={updateHumorFormData} handleSubmit={handleSubmit} isHttpRunning={isHttpRunning}/>}
        </Box>}
      <div>
        {httpMessage}
      </div>
    </Container>
  );
};

export default HomePage;
