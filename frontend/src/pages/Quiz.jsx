import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Quiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const res = await api.get('/quiz');
            setQuestions(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching quiz:', error);
            setLoading(false);
        }
    };

    const handleAnswerOptionClick = (selectedOption) => {
        if (selectedOption === questions[currentQuestion].answer) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion);
        } else {
            setShowScore(true);
            submitScore(score + (selectedOption === questions[currentQuestion].answer ? 1 : 0));
        }
    };

    const submitScore = async (finalScore) => {
        try {
            // Assuming user is stored in localStorage and has an ID. 
            // Ideally we get user from context or local storage.
            // Since Login.jsx stored 'user' object:
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                await api.post('/quiz/submit', { userId: user.id || 1, score: finalScore }); // Default ID 1 if missing
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading Quiz...</div>;
    if (questions.length === 0) return <div className="text-center mt-10">No questions available.</div>;

    return (
        <div className="page-container text-center">
            <h1 className="text-3xl text-white mb-6">Plant Quiz</h1>
            <div className="glass-panel p-6 max-w-lg mx-auto text-left">
                {showScore ? (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-4">You scored {score} out of {questions.length}</h2>
                        <p className="text-gray-300 mb-6">Great job growing your knowledge!</p>
                        <button className="btn-primary" onClick={() => {
                            setShowScore(false);
                            setCurrentQuestion(0);
                            setScore(0);
                        }}>Play Again</button>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            <span className="text-primary font-bold">Question {currentQuestion + 1}</span>/{questions.length}
                        </div>
                        <h2 className="text-xl text-white mb-6">{questions[currentQuestion].question}</h2>
                        <div className="flex flex-col gap-3">
                            {questions[currentQuestion].options.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handleAnswerOptionClick(option)}
                                    className="p-3 bg-slate-700/50 hover:bg-primary/20 border border-slate-600 rounded-lg text-left transition-colors text-white"
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Quiz;
