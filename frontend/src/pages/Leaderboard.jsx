import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Trophy, Medal, Award } from 'lucide-react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get('/quiz/leaderboard');
            setLeaderboard(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
            setError('Failed to load leaderboard');
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="text-yellow-400" size={24} />;
            case 2:
                return <Medal className="text-gray-300" size={24} />;
            case 3:
                return <Award className="text-amber-600" size={24} />;
            default:
                return <span className="text-gray-400 font-bold w-6 text-center">{rank}</span>;
        }
    };

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/30';
            case 2:
                return 'bg-gradient-to-r from-gray-400/20 to-gray-500/10 border-gray-400/30';
            case 3:
                return 'bg-gradient-to-r from-amber-600/20 to-amber-700/10 border-amber-600/30';
            default:
                return 'bg-slate-800/50 border-slate-700/50';
        }
    };

    if (loading) {
        return (
            <div className="page-container text-center">
                <div className="text-gray-400">Loading leaderboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container text-center">
                <div className="text-red-400">{error}</div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="text-center mb-8">
                <h1 className="text-3xl text-white mb-2">🏆 Leaderboard</h1>
                <p className="text-gray-400">Top plant quiz champions</p>
            </div>

            <motion.div
                className="glass-panel p-6 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {leaderboard.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        <p>No scores yet. Be the first to take the quiz!</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((entry) => (
                            <motion.div
                                key={`${entry.username}-${entry.date}`}
                                className={`flex items-center gap-4 p-4 rounded-lg border ${getRankStyle(entry.rank)}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: entry.rank * 0.1 }}
                            >
                                <div className="flex items-center justify-center w-8">
                                    {getRankIcon(entry.rank)}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-white">{entry.username}</div>
                                    <div className="text-sm text-gray-400">
                                        {new Date(entry.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-primary">{entry.percentage}%</div>
                                    <div className="text-sm text-gray-400">
                                        {entry.score}/{entry.totalQuestions || 5}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Leaderboard;
