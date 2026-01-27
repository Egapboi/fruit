// Plant Model Service using TensorFlow.js and Teachable Machine
// To use your own Teachable Machine model:
// 1. Train a model at https://teachablemachine.withgoogle.com/
// 2. Export the model and get the URL
// 3. Set the MODEL_URL below or add VITE_PLANT_MODEL_URL to .env

import * as tmImage from '@teachablemachine/image';

// Default to a sample plant/fruit model
// Replace this URL with your Teachable Machine model URL
const MODEL_URL = import.meta.env.VITE_PLANT_MODEL_URL || null;

let model = null;
let maxPredictions = 0;

// Sample plant data for when no model is configured
const SAMPLE_PLANTS = [
    { name: 'Tomato', description: 'A red, edible fruit commonly used in salads and sauces.', category: 'Fruit (Botanical)' },
    { name: 'Monstera', description: 'A popular tropical houseplant known for its split leaves.', category: 'Houseplant' },
    { name: 'Snake Plant', description: 'A hardy indoor plant that purifies air and needs little water.', category: 'Houseplant' },
    { name: 'Basil', description: 'An aromatic herb commonly used in Italian and Thai cuisine.', category: 'Herb' },
    { name: 'Strawberry', description: 'A sweet red fruit with seeds on the outside.', category: 'Fruit' },
    { name: 'Rose', description: 'A classic flowering plant known for its fragrance and beauty.', category: 'Flower' },
    { name: 'Succulent', description: 'A drought-resistant plant that stores water in its leaves.', category: 'Houseplant' },
    { name: 'Mint', description: 'A refreshing herb used in drinks, desserts, and savory dishes.', category: 'Herb' }
];

export async function loadModel() {
    if (!MODEL_URL) {
        console.log('No Teachable Machine model URL configured. Using sample predictions.');
        return false;
    }

    try {
        const modelURL = MODEL_URL + 'model.json';
        const metadataURL = MODEL_URL + 'metadata.json';

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        console.log('Plant identification model loaded successfully');
        return true;
    } catch (error) {
        console.error('Failed to load plant model:', error);
        return false;
    }
}

export async function classifyImage(imageElement) {
    // If no model is loaded, return a sample prediction
    if (!model) {
        return getSamplePrediction();
    }

    try {
        const predictions = await model.predict(imageElement);

        // Find the prediction with highest probability
        let bestPrediction = predictions[0];
        for (const prediction of predictions) {
            if (prediction.probability > bestPrediction.probability) {
                bestPrediction = prediction;
            }
        }

        return {
            plantName: bestPrediction.className,
            confidence: bestPrediction.probability,
            description: `Identified as ${bestPrediction.className} with ${(bestPrediction.probability * 100).toFixed(1)}% confidence.`,
            category: 'Plant',
            allPredictions: predictions.map(p => ({
                name: p.className,
                probability: p.probability
            })).sort((a, b) => b.probability - a.probability)
        };
    } catch (error) {
        console.error('Classification error:', error);
        return getSamplePrediction();
    }
}

function getSamplePrediction() {
    // Return a random sample plant for demo purposes
    const plant = SAMPLE_PLANTS[Math.floor(Math.random() * SAMPLE_PLANTS.length)];
    const confidence = 0.75 + Math.random() * 0.20; // 75-95% confidence

    return {
        plantName: plant.name,
        confidence: confidence,
        description: plant.description,
        category: plant.category,
        isDemo: true
    };
}

export function isModelLoaded() {
    return model !== null;
}

export function hasModelURL() {
    return MODEL_URL !== null;
}
