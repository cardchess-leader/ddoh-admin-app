// components/BundleList.tsx
"use client";

import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";


interface BundleListProps {
    bundleList: string[];
  setFromExistingBundle: (uuid: string) => void
}

const BundleList: React.FC<BundleListProps> = ({ bundleList, setFromExistingBundle }) => {
  return (
    <List>
      {bundleList.map((uuid) => (
        <ListItem className='uuid-item' key={uuid} component="button" onClick={() => setFromExistingBundle(uuid)}>
          <ListItemText primary={uuid} />
        </ListItem>
      ))}
    </List>
  );
};

export default BundleList;
