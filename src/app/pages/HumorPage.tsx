"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { Container, Typography, Box } from "@mui/material";
import CalendarComponent from "../components/Calendar"; // Correct relative path
import Dropdown from "../components/Dropdown";
import UUIDList from "../components/UUIDList";
import HumorDetail from "../components/HumorDetail";
import { HumorCategoryList, HumorCategory, firebaseFunctionUrl, HumorDataKey, defaultHumor, Humor, formatDateToYYYYMMDD, Bundle } from '../util';

const HumorPage: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<HumorCategory | null>(null);
  const [humorList, setHumorList] = useState<Humor[] | null>(null)
  const [humorFormData, setHumorFormData] = useState<Humor | null>(null);
  const [submitType, setSubmitType] = useState<'update' | 'create' | null>(null);
  const [isHttpRunning, setIsHttpRunning] = useState<boolean>(false);
  const [httpMessage, setHttpMessage] = useState<string>('');
  const [bundleList, setBundleList] = useState<Bundle[] | null>(null);

  useEffect(() => {
    fetchBundles();
  }, []);

  const fetchBundles = async () => {
    try {
        const response = await fetch(
            `${firebaseFunctionUrl}/getBundleList` // fetch both active and inactive ones
        );
        if (response.ok) {
            const data = await response.json();
            setBundleList(data.bundleList);
        } else {
            console.error("Failed to fetch UUIDs");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setIsHttpRunning(false);
    }
}

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedCategory(null);
    setHumorList(null);
    setHumorFormData(null);
    setSubmitType(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category as HumorCategory);
    setHumorList(null);
    setHumorFormData(null);
    setSubmitType(null);
    fetchUuids(category);
  };

  const setFromExistingHumor = (humor: Humor) => {
    setHumorFormData(humor);
    setSubmitType('update');
  }

  const createNewHumor = () => {
    setHumorFormData({ ...defaultHumor, uuid: uuidv4(), index: humorList?.length || 0, release_date: formatDateToYYYYMMDD(selectedDate || new Date()), category: selectedCategory! });
    setSubmitType('create');
  }

  const updateHumorFormData = (key: HumorDataKey, value: string | number | boolean, arg?: string | number) => {
    switch (key) {
      case 'active':
        setHumorFormData({ ...defaultHumor, ...humorFormData, [key]: value as boolean });
        return;
      case 'author': case 'category': case 'context': case 'release_date': case 'punchline': case 'sender': case 'source': case 'uuid':
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
      const passwordHash = await bcrypt.hash(password, 10);
      const response = await fetch(
        requestUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...humorFormData!, date: formatDateToYYYYMMDD(selectedDate || new Date()), passwordHash }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setHttpMessage(data.message);
        setSubmitType('update');
      } else {
        console.error(`${submitType} operation Failed`);
        setHttpMessage(`${submitType} operation Failed`);
      }
    } catch (error) {
      console.error(`${submitType} operation Failed`, error);
      setHttpMessage(`${submitType} operation Failed, ${error}`);
    } finally {
      setIsHttpRunning(false);
    }
  }

  const fetchUuids = async (category: string) => {
    if (category && selectedDate) {
      try {
        setHumorList(null);
        setIsHttpRunning(true);
        const response = await fetch(
          `${firebaseFunctionUrl}/getHumors?category=${category}&date=${formatDateToYYYYMMDD(selectedDate)}`
        );
        if (response.ok) {
          const data = await response.json();
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
        <span className="heading">Daily Dose of Humors Daily Editor</span>
      </Typography>
      <br />
      <Box mb={4}>
        <span className="subheading">Enter Password</span>
        <input
          type="password"
          className="form-control flex-1"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
      </Box>
      <Box mb={4}>
        <span className="subheading">Select Date</span>
        <CalendarComponent onDateChange={handleDateChange} />
        <br />
      </Box>
      {selectedDate &&
        <Box mb={4}>
          <span className="subheading">Choose Category</span>
          <Dropdown options={HumorCategoryList.map(category => ({label: category, value: category}))} onChange={handleCategoryChange} selectedDropdownValue={selectedCategory} />
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
          {humorFormData != null && <HumorDetail humorBundleList={bundleList || []} submitType={submitType} humorFormData={humorFormData} updateHumorFormData={updateHumorFormData} handleSubmit={handleSubmit} isHttpRunning={isHttpRunning} />}
        </Box>}
      <div>
        {httpMessage}
      </div>
    </Container>
  );
};

export default HumorPage;