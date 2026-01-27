import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import Button from '../components/Button';
import { Trophy, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const res = await api.get('/quiz?count=5');
            setQuestions(res.data);
        } catch (error) {
            console.error('Error fetching quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerClick = (option) => {
        if (showFeedback) return;

        setSelectedAnswer(option);
        setShowFeedback(true);

        const isCorrect = option === questions[currentQuestion].answer;
        if (isCorrect) {
            setScore(score + 1);
        }

        // Auto-advance after showing feedback
        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer(null);
                setShowFeedback(false);
            } else {
                setShowScore(true);
                submitScore(score + (isCorrect ? 1 : 0));
            }
        }, 1200);
    };

    const submitScore = async (finalScore) => {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                await api.post('/quiz/submit', {
                    userId: user.id || 1,
                    score: finalScore,
                    totalQuestions: questions.length
                });
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    const resetQuiz = () => {
        setShowScore(false);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        fetchQuestions();
    };

    const getOptionClass = (option) => {
        if (!showFeedback) return 'quiz-option';
        if (option === questions[currentQuestion].answer) {
            return 'quiz-option bg-green-500/20 border-green-500/50';
        }
        if (option === selectedAnswer && option !== questions[currentQuestion].answer) {
            return 'quiz-option bg-red-500/20 border-red-500/50';
        }
        return 'quiz-option opacity-50';
    };

    if (loading) {
        return (
            <div className="page-container text-center">
                <p className="text-muted">Loading quiz...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="page-container text-center">
                <p className="text-muted">No questions available.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="text-center mb-8">
                <h1 className="text-3xl text-white mb-2">🌱 Plant Quiz</h1>
                <p className="text-muted">Test your plant knowledge</p>
            </div>

            <motion.div
                className="glass-panel p-6 max-w-lg mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {showScore ? (
                    <motion.div
                        className="text-center py-6"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                            <Trophy size={40} className="text-primary" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {score}/{questions.length}
                        </h2>
                        <p className="text-xl mb-2">
                            {Math.round((score / questions.length) * 100)}% Correct
                        </p>
                        <p className="text-muted mb-8">
                            {score === questions.length ? '🎉 Perfect score!' :
                                score >= questions.length * 0.8 ? '🌟 Great job!' :
                                    score >= questions.length * 0.5 ? '👍 Good effort!' :
                                        '💪 Keep learning!'}
                        </p>

                        <div className="space-y-3">
                            <Button onClick={resetQuiz} className="w-full">
                                <span className="flex items-center justify-center gap-2">
                                    <RotateCcw size={18} />
                                    Play Again
                                </span>
                            </Button>
                            <Link to="/leaderboard" className="block">
                                <button className="btn-secondary w-full flex items-center justify-center gap-2">
                                    <Trophy size={18} />
                                    View Leaderboard
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {/* Progress */}
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-primary font-semibold">
                                Question {currentQuestion + 1}/{questions.length}
                            </span>
                            <span className="text-muted text-sm">
                                Score: {score}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1 bg-white/10 rounded-full mb-6 overflow-hidden">
                            <motion.div
                                className="h-full bg-primary rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                            />
                        </div>

                        {/* Question */}
                        <motion.h2
                            key={currentQuestion}
                            className="text-xl text-white mb-6"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {questions[currentQuestion].question}
                        </motion.h2>

                        {/* Options */}
                        <div className="space-y-3">
                            {questions[currentQuestion].options.map((option, i) => (
                                <motion.button
                                    key={option}
                                    onClick={() => handleAnswerClick(option)}
                                    className={getOptionClass(option)}
                                    disabled={showFeedback}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <span className="flex items-center justify-between">
                                        {option}
                                        {showFeedback && option === questions[currentQuestion].answer && (
                                            <CheckCircle size={18} className="text-green-400" />
                                        )}
                                        {showFeedback && option === selectedAnswer && option !== questions[currentQuestion].answer && (
                                            <XCircle size={18} className="text-red-400" />
                                        )}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default Quiz;
