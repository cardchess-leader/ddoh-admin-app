// components/BundleList.tsx
"use client";

import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { Bundle } from '../util';


interface BundleListProps {
    bundleList: Bundle[];
  setFromExistingBundle: (bundle: Bundle) => void
}

const BundleList: React.FC<BundleListProps> = ({ bundleList, setFromExistingBundle }) => {
  return (
    <List>
      {bundleList.map((bundle) => (
        <ListItem className='uuid-item' key={bundle.uuid} component="button" onClick={() => setFromExistingBundle(bundle)}>
          <ListItemText primary={bundle.uuid} secondary={bundle.title} />
        </ListItem>
      ))}
    </List>
  );
};

export default BundleList;
