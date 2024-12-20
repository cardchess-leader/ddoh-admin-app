"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container, Typography, Box } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import BundleList from "../components/BundleList";
import { firebaseFunctionUrl, Bundle, defaultBundle, formatDateToYYYYMMDD } from '../util';
import BundleDetail from "../components/BundleDetail";
import bcrypt from "bcryptjs";

interface BundlePageProps {
    password: string;
    isHttpRunning: boolean;
    setIsHttpRunning: (isRunning: boolean) => void;
  }

const BundlePage: React.FC<BundlePageProps> = ({password, isHttpRunning, setIsHttpRunning}) => {
    const [bundleList, setBundleList] = useState<Bundle[] | null>(null);
    const [bundleDetail, setBundleDetail] = useState<Bundle | null>(null);
    const [submitType, setSubmitType] = useState<'update' | 'create' | null>(null);
    const [httpMessage, setHttpMessage] = useState<string>('');

    // Memoize fetchBundles using useCallback to avoid recreating the function on each render
    const fetchBundles = useCallback(async () => {
        try {
            setBundleList(null);
            setBundleDetail(null);
            setIsHttpRunning(true);
            
            const response = await fetch(`${firebaseFunctionUrl}/getBundleList`);
            
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
    }, []); // Empty dependency array ensures this function is stable and doesn't change

    // useEffect will run fetchBundles only once (on initial render)
    useEffect(() => {
        fetchBundles();
    }, [fetchBundles]); // Safe to include fetchBundles in the dependency array now

    const createNewBundle = async () => {
        setBundleDetail({ ...defaultBundle, uuid: uuidv4(), release_date: formatDateToYYYYMMDD(new Date()) });
        setSubmitType('create');
    }

    const updateBundleDetail = async (key: string, value: string | number | boolean) => {
        switch (key) {
            case 'title': case 'description': case 'category': case 'release_date': case 'product_id': // string values
                setBundleDetail({ ...defaultBundle, ...bundleDetail!, [key]: value });
                return;
            case 'humor_count': case 'preview_count': // int value
                if (isNaN(+value) || value === '') {
                    return;
                }
                setBundleDetail({ ...defaultBundle, ...bundleDetail!, [key]: +value }); // ensure int
                return;
            case 'language_code': // 2 letter string value
                if (typeof value !== 'string' || value.length > 2) {
                    return;
                }
                setBundleDetail({ ...defaultBundle, ...bundleDetail!, [key]: value });
                return;
            case 'active': case 'preview_show_punchline_yn': // boolean value
                setBundleDetail({ ...defaultBundle, ...bundleDetail!, [key]: value as boolean });
                return;
        }
    }

    const setFromExistingBundle = async (bundle: Bundle) => {
        try {
            setBundleDetail({...defaultBundle, ...bundle});
            setSubmitType('update');
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsHttpRunning(false);
            printBundleLikesCount(bundle.uuid);
        }
    }

    const setFromBundleUuid = async (uuid: string) => {
        try {
            setIsHttpRunning(true);
            const response = await fetch(
                `${firebaseFunctionUrl}/getBundleDetail?uuid=${uuid}`
            );
            if (response.ok) {
                const data = await response.json();
                setBundleDetail(data.bundleDetail);
                setSubmitType('update');
            } else {
                console.error("Failed to fetch UUIDs");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsHttpRunning(false);
            printBundleLikesCount(uuid);
        }
    }

    const printBundleLikesCount = async (uuid: string) => {
        try {
            const response = await fetch(
                `${firebaseFunctionUrl}/getBundleTotalLikes?uuid=${uuid}`
            );
            if (response.ok) {
                const data = await response.json();
                console.log(`Total likes count for bundle ${uuid} is: \n${data.totalLikes}`);
            } else {
                console.error("Failed to fetch total likes count.");
            }
        } catch (error) {
            console.error("Error fetching total likes count.", error);
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
            formData.append("uuid", bundleDetail.uuid);
            formData.append("method", method);
            formData.append("index", index.toString());
            formData.append("passwordHash", passwordHash);

            // Send the FormData object via a POST request
            const response = await fetch(requestUrl, {
                method: "POST",
                body: formData, // No need for headers when using FormData, fetch sets them automatically
            });

            if (response.ok) {
                setFromBundleUuid(bundleDetail.uuid);
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
                    body: JSON.stringify({ uuid: bundleDetail.uuid, index, passwordHash }),
                }
            );

            if (response.ok) {
                setFromBundleUuid(bundleDetail.uuid);
            } else {
                console.error("Operation Failed");
                throw Error();
            }
        } catch (error) {
            console.error("Operation Failed", error);
            setIsHttpRunning(false);
        }
    };

    const handleSubmit = async () => {
        try {
            setIsHttpRunning(true);
            let requestUrl = '';
            if (submitType === 'create') {
                requestUrl = `${firebaseFunctionUrl}/addHumorBundle`;
            } else if (submitType === 'update') {
                requestUrl = `${firebaseFunctionUrl}/updateHumorBundle`;
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const response = await fetch(
                requestUrl,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ ...bundleDetail, passwordHash }),
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
            const uuid = bundleDetail!.uuid;
            fetchBundles();
            setFromBundleUuid(uuid);
        } catch (error) {
            console.error(`${submitType} operation Failed`, error);
            setHttpMessage(`${submitType} operation Failed, ${error}`);
        } finally {
            setIsHttpRunning(false);
        }
    }

    return (
        <Container maxWidth="md">
            <Typography variant="h4" gutterBottom>
                <span className="heading">Daily Dose of Humors Bundle Editor</span>
            </Typography>
            <br />
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
                (submitType && bundleDetail) && <BundleDetail bundleDetail={bundleDetail} updateBundleDetail={updateBundleDetail} updateCoverImage={updateCoverImage} removeCoverImage={removeCoverImage} submitType={submitType} isHttpRunning={isHttpRunning} handleSubmit={handleSubmit} />
            }
            <div>
                {httpMessage}
            </div>
        </Container>
    );
};

export default BundlePage;
