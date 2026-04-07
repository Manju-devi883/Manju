"use client";

import React, { useState, useRef } from 'react';

const SOSButton = ({ formData }) => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const captureImage = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = 640;
            canvas.height = 480;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageBase64 = canvas.toDataURL('image/jpeg');

            // Stop tracks
            stream.getTracks().forEach(track => track.stop());

            return imageBase64;
        } catch (err) {
            console.error("Camera error:", err);
            throw new Error("Camera permission denied or unavailable");
        }
    };

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error("Geolocation not supported"));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                async (error) => {
                    console.warn("Geolocation failed, using fallback location:", error);
                    setStatus('GPS unavailable. Using IP-based location...');

                    try {
                        const response = await fetch('https://ipwho.is/');
                        const data = await response.json();

                        if (data.latitude && data.longitude) {
                            resolve({
                                latitude: data.latitude,
                                longitude: data.longitude
                            });
                        } else {
                            throw new Error("Invalid IP geo data");
                        }
                    } catch (err) {
                        console.error("IP fallback failed", err);
                        // Fallback: New York
                        resolve({
                            latitude: 40.7128,
                            longitude: -74.0060
                        });
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        });
    };

    const handleSOS = async () => {
        if (!formData.name || !formData.phone) {
            setStatus('Please fill in your details first.');
            return;
        }

        setLoading(true);
        setStatus('Activating SOS...');

        try {
            // Parallel execution for speed
            const [location, image] = await Promise.all([
                getLocation(),
                captureImage()
            ]);

            const payload = {
                name: formData.name,
                phone: formData.phone,
                latitude: location.latitude,
                longitude: location.longitude,
                image: image
            };

            // Determine backend URL (assume same host, port 3001)
            const protocol = window.location.protocol;
            const hostname = window.location.hostname;
            const backendUrl = `${protocol}//${hostname}:3001/api/sos`;

            // Send to Backend
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setStatus('SOS Alert Sent Successfully! Help is on the way.');
            } else {
                setStatus('Failed to send alert.');
            }

        } catch (error) {
            console.error(error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <button className="sos-btn" onClick={handleSOS} disabled={loading}>
                {loading ? '...' : 'SOS'}
            </button>
            {status && (
                <p className={`status-msg ${status.includes('Success') ? 'status-success' : 'status-error'}`}>
                    {status}
                </p>
            )}
        </div>
    );
};

export default SOSButton;
