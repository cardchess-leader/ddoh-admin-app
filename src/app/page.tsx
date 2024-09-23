"use client";

import React, { useState } from "react";
import DailyPage from "./pages/DailyPage";
import BundlePage from "./pages/BundlePage";

const HomePage: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  return (
    <div>
      <div className="toggle-row">
        <div className="text">Editor Mode: <span style={{color: isToggled ? "#2196f3" : "#ff6666"}}>{isToggled ? "Humor Bundles" : "Daily Humors"}</span></div>
        <label className="toggle-switch">
          <input type="checkbox" checked={isToggled} onChange={handleToggle} />
          <span className="slider" />
        </label>
      </div>
      {isToggled ? <BundlePage /> : <DailyPage />}
    </div>);
};

export default HomePage;
