import React, { useEffect, useState } from 'react';
import { getPlants } from '../services/api';
import { motion } from 'framer-motion';

const PlantSelector = () => {
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPlants().then(res => {
            setPlants(res.data);
            setLoading(false);
        });
    }, []);

    if (loading) return <div className="text-center mt-6">Loading plants...</div>;

    return (
        <div className="page-container">
            <h1 className="text-3xl text-white mb-6">Choose Your Plant</h1>
            <div className="dashboard-grid">
                {plants.map(plant => (
                    <motion.div
                        key={plant.id}
                        whileHover={{ y: -5 }}
                        className="glass-panel"
                        style={{ overflow: 'hidden' }}
                    >
                        <img src={plant.image} alt={plant.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        <div style={{ padding: '1rem' }}>
                            <h3 className="text-xl text-white mb-1">{plant.name}</h3>
                            <p className="text-gray-400 text-sm">{plant.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default PlantSelector;
