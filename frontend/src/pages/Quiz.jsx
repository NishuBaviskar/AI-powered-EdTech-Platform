import { useState } from 'react';
import api from '../api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import QuizHistoryModal from '../components/QuizHistoryModal'; // Import the history modal
import { FiSearch, FiClock } from 'react-icons/fi';

const Quiz = () => {
    // State for the search bar input
    const [topicInput, setTopicInput] = useState('');
    // State to hold the confirmed topic after a quiz is generated
    const [selectedSubject, setSelectedSubject] = useState(null);
    // State for the questions fetched from the AI
    const [questions, setQuestions] = useState([]);
    // State to track the current question index
    const [currentQuestion, setCurrentQuestion] = useState(0);
    // State for the user's selected answer on the current question
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    // State to track if the selected answer was correct
    const [isCorrect, setIsCorrect] = useState(null);
    // State for the user's score
    const [score, setScore] = useState(0);
    // State to control visibility of the final score screen
    const [showScore, setShowScore] = useState(false);
    // State to show a loading indicator during API calls
    const [loading, setLoading] = useState(false);
    // State to control visibility of the quiz history modal
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    // Fetches quiz questions from the backend AI
    const fetchQuestions = async (e) => {
        e.preventDefault();
        if (!topicInput.trim()) {
            toast.error("Please enter a topic for the quiz.");
            return;
        }
        setLoading(true);
        setQuestions([]); // Clear old questions
        try {
            const res = await api.get(`/quiz/${topicInput}`);
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                setQuestions(res.data);
                setSelectedSubject(topicInput);
            } else {
                toast.error(`Could not generate a quiz for "${topicInput}". Please try another topic.`);
            }
        } catch (err) {
            toast.error('Failed to generate the quiz. The AI might be busy!');
        } finally {
            setLoading(false);
        }
    };
    
    // Saves the final quiz result to the database
    const saveQuizResult = async (finalScore) => {
        try {
            await api.post('/history/quiz', {
                topic: selectedSubject,
                score: finalScore,
                total_questions: questions.length
            });
        } catch (error) {
            console.error("Failed to save quiz history", error);
        }
    };

    // Handles what happens when a user clicks an answer
    const handleAnswer = (option) => {
        if (selectedAnswer) return; // Prevent answering twice
        const correct = option === questions[currentQuestion].correct_answer;
        let finalScore = score;
        if (correct) {
            finalScore++;
            setScore(finalScore);
        }
        setSelectedAnswer(option);
        setIsCorrect(correct);
        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedAnswer(null);
                setIsCorrect(null);
            } else {
                saveQuizResult(finalScore); // Save the result when the quiz ends
                setShowScore(true);
            }
        }, 1200);
    };

    // Resets the component state to start a brand new quiz
    const restartQuiz = () => {
        setTopicInput('');
        setSelectedSubject(null);
        setQuestions([]);
        setCurrentQuestion(0);
        setScore(0);
        setShowScore(false);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    // Resets the state to try the same quiz again
    const handleTryAgain = () => {
        setShowScore(false);
        setCurrentQuestion(0);
        setScore(0);
        setSelectedAnswer(null);
        setIsCorrect(null);
    };

    return (
        <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                {/* The main card with the search bar is always visible */}
                <Card>
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Generate a Custom Quiz</h2>
                            <p className="text-textSecondary mb-4">Enter any topic and our AI will create a quiz for you!</p>
                        </div>
                        <Button onClick={() => setIsHistoryOpen(true)} className="p-2 bg-gray-100 hover:bg-gray-200 text-textSecondary" title="View Quiz History">
                            <FiClock />
                        </Button>
                    </div>
                    <form onSubmit={fetchQuestions} className="flex flex-col sm:flex-row items-center gap-2">
                        <div className="w-full sm:flex-grow">
                             <Input id="topic" name="topic" type="text" value={topicInput} onChange={(e) => setTopicInput(e.target.value)} placeholder="e.g., World War II, Photosynthesis, Java..."/>
                        </div>
                        <Button type="submit" disabled={loading} icon={FiSearch} className="w-full sm:w-auto">
                            {loading ? 'Generating...' : 'Start Quiz'}
                        </Button>
                    </form>
                </Card>
                
                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center mt-8">
                            <Card><p className="text-textSecondary">Our AI is hard at work... please wait a moment!</p></Card>
                        </motion.div>
                    )}

                    {!loading && questions.length > 0 && !showScore && (
                        <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 bg-surface p-6 sm:p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
                            {questions[currentQuestion] && questions[currentQuestion].options && (
                                 <AnimatePresence mode="wait">
                                    <motion.div key={currentQuestion} initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}>
                                        <div className="mb-6">
                                            <p className="text-lg font-semibold text-primary">Question {currentQuestion + 1}/{questions.length}</p>
                                            <h3 className="text-2xl mt-2 font-medium text-textPrimary">{questions[currentQuestion].question}</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {questions[currentQuestion].options.map((option, index) => {
                                                const getButtonClass = () => {
                                                    if (!selectedAnswer) return "bg-gray-100 hover:bg-primary hover:text-white";
                                                    if (option === questions[currentQuestion].correct_answer) return "bg-green-500 text-white";
                                                    if (option === selectedAnswer) return "bg-red-500 text-white";
                                                    return "bg-gray-100 cursor-not-allowed opacity-60";
                                                };
                                                return (
                                                    <motion.button key={index} whileHover={{ scale: selectedAnswer ? 1 : 1.05 }} whileTap={{ scale: selectedAnswer ? 1 : 0.95 }}
                                                        onClick={() => handleAnswer(option)} disabled={!!selectedAnswer}
                                                        className={`w-full p-4 rounded-lg text-left transition-all duration-300 font-medium ${getButtonClass()}`}>
                                                        {option}
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </motion.div>
                    )}

                    {showScore && (
                        <motion.div key="score" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center bg-surface p-8 rounded-2xl shadow-xl mt-8">
                            <h2 className="text-4xl font-bold text-primary mb-4">Quiz Complete!</h2>
                            <p className="text-2xl mb-2 text-textPrimary">Your Score</p>
                            <p className="text-6xl font-bold mb-6 text-secondary">{score} <span className="text-3xl text-textSecondary">/ {questions.length}</span></p>
                            <div className="flex justify-center gap-4">
                                <Button onClick={handleTryAgain} className="bg-gray-500 hover:bg-gray-600">Try Again</Button>
                                <Button onClick={restartQuiz} className="bg-secondary hover:bg-secondary-dark">New Quiz</Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <QuizHistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
        </>
    );
};

export default Quiz;