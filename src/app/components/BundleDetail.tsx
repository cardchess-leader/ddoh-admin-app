'use client';

// import React, { useState } from 'react';
import React from 'react';
import { HumorCategoryList, Bundle } from '../util';
import Dropdown from "./Dropdown";
import Image from 'next/image';

interface BundleDetailProps {
    bundleDetail: Bundle
    updateBundleDetail: (key: string, value: string | number | boolean, arg?: string | number) => void
    updateCoverImage: (file: File | null, index: number, method: string) => void
    removeCoverImage: (index: number) => void
    updateThumbnailImage: (file: File | null) => void
    submitType: 'create' | 'update';
    isHttpRunning: boolean;
    handleSubmit: () => void;
}


const BundleDetail: React.FC<BundleDetailProps> = ({ bundleDetail, updateBundleDetail, updateCoverImage, removeCoverImage, updateThumbnailImage, submitType, isHttpRunning, handleSubmit }) => {
    return (
        <div className="form border rounded shadow-sm">
            <div className="mb-3 p-4 flex">
                <label htmlFor="sender" className="form-label">
                    UUID
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    value={bundleDetail.uuid}
                    required
                    readOnly
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="uuid" className="form-label">
                    Bundle Name
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    value={bundleDetail.bundle_name}
                    onChange={e => updateBundleDetail('bundle_name', e.target.value)}
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="uuid" className="form-label">
                    Active
                </label>
                <input
                    type="checkbox"
                    className="form-control"
                    checked={bundleDetail.active}
                    onChange={e => updateBundleDetail('active', e.target.checked)}
                    style={{ width: "30px", height: "30px" }}
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="category" className="form-label">
                    Category
                </label>
                <div className="flex-1">
                    <Dropdown options={HumorCategoryList.map(category => ({label: category, value: category}))} onChange={(category) => updateBundleDetail('category', category)} selectedDropdownValue={bundleDetail.category} />
                </div>
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label className="form-label">
                    Cover Image List
                </label>
                <div className="flex-1">
                    {bundleDetail.cover_img_list.map((img_url, index) => (
                        <div key={index} className='context-list-row flex' style={{ alignItems: "center" }}>
                            <Image 
                                src={img_url} 
                                alt={img_url} 
                                width={50} 
                                height={50} 
                                style={{ marginRight: "25px", overflow: "hidden" }}
                                />
                            <div style={{ flexGrow: 1, position: "relative", display: "inline-block" }}>
                                <input
                                    type="text"
                                    className="form-control flex-1"
                                    style={{ width: "100%", height: "40px" }}
                                    value={img_url}
                                    disabled
                                />
                                <input id={`file-input_${index}`} type="file" style={{ display: "none" }} onChange={e => updateCoverImage(e.target.files ? e.target.files[0] : null, index, "replace")} accept="image/*" />
                                <label htmlFor={`file-input_${index}`} style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0 }}></label>
                            </div>
                            <button style={{ height: "25px", width: "25px", backgroundColor: "red", borderRadius: 10, marginLeft: "25px", display: "flex", justifyContent: "center", alignItems: "center", color: "white", fontSize: "30px" }} onClick={() => removeCoverImage(index)}>&times;</button>
                        </div>
                    ))}
                    <div style={{ width: "100%", height: "30px", position: "relative" }}>
                        <input id="file-input_add" type="file" style={{ display: "none" }} onChange={e => updateCoverImage(e.target.files ? e.target.files[0] : null, -1, "add")} accept="image/*" disabled={submitType === 'create'} />
                        <label htmlFor={`file-input_add`} style={{ fontSize: "14px", borderRadius: 10, cursor: "pointer", display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", width: "100%", height: "100%", left: 0, top: 0, backgroundColor: "rgb(179, 228, 255)" }}><div style={{ display: "inline-block" }}>Add Image</div></label>
                    </div>
                </div>
            </div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="release_date" className="form-label">
                    Created Date
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    value={bundleDetail.release_date}
                    onChange={e => updateBundleDetail('release_date', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="author" className="form-label">
                    Humor Count
                </label>
                <input
                    type="number"
                    className="form-control flex-1"
                    value={bundleDetail.humor_count}
                    onChange={e => updateBundleDetail('humor_count', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="sender" className="form-label">
                    Language Code
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    value={bundleDetail.language_code}
                    onChange={e => updateBundleDetail('language_code', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label className="form-label">
                    Set List
                </label>
                <div className="flex-1">
                    {bundleDetail.set_list.map((set_name, index) => (
                        <div key={index} className='context-list-row flex' style={{ height: "35px" }}>
                            <input
                                type="text"
                                className="form-control flex-1"
                                value={set_name}
                                onChange={e => updateBundleDetail('set_list', e.target.value, index)}
                                required
                            />
                            <button className="center-child" style={{ color: "white" }}onClick={() => updateBundleDetail('set_list', index, 'remove')}>Remove</button>
                        </div>
                    ))}
                    <button className="btn btn-primary add-to-context-list" onClick={() => updateBundleDetail('set_list', '', 'add')}>
                        Add To Set List
                    </button>
                </div>
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="sender" className="form-label">
                    Thumbnail Path
                </label>
                <div style={{ position: "relative", width: "100%", height: "35px"}}>
                    <input
                        type="text"
                        className="form-control flex-1"
                        style={{ width: "100%", height: "100%" }}
                        value={bundleDetail.thumbnail_path}
                        disabled
                    />
                    <input id="thumbnail" type="file" style={{ display: "none" }} onChange={e => updateThumbnailImage(e.target.files?.[0] ?? null)} accept="image/*" disabled={submitType === "create"} />
                    <label htmlFor="thumbnail" style={{ position: "absolute", width: "100%", height: "100%", left: 0, top: 0, cursor: "pointer" }}></label>
                </div>
            </div>
            <div className="p-4">
                <button className={`btn btn-primary save ${submitType}`} onClick={handleSubmit} disabled={isHttpRunning}>
                    {isHttpRunning ? 'Please Wait...' : submitType.toUpperCase()}
                </button>
            </div>
        </div>
    );
};

export default BundleDetail;