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
            <div className="text-center mb-8">
                <h1 className="text-3xl text-white mb-2">🌿 Plant Scanner</h1>
                <p className="text-muted">Tap scan to identify a plant instantly</p>
            </div>

            <motion.div
                className="glass-panel p-4 md:p-8 max-w-2xl mx-auto w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Camera/Upload Zone */}
                <div 
                    className="relative rounded-xl overflow-hidden bg-black w-full"
                    style={{ height: '65vh', minHeight: '450px', maxHeight: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}
                >
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: image ? 0 : 10, opacity: image ? 0 : 1, transition: 'opacity 0.3s ease' }}
                    />

                    {!image && !streamRef.current && !error && (
                        <div style={{ position: 'relative', zIndex: 20, textAlign: 'center', background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '0.5rem' }}>
                            <Camera size={48} className="mx-auto mb-2 opacity-50 animate-pulse" color="white" />
                            <p className="text-sm text-gray-300">Starting camera...</p>
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
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </div>

                <div className="space-y-4">
                    {!image ? (
                        <>
                            <Button onClick={handleScan} className="w-full py-4 text-xl font-bold bg-green-500 hover:bg-green-600 flex items-center justify-center gap-2">
                                <Camera size={26} /> <span>Scan Plant</span>
                            </Button>
                            
                            <div className="flex items-center justify-between my-2">
                                <span className="h-px bg-white/10 w-full"></span>
                                <span className="px-4 text-xs text-muted uppercase">or</span>
                                <span className="h-px bg-white/10 w-full"></span>
                            </div>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                ref={fileInputRef}
                                id="camera-input"
                            />
                            <label htmlFor="camera-input" className="block">
                                <div className="btn-secondary w-full text-center cursor-pointer flex items-center justify-center gap-2 py-3 text-lg">
                                    <Upload size={20} /> Upload Photo
                                </div>
                            </label>
                        </>
                    ) : (
                        <Button onClick={handleRetake} className="w-full btn-secondary flex items-center justify-center gap-2 py-3 text-lg">
                            <RefreshCw size={20} /> Retake Photo
                        </Button>
                    )}
                    
                    {loading && (
                        <div className="text-center py-6 text-primary border-t border-white/10 mt-6 mt-4">
                            <Leaf className="animate-spin mx-auto mb-3" size={32} />
                            <p className="animate-pulse text-lg">Analyzing with Gemini AI...</p>
                        </div>
                    )}
                </div>

                {error && (
                    <motion.div
                        className="mt-6 p-4 rounded-xl bg-red-500/20 border border-red-500/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p className="text-sm text-red-200 text-center">{error}</p>
                    </motion.div>
                )}

                {/* Results */}
                {result && !loading && (
                    <motion.div
                        className="result-card mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-start justify-between mb-3 border-b border-white/10 pb-4">
                            <div className="max-w-[70%]">
                                <h3 className="text-2xl font-bold text-primary truncate" title={result.plantName}>{result.plantName}</h3>
                                <p className="text-sm text-muted mt-1">{result.category}</p>
                            </div>
                            {result.confidence && (
                            <div className="text-right bg-black/30 px-3 py-2 rounded-lg shrink-0">
                                <span className="text-2xl font-bold text-white">
                                    {(Number(result.confidence) * 100).toFixed(0)}%
                                </span>
                                <p className="text-[10px] text-muted uppercase mt-1">match</p>
                            </div>
                            )}
                        </div>

                        <p className="text-gray-300 text-sm mb-6 leading-relaxed">{result.description}</p>

                        {/* Care Info */}
                        {result.careLevel && (
                            <div className="grid grid-cols-3 gap-3 pt-2">
                                <div className="text-center bg-black/20 p-3 rounded-xl border border-white/5">
                                    <Heart size={20} className="mx-auto mb-2 text-pink-400" />
                                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Care</p>
                                    <p className="text-sm font-medium">{result.careLevel}</p>
                                </div>
                                <div className="text-center bg-black/20 p-3 rounded-xl border border-white/5">
                                    <Droplets size={20} className="mx-auto mb-2 text-blue-400" />
                                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Water</p>
                                    <p className="text-sm font-medium">{result.water}</p>
                                </div>
                                <div className="text-center bg-black/20 p-3 rounded-xl border border-white/5">
                                    <Sun size={20} className="mx-auto mb-2 text-yellow-400" />
                                    <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Light</p>
                                    <p className="text-sm font-medium">{result.light}</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default CameraUpload;
