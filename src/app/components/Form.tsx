// components/SimpleForm.tsx
'use client';

// import React, { useState } from 'react';
import React from 'react';
import { HumorCategoryList, Humor, HumorDataKey, validateHumor } from '../util';
import Dropdown from "./Dropdown";

interface SimpleFormProps {
    submitType: 'create' | 'update';
    humorFormData: Humor;
    updateHumorFormData: (key: HumorDataKey, value: string | number, arg?: string | number) => void
    handleSubmit: () => void;
    isHttpRunning: boolean;
}


const SimpleForm: React.FC<SimpleFormProps> = ({ submitType, humorFormData, updateHumorFormData, handleSubmit, isHttpRunning }) => {
    console.log('humorFormData is: ', humorFormData);
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
                    <Dropdown options={HumorCategoryList} onCategoryChange={(category) => updateHumorFormData('category', category)} selectedDropdownValue={humorFormData.category} />
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
                <label htmlFor="created_date" className="form-label">
                    Created Date {invalid_field_list.includes('created_date') && <span style={{color: 'red'}}>*</span>}
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    id="created_date"
                    name="created_date"
                    value={humorFormData.created_date}
                    onChange={e => updateHumorFormData('created_date', e.target.value)}
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
                    Source {invalid_field_list.includes('source') && <span style={{color: 'red'}}>*</span>}
                </label>
                <input
                    type="text"
                    className="form-control flex-1"
                    id="source"
                    name="source"
                    value={humorFormData.source}
                    onChange={e => updateHumorFormData('source', e.target.value)}
                    required
                />
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

export default SimpleForm;
