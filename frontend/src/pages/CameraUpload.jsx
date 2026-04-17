import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Camera, Leaf, Droplets, Sun, Heart, RefreshCw, Upload } from 'lucide-react';
import { analyzePlant } from '../services/api';

const CameraUpload = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCameraReady, setIsCameraReady] = useState(false);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure permissions are granted.");
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsCameraReady(false);
    };

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const processImage = async (file) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await analyzePlant(formData);
            setResult(response.data);
        } catch (err) {
            console.error('Identification error:', err);
            setError('Failed to analyze the image. Please make sure the backend is running and the Gemini API key is configured correctly.');
        } finally {
            setLoading(false);
        }
    };

    const handleScan = () => {
        if (!videoRef.current) return;
        
        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        if (video.videoWidth === 0 || video.videoHeight === 0) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImage(imageDataUrl);
        stopCamera();
        
        canvas.toBlob((blob) => {
            if (!blob) {
                setError("Failed to capture image.");
                return;
            }
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            processImage(file);
        }, 'image/jpeg', 0.8);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            stopCamera();
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
            processImage(selectedFile);
        }
    };

    const handleRetake = () => {
        setImage(null);
        setResult(null);
        setError(null);
        startCamera();
    };

    return (
        <div className="page-container">
            <div className="text-center mb-6">
                <h1 className="text-3xl text-white mb-2">🌿 Plant Scanner</h1>
                <p className="text-muted">Tap scan to identify a plant instantly</p>
            </div>

            <motion.div
                className="glass-panel p-2 md:p-6 max-w-2xl mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Camera/Upload Zone */}
                <div 
                    className="relative rounded-2xl overflow-hidden bg-black w-full shadow-2xl transition-all duration-300"
                    style={{ 
                        height: '70vh', 
                        minHeight: '500px', 
                        maxHeight: '850px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        border: '1px solid rgba(255,255,255,0.1)' 
                    }}
                >
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        onCanPlay={() => setIsCameraReady(true)}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: image ? 0 : 10, opacity: image ? 0 : 1, transition: 'opacity 0.3s ease' }}
                    />

                    {!image && !isCameraReady && !error && (
                        <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}>
                            <Camera size={48} className="mx-auto mb-3 opacity-50 animate-pulse" color="white" />
                            <p className="text-sm text-gray-300 font-medium">Starting camera...</p>
                            <p className="text-xs text-gray-500 mt-1">Please allow camera access</p>
                        </div>
                    )}
                    
                    {image && (
                        <motion.img
                            src={image}
                            alt="Captured"
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 20 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        />
                    )}

                    {/* Error Overlay (ON TOP OF PHOTO) */}
                    {error && (
                        <motion.div
                            style={{ position: 'absolute', top: '10%', left: '5%', right: '5%', zIndex: 50, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', pointerEvents: 'auto' }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-sm text-red-100 text-center font-medium shadow-md">{error}</p>
                        </motion.div>
                    )}

                    {/* Result Overlay (ON TOP OF PHOTO) */}
                    {result && !loading && image && (
                        <motion.div
                            style={{ position: 'absolute', top: '5%', left: '4%', right: '4%', bottom: '25%', zIndex: 40, pointerEvents: 'auto', overflowY: 'auto' }}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                        >
                            <div style={{ background: 'rgba(5, 10, 15, 0.75)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.2)', padding: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                                <div className="flex items-start justify-between mb-3 border-b border-white/10 pb-4">
                                    <div className="max-w-[70%]">
                                        <h3 className="text-2xl font-bold text-primary truncate" title={result.plantName}>{result.plantName}</h3>
                                        <p className="text-sm text-gray-300 mt-1">{result.category}</p>
                                    </div>
                                    {result.confidence && (
                                    <div className="text-right bg-black/40 px-3 py-2 rounded-xl shrink-0 border border-white/5">
                                        <span className="text-2xl font-bold text-white">
                                            {(Number(result.confidence) * 100).toFixed(0)}%
                                        </span>
                                        <p className="text-[10px] text-gray-400 uppercase mt-1 tracking-wider">match</p>
                                    </div>
                                    )}
                                </div>

                                <p className="text-gray-200 text-sm mb-6 leading-relaxed bg-black/20 p-3 rounded-lg">{result.description}</p>

                                {/* Care Info */}
                                {result.careLevel && (
                                    <div className="grid grid-cols-3 gap-3 pt-2">
                                        <div className="text-center bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                            <Heart size={20} className="mx-auto mb-2 text-pink-400" />
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Care</p>
                                            <p className="text-sm font-medium text-white">{result.careLevel}</p>
                                        </div>
                                        <div className="text-center bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                            <Droplets size={20} className="mx-auto mb-2 text-blue-400" />
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Water</p>
                                            <p className="text-sm font-medium text-white">{result.water}</p>
                                        </div>
                                        <div className="text-center bg-black/40 p-3 rounded-xl border border-white/5 shadow-inner">
                                            <Sun size={20} className="mx-auto mb-2 text-yellow-500" />
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Light</p>
                                            <p className="text-sm font-medium text-white">{result.light}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    
                    {/* Glassmorphism Controls Overlay - Positioned inside and at the bottom of the feed */}
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, paddingLeft: '1rem', paddingRight: '1rem', zIndex: 30, pointerEvents: 'none' }}>
                        <div style={{ pointerEvents: 'auto', width: '100%', maxWidth: '28rem', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            
                            {loading && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="shadow-lg"
                                    style={{ 
                                        padding: '1rem', borderRadius: '1rem', background: 'rgba(0, 0, 0, 0.5)', 
                                        border: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center', display: 'flex', 
                                        alignItems: 'center', justifyContent: 'center', gap: '0.75rem', 
                                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)'
                                    }}
                                >
                                    <Leaf className="animate-spin" color="#4ade80" size={24} />
                                    <span className="animate-pulse font-medium text-white shadow-sm">Analyzing with Gemini AI...</span>
                                </motion.div>
                            )}

                            {!image ? (
                                <div style={{ display: 'flex', gap: '0.75rem', height: '4rem' }}>
                                    <button 
                                        onClick={handleScan}
                                        disabled={!isCameraReady}
                                        className="shadow-lg"
                                        style={{ 
                                            flex: 1, borderRadius: '1rem', color: 'white', fontWeight: 'bold', fontSize: '1.125rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                                            background: isCameraReady ? 'rgba(34, 197, 94, 0.7)' : 'rgba(255, 255, 255, 0.05)', 
                                            border: isCameraReady ? '1px solid rgba(74, 222, 128, 0.4)' : '1px solid rgba(255, 255, 255, 0.05)', 
                                            backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', 
                                            cursor: isCameraReady ? 'pointer' : 'not-allowed', opacity: isCameraReady ? 1 : 0.5,
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <Camera size={26} /> Scan Plant
                                    </button>
                                    
                                    <label htmlFor="camera-overlay-input" className="shadow-lg" style={{ 
                                        width: '4rem', borderRadius: '1rem', background: 'rgba(255, 255, 255, 0.1)', 
                                        border: '1px solid rgba(255, 255, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                        cursor: 'pointer', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                                        transition: 'all 0.3s ease'
                                    }}>
                                        <Upload size={24} color="white" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                            ref={fileInputRef}
                                            id="camera-overlay-input"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <button 
                                    onClick={handleRetake}
                                    className="shadow-lg"
                                    style={{ 
                                        width: '100%', height: '4rem', borderRadius: '1rem', color: 'white', fontWeight: 'bold', fontSize: '1.125rem', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
                                        background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', 
                                        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                                        cursor: 'pointer', transition: 'all 0.3s ease'
                                    }}
                                >
                                    <RefreshCw size={24} /> Retake Photo
                                </button>
                            )}
                        </div>
                    </div>

                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                {/* Results and errors now displayed absolutely inside the camera feed object */}
            </motion.div>
        </div>
    );
};

export default CameraUpload;
