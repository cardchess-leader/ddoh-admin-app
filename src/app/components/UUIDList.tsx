// components/UUIDList.tsx
"use client";

import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Humor } from '../util';


interface UUIDListProps {
  humorList: Humor[];
  setFromExistingHumor: (humor: Humor) => void
}

const UUIDList: React.FC<UUIDListProps> = ({ humorList, setFromExistingHumor }) => {
  return (
    <List>
      {humorList.map((humor) => (
        <ListItem className='uuid-item' key={humor.uuid} component="button" onClick={() => setFromExistingHumor(humor)}>
          <ListItemText primary={humor.uuid} />
        </ListItem>
      ))}
    </List>
  );
};

export default UUIDList;
