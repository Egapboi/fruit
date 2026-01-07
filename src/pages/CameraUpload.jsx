import React, { useState } from 'react';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const CameraUpload = () => {
    const [image, setImage] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
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
                    <div className="btn-primary inline-block cursor-pointer">
                        Select Image
                    </div>
                </label>

                {image && (
                    <div className="mt-6">
                        <Button onClick={() => alert('Identifying...')}>Identify Plant</Button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default CameraUpload;
