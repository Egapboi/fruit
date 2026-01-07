import React from 'react';

const Quiz = () => {
    return (
        <div className="page-container text-center">
            <h1 className="text-3xl text-white mb-6">Plant Quiz</h1>
            <div className="glass-panel p-6 max-w-lg mx-auto">
                <p className="text-gray-300 mb-4">Test your knowledge about plants!</p>
                <button className="btn-primary">Start Quiz</button>
            </div>
        </div>
    );
};

export default Quiz;
