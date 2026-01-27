import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { Trophy, Medal, Award, Star, Calendar } from 'lucide-react';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            const res = await api.get('/quiz/leaderboard');
            setLeaderboard(res.data);
        } catch (err) {
            console.error('Error fetching leaderboard:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRankIcon = (rank) => {
        switch (rank) {
            case 1: return <Trophy className="text-yellow-400" size={24} />;
            case 2: return <Medal className="text-gray-300" size={24} />;
            case 3: return <Award className="text-amber-600" size={24} />;
            default: return <span className="text-lg font-bold text-muted w-6 text-center">{rank}</span>;
        }
    };

    const getRankClass = (rank) => {
        switch (rank) {
            case 1: return 'rank-1';
            case 2: return 'rank-2';
            case 3: return 'rank-3';
            default: return '';
        }
    };

    if (loading) {
        return (
            <div className="page-container text-center">
                <p className="text-muted">Loading leaderboard...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="text-center mb-8">
                <h1 className="text-3xl text-white mb-2">🏆 Leaderboard</h1>
                <p className="text-muted">Top plant quiz champions</p>
            </div>

            <motion.div
                className="glass-panel p-6 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {leaderboard.length === 0 ? (
                    <div className="text-center py-12">
                        <Star size={48} className="mx-auto mb-4 text-muted opacity-50" />
                        <p className="text-muted mb-2">No scores yet!</p>
                        <p className="text-sm text-muted opacity-70">Be the first to complete a quiz</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {leaderboard.map((entry, i) => (
                            <motion.div
                                key={`${entry.username}-${i}`}
                                className={`leaderboard-item ${getRankClass(entry.rank)}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <div className="flex items-center justify-center w-10">
                                    {getRankIcon(entry.rank)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-white truncate">{entry.username}</p>
                                    <p className="text-xs text-muted flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(entry.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary">{entry.percentage}%</p>
                                    <p className="text-xs text-muted">{entry.score}/{entry.totalQuestions || 5}</p>
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
