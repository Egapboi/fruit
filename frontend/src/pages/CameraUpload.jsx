import React, { useState } from 'react';
import api from '../services/api';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const CameraUpload = () => {
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImage(URL.createObjectURL(selectedFile));
            setResult(null);
        }
    };

    const handleIdentify = async () => {
        if (!file) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            // We need to import api here, or use axios directly. 
            // Better to add a method in api.js, but direct axios or api instance usage is fine if exported.
            // Let's assume we import 'api' from '../services/api'. I'll add the import.
            const response = await api.post('/ai/classify', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResult(response.data);
        } catch (error) {
            console.error(error);
            alert('Failed to identify plant');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container text-center">
            <h1 className="text-3xl text-white mb-6">Identify Plant</h1>
            <motion.div
                className="glass-panel p-8 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="mb-6 border-2 border-dashed border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px]">
                    {image ? (
                        <img src={image} alt="Preview" className="max-w-full rounded-lg" />
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
                    <div className="">
                        <Button onClick={handleIdentify} disabled={loading} className="w-full">
                            {loading ? 'Identifying...' : 'Identify Plant'}
                        </Button>
                    </div>
                )}

                {result && (
                    <div className="mt-6 text-left bg-slate-800 p-4 rounded-lg">
                        <h3 className="text-xl text-primary font-bold">{result.plantName}</h3>
                        <p className="text-sm text-gray-400 mb-2">Confidence: {(result.confidence * 100).toFixed(1)}%</p>
                        <p className="text-gray-200">{result.description}</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CameraUpload;
