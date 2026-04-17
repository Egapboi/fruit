import React, { useState, useRef } from 'react';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Camera, Leaf, Droplets, Sun, Heart } from 'lucide-react';
import { analyzePlant } from '../services/api';

const CameraUpload = () => {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const imgRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
            setFile(selectedFile);
            setResult(null);
            setError(null);
        }
    };

    const handleIdentify = async () => {
        if (!file) return;

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

    return (
        <div className="page-container">
            <div className="text-center mb-8">
                <h1 className="text-3xl text-white mb-2">🌿 Plant Identifier</h1>
                <p className="text-muted">AI-powered plant recognition</p>
            </div>

            <motion.div
                className="glass-panel p-8 max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Upload Zone */}
                <div className={`upload-zone ${image ? 'has-image' : ''}`}>
                    {image ? (
                        <motion.img
                            ref={imgRef}
                            src={image}
                            alt="Preview"
                            className="w-full max-h-64 object-contain rounded-lg"
                            crossOrigin="anonymous"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        />
                    ) : (
                        <div className="text-muted">
                            <Camera size={48} className="mx-auto mb-3 opacity-50" />
                            <p className="text-lg mb-1">Upload a plant photo</p>
                            <p className="text-sm opacity-70">Tap to select or take a photo</p>
                        </div>
                    )}
                </div>

                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                    id="camera-input"
                />

                <div className="mt-6 space-y-3">
                    <label htmlFor="camera-input" className="block">
                        <div className="btn-secondary w-full text-center cursor-pointer">
                            {image ? 'Choose Different Photo' : 'Select Photo'}
                        </div>
                    </label>

                    {image && (
                        <Button onClick={handleIdentify} disabled={loading} className="w-full">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Leaf className="animate-spin" size={18} />
                                    Analyzing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Leaf size={18} />
                                    Identify Plant
                                </span>
                            )}
                        </Button>
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
                {result && (
                    <motion.div
                        className="result-card mt-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="text-xl font-bold text-primary">{result.plantName}</h3>
                                <p className="text-sm text-muted">{result.category}</p>
                            </div>
                            {result.confidence && (
                            <div className="text-right">
                                <span className="text-2xl font-bold text-white">
                                    {(Number(result.confidence) * 100).toFixed(0)}%
                                </span>
                                <p className="text-xs text-muted">confidence</p>
                            </div>
                            )}
                        </div>

                        <p className="text-gray-300 text-sm mb-4">{result.description}</p>

                        {/* Care Info */}
                        {result.careLevel && (
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                                <div className="text-center">
                                    <Heart size={18} className="mx-auto mb-1 text-pink-400" />
                                    <p className="text-xs text-muted">Care Level</p>
                                    <p className="text-sm font-medium">{result.careLevel}</p>
                                </div>
                                <div className="text-center">
                                    <Droplets size={18} className="mx-auto mb-1 text-blue-400" />
                                    <p className="text-xs text-muted">Water</p>
                                    <p className="text-sm font-medium">{result.water}</p>
                                </div>
                                <div className="text-center">
                                    <Sun size={18} className="mx-auto mb-1 text-yellow-400" />
                                    <p className="text-xs text-muted">Light</p>
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
