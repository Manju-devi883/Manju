"use client";

import React, { useState } from 'react';
import SafetyForm from '../components/SafetyForm';
import SOSButton from '../components/SOSButton';

export default function Home() {
    const [formData, setFormData] = useState({
        name: '',
        phone: ''
    });

    return (
        <main className="container">
            <h1>Safety Portal</h1>
            <p style={{ textAlign: 'center', marginBottom: '20px', color: '#ced6e0' }}>
                Fill in your details and press SOS in case of emergency.
            </p>
            <SafetyForm formData={formData} setFormData={setFormData} />
            <SOSButton formData={formData} />
        </main>
    );
}
