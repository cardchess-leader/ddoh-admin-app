// components/UUIDList.tsx
"use client";

import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Humor } from '../util';


interface UUIDListProps {
  humorList: Humor[];
  setHumorFormData: (humor: Humor) => void
}

const UUIDList: React.FC<UUIDListProps> = ({ humorList, setHumorFormData }) => {
  return (
    <List>
      {humorList.map((humor) => (
        <ListItem key={humor.uuid} component="button" onClick={() => setHumorFormData(humor)}>
          <ListItemText primary={humor.uuid} />
        </ListItem>
      ))}
    </List>
  );
};

export default UUIDList;
