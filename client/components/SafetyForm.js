"use client";

import React from 'react';

const SafetyForm = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div style={{ marginBottom: '20px' }}>
            <div style={{ marginRight: '20px' }}>
                <label htmlFor="name">Full Name</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div style={{ marginRight: '20px' }}>
                <label htmlFor="phone">Details</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="1234 5678 9234 1234"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
};

export default SafetyForm;
