const express = require('express');
const cors = require('cors');
const path = require('path');
const { initializeDatabase } = require('./database');
const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const quizRoutes = require('./routes/quizRoutes');
const aiRoutes = require('./routes/aiRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files if needed (e.g. for uploads)
// app.use('/uploads', express.static('uploads'));

(async () => {
    try {
        await initializeDatabase();

        // Mount routes after DB init
        app.use('/api/auth', authRoutes);
        app.use('/api/plants', plantRoutes);
        app.use('/api/quiz', quizRoutes);
        app.use('/api/ai', aiRoutes);
        app.use('/api/chat', chatRoutes);

        app.get('/', (req, res) => {
            res.send('Fruit Backend is running!');
        });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
})();
