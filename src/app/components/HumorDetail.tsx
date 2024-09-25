'use client';

import React from 'react';
import { HumorCategoryList, Humor, HumorDataKey, validateHumor, Bundle } from '../util';
import Dropdown from "./Dropdown";

interface HumorDetailProps {
    submitType: 'create' | 'update';
    humorFormData: Humor;
    updateHumorFormData: (key: HumorDataKey, value: string | number | boolean, arg?: string | number) => void
    handleSubmit: () => void;
    isHttpRunning: boolean;
    humorBundleList: Bundle[];
}


const HumorDetail: React.FC<HumorDetailProps> = ({ submitType, humorFormData, updateHumorFormData, handleSubmit, isHttpRunning, humorBundleList }) => {
    const invalid_field_list = validateHumor(humorFormData);
    return (
        <div className="form border rounded shadow-sm">
            <div className="mb-3 p-4 flex">
                <label htmlFor="uuid" className="form-label">
                    Uuid
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    id="uuid"
                    name="uuid"
                    value={humorFormData.uuid}
                    readOnly
                    required
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
                    checked={humorFormData.active}
                    onChange={e => updateHumorFormData('active', e.target.checked)}
                    style={{ width: "30px", height: "30px" }}
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="index" className="form-label">
                    Index
                </label>
                <input
                    type="number"
                    className="form-control flex-1"
                    id="index"
                    name="index"
                    value={humorFormData.index.toString()}
                    onChange={e => updateHumorFormData('index', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="category" className="form-label">
                    Category
                </label>
                <div className="flex-1">
                    <Dropdown options={HumorCategoryList.map(category => ({label: category, value: category}))} onChange={(category) => updateHumorFormData('category', category)} selectedDropdownValue={humorFormData.category} />
                </div>
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="context" className="form-label">
                    Context {invalid_field_list.includes('context') && <span style={{color: 'red'}}>*</span>}
                </label>
                <textarea
                    className="form-control flex-1"
                    id="context"
                    name="context"
                    value={humorFormData.context}
                    onChange={e => updateHumorFormData('context', e.target.value)}
                    rows={3}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="context_list" className="form-label">
                    Context List
                </label>
                <div className="flex-1">
                    {humorFormData.context_list?.map((contextListItem, index) => (
                        <div key={index} className='context-list-row flex'>
                            <textarea
                                className="form-control mb-3"
                                id={`context_list#${index}`} // Making the id unique or omit if not needed
                                name={`context_list#${index}`} // Optionally use unique names as well
                                value={contextListItem}
                                  onChange={(e) => updateHumorFormData('context_list', e.target.value, index)} // Assuming handleChange needs to track the index
                                rows={3}
                                required
                            />
                            <button onClick={() => updateHumorFormData('context_list', index, 'remove')}>Remove</button>
                        </div>
                    ))}
                    <button className="btn btn-primary add-to-context-list" onClick={() => updateHumorFormData('context_list', '', 'add')}>
                        Add To Context List
                    </button>
                </div>
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="punchline" className="form-label">
                    Punchline
                </label>
                <textarea
                    className="form-control flex-1"
                    id="punchline"
                    name="punchline"
                    value={humorFormData.punchline || ''}
                    onChange={e => updateHumorFormData('punchline', e.target.value)}
                    rows={3}
                    required
                />
            </div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="release_date" className="form-label">
                    Created Date {invalid_field_list.includes('release_date') && <span style={{color: 'red'}}>*</span>}
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    id="release_date"
                    name="release_date"
                    value={humorFormData.release_date}
                    onChange={e => updateHumorFormData('release_date', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="author" className="form-label">
                    Author
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    id="author"
                    name="author"
                    value={humorFormData.author || ''}
                    onChange={e => updateHumorFormData('author', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="sender" className="form-label">
                    Sender {invalid_field_list.includes('sender') && <span style={{color: 'red'}}>*</span>}
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    id="sender"
                    name="sender"
                    value={humorFormData.sender}
                    onChange={e => updateHumorFormData('sender', e.target.value)}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="source" className="form-label">
                    Source
                </label>
                <Dropdown options={[{label: 'Daily Dose of Humors', value: 'Daily Dose of Humors'}, ...humorBundleList.map(bundle => ({ label: bundle.bundle_name, value: bundle.uuid }))]} onChange={(bundle_uuid) => updateHumorFormData('source', bundle_uuid)} selectedDropdownValue={humorFormData.source} />
            </div>
            <div className="divider"></div>
            <div className="p-4">
                <button className={`btn btn-primary save ${submitType}`} onClick={handleSubmit} disabled={isHttpRunning || invalid_field_list.length > 0}>
                    {isHttpRunning ? 'Please Wait...' : submitType.toUpperCase()}
                </button>
            </div>
        </div>
    );
};

export default HumorDetail;
