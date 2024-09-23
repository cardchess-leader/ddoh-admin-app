"use client";

import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";
import BundleList from "../components/BundleList";
import { firebaseFunctionUrl, Bundle } from '../util';
import BundleDetail from "../components/BundleDetail";
import bcrypt from "bcryptjs";

const BundlePage: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [bundleList, setBundleList] = useState<string[] | null>(null);
    const [bundleDetail, setBundleDetail] = useState<Bundle | null>(null);
    const [isHttpRunning, setIsHttpRunning] = useState<boolean>(false);
    useEffect(() => {
        fetchBundles();
    }, []);
    const fetchBundles = async () => {
        try {
            setBundleList(null);
            setBundleDetail(null);
            setIsHttpRunning(true);
            const response = await fetch(
                `${firebaseFunctionUrl}/getBundleList`
            );
            if (response.ok) {
                const data = await response.json();
                console.log('bundle list is: ', data);
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

    const createNewBundle = async () => {
    }

    const updateBundleDetail = async (key: string, value: string | number, arg?: string | number) => {
        switch (key) {
            case 'bundle_name': case 'category': case 'created_date': case 'humor_count': case 'language_code': case 'thumbnail_path':
              setBundleDetail({ ...bundleDetail!, [key]: value });
              return;
            case 'set_list':
              const newBundleDetail = { ...bundleDetail! };
              if (arg === 'add') {
                newBundleDetail[key].push('');
              } else if (arg === 'remove') {
                const index = +value;
                newBundleDetail[key].splice(index, 1);
              } else {
                const index = +(arg ?? 0);
                newBundleDetail[key][index] = String(value);
              }
              setBundleDetail(newBundleDetail);
              return;
          }
    }

    const setFromExistingBundle = async (uuid: string) => {
        try {
            setIsHttpRunning(true);
            const response = await fetch(
                `${firebaseFunctionUrl}/getBundleDetail?uuid=${uuid}`
            );
            if (response.ok) {
                const data = await response.json();
                setBundleDetail(data.bundleDetail);
            } else {
                console.error("Failed to fetch UUIDs");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsHttpRunning(false);
        }
    }

    const updateCoverImage = async (file: File | null, index: number, method: string) => { // method  should be one of ["add", "replace"]
        if (!bundleDetail || !file) {
            return;
        }
        try {
            setIsHttpRunning(true);
            const requestUrl = `${firebaseFunctionUrl}/updateBundleCoverImages`;
    
            // Create FormData object to hold both the file and other fields
            const formData = new FormData();
            const passwordHash = await bcrypt.hash(password, 10);
    
            // Append file to the FormData object
            formData.append("file", file); // 'file' is the key that will be used to access the file on the backend
            formData.append("bundle_uuid", bundleDetail.uuid);
            formData.append("method", method);
            formData.append("index", index.toString());
            formData.append("passwordHash", passwordHash);
    
            // Send the FormData object via a POST request
            const response = await fetch(requestUrl, {
                method: "POST",
                body: formData, // No need for headers when using FormData, fetch sets them automatically
            });
    
            if (response.ok) {
                setFromExistingBundle(bundleDetail.uuid);
            } else {
                console.error("Operation Failed");
                throw Error();
            }
        } catch (error) {
            console.error("Operation Failed", error);
            setIsHttpRunning(false);
        }
    };

    const removeCoverImage = async (index: number) => {
        try {
            if (!bundleDetail) {
                return;
            }
            setIsHttpRunning(true);
            const requestUrl = `${firebaseFunctionUrl}/removeBundleCoverImages`;
    
            // Create FormData object to hold both the file and other fields
            const passwordHash = await bcrypt.hash(password, 10);

            const response = await fetch(
                requestUrl,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ bundle_uuid: bundleDetail.uuid, index, passwordHash }),
                }
              );
    
            if (response.ok) {
                setFromExistingBundle(bundleDetail.uuid);
            } else {
                console.error("Operation Failed");
                throw Error();
            }
        } catch (error) {
            console.error("Operation Failed", error);
            setIsHttpRunning(false);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                <span className="heading">Daily Dose of Humors Bundle Editor</span>
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
                <span className="subheading">Select Bundles</span><button id='refresh' onClick={() => fetchBundles()}>&#x1F503;</button>
                <div>
                    <button className="add-humor" onClick={createNewBundle}>Add Bundle</button>
                    {!bundleList && "Loading Humor List..."}
                    {bundleList && <BundleList bundleList={bundleList} setFromExistingBundle={setFromExistingBundle} />}
                </div>
                <br />
            </Box>
            {
                bundleDetail && <BundleDetail bundleDetail={bundleDetail} updateBundleDetail={updateBundleDetail} updateCoverImage={updateCoverImage} removeCoverImage={removeCoverImage} />
            }
            {isHttpRunning}
        </Container>
    );
};

export default BundlePage;
