"use client";

import React, { useState } from "react";
import HumorPage from "./pages/HumorPage";
import BundlePage from "./pages/BundlePage";

const HomePage: React.FC = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [password, setPassword] = useState<string>('');
  const [isHttpRunning, setIsHttpRunning] = useState<boolean>(false);

  const handleToggle = () => {
    setIsToggled(!isToggled); // Toggle the state
  };

  return (
    <div>
      <div className="toggle-row" style={{ margin: "10px 10px 20px 10px" }}>
        <div className="text">Editor Mode: <span style={{ color: isToggled ? "#2196f3" : "#ff6666" }}>{isToggled ? "Humor Bundles" : "Daily Humors"}</span></div>
        <label className="toggle-switch">
          <input type="checkbox" checked={isToggled} onChange={handleToggle} />
          <span className="slider" />
        </label>
      </div>
      <div>
      </div>
      <div>
        <span className="subheading">Enter Password</span>
        <input
          type="password"
          className="form-control flex-1"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <br />
      </div>
      {isToggled ? <BundlePage password={password} isHttpRunning={isHttpRunning} setIsHttpRunning={setIsHttpRunning} /> : <HumorPage password={password} isHttpRunning={isHttpRunning} setIsHttpRunning={setIsHttpRunning} />}
      {isHttpRunning && <div style={{ position: "fixed", display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%", backgroundColor: "rgba(255, 255, 255, 0.3)", top: "0", left: "0" }}>
        <h1 style={{ fontSize: 50 }}>
          Waiting for server response...
          <br />
          Please wait...
        </h1>
      </div>}
    </div>);
};

export default HomePage;
