import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Camera, Leaf, AlertCircle } from 'lucide-react';
import { loadModel, classifyImage, hasModelURL, isModelLoaded } from '../services/plantModel';

const CameraUpload = () => {
    const [image, setImage] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modelReady, setModelReady] = useState(false);
    const [modelLoading, setModelLoading] = useState(true);
    const imgRef = useRef(null);

    useEffect(() => {
        initModel();
    }, []);

    const initModel = async () => {
        setModelLoading(true);
        const loaded = await loadModel();
        setModelReady(loaded);
        setModelLoading(false);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
            setResult(null);
        }
    };

    const handleIdentify = async () => {
        if (!image || !imgRef.current) return;

        setLoading(true);
        try {
            // Wait for image to be fully loaded
            if (!imgRef.current.complete) {
                await new Promise(resolve => {
                    imgRef.current.onload = resolve;
                });
            }

            const prediction = await classifyImage(imgRef.current);
            setResult(prediction);
        } catch (error) {
            console.error('Identification error:', error);
            alert('Failed to identify plant. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container text-center">
            <h1 className="text-3xl text-white mb-2">🌱 Identify Plant</h1>
            <p className="text-gray-400 mb-6">Upload a photo to identify plants</p>

            <motion.div
                className="glass-panel p-8 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Model Status Banner */}
                {!modelLoading && !hasModelURL() && (
                    <div className="mb-4 p-3 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center gap-2 text-sm">
                        <AlertCircle size={18} className="text-amber-400" />
                        <span className="text-amber-200">Demo mode - Configure Teachable Machine model for real identification</span>
                    </div>
                )}

                {modelLoading && (
                    <div className="mb-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30 text-sm text-blue-200">
                        Loading AI model...
                    </div>
                )}

                {/* Image Upload Area */}
                <div className="mb-6 border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden">
                    {image ? (
                        <img
                            ref={imgRef}
                            src={image}
                            alt="Preview"
                            className="max-w-full max-h-[300px] rounded-lg object-contain"
                            crossOrigin="anonymous"
                        />
                    ) : (
                        <div className="text-gray-400">
                            <Camera size={48} className="mx-auto mb-2" />
                            <p>Upload or take a photo</p>
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
                <label htmlFor="camera-input">
                    <div className="btn-primary inline-block cursor-pointer mb-4">
                        {image ? 'Select Different Image' : 'Select Image'}
                    </div>
                </label>

                {image && (
                    <div>
                        <Button onClick={handleIdentify} disabled={loading || modelLoading} className="w-full">
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Leaf className="animate-spin" size={18} />
                                    Identifying...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Leaf size={18} />
                                    Identify Plant
                                </span>
                            )}
                        </Button>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <motion.div
                        className="mt-6 text-left bg-slate-800 p-4 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl text-primary font-bold">{result.plantName}</h3>
                            {result.isDemo && (
                                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-1 rounded">Demo</span>
                            )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                            Confidence: {(result.confidence * 100).toFixed(1)}%
                        </p>
                        <p className="text-gray-200 mb-2">{result.description}</p>
                        <span className="inline-block text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                            {result.category}
                        </span>

                        {/* Show all predictions if available */}
                        {result.allPredictions && result.allPredictions.length > 1 && (
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-sm text-gray-400 mb-2">Other possibilities:</p>
                                <div className="space-y-1">
                                    {result.allPredictions.slice(1, 4).map((pred, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-gray-300">{pred.name}</span>
                                            <span className="text-gray-500">{(pred.probability * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
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
