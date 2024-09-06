// components/SimpleForm.tsx
'use client';

// import React, { useState } from 'react';
import React from 'react';
import { HumorCategoryList, Humor, HumorDataKey } from '../util';
import Dropdown from "./Dropdown";

interface SimpleFormProps {
    humorFormData: Humor;
    updateHumorFormData: (key: HumorDataKey, value: string | number, arg?: string | number) => void
}


const SimpleForm: React.FC<SimpleFormProps> = ({ humorFormData, updateHumorFormData }) => {
    // const [formData, setFormData] = useState({
    //     author: '', // empty string will be treated as null, vise versa
    //     category: HumorCategoryList[0],
    //     context: '',
    //     context_list: [], // empty list will be treated as null, vise versa
    //     created_date: '',
    //     index: 0,
    //     punchline: '', // empty string will be treated as null, vise versa
    //     sender: 'Board Collie',
    //     source: 'Daily Dose of Humors',
    //     uuid: '',
    // });

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     const { name, value } = e.target;
    //     setFormData(prevState => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // console.log('Form Data:', formData);
        // You can handle form submission here (e.g., send data to an API)
    };

    return (
        <form onSubmit={handleSubmit} className="border rounded shadow-sm">
            <div className="mb-3 p-4 flex">
                <label htmlFor="uuid" className="form-label">
                    uuid
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
                    value={humorFormData.index}
                    required
                />
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="category" className="form-label">
                    Category
                </label>
                <div className="flex-1">
                    <Dropdown options={HumorCategoryList} onCategoryChange={() => { }} selectedDropdownValue={humorFormData.category} />
                </div>
            </div>
            <div className="divider"></div>
            <div className="mb-3 p-4 flex">
                <label htmlFor="context" className="form-label">
                    Context
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
                        <textarea
                            key={index} // Adding a unique key for each textarea
                            className="form-control mb-3"
                            id={`context_list#${index}`} // Making the id unique or omit if not needed
                            name={`context_list#${index}`} // Optionally use unique names as well
                            value={contextListItem}
                            //   onChange={(e) => handleChange(e, index)} // Assuming handleChange needs to track the index
                            rows={3}
                            required
                        />
                    ))}
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
                    Created Date
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
                    Sender
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
                <button className="btn btn-primary save">
                    Save
                </button>
            </div>
        </form>
    );
};

export default SimpleForm;
