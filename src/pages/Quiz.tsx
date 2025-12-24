
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const Quiz = () => {
  const navigate = useNavigate();
  const { hasSubscription, getCurrentPlan } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentPlan = getCurrentPlan();

  useEffect(() => {
    // Redirect if no subscription or no learning plan
    if (!hasSubscription) {
      navigate('/pricing');
      return;
    }

    if (!currentPlan) {
      navigate('/create-learning-plan');
      return;
    }

    // Generate mock questions based on the user's learning plan
    const mockQuestions = generateQuestionsFromPlan(currentPlan);
    setQuestions(mockQuestions);
    setLoading(false);
  }, [hasSubscription, currentPlan, navigate]);

  const generateQuestionsFromPlan = (plan: any) => {
    // In a real application, this would call an API to generate questions
    // based on the learning plan details
    const subject = plan.subject.toLowerCase();
    
    // Mock questions - in a real app, these would be generated based on the plan details
    if (subject.includes('math') || subject.includes('mathématiques')) {
      return [
        {
          id: 1,
          question: "Quelle est la solution de l'équation 2x + 5 = 13?",
          options: ["x = 3", "x = 4", "x = 5", "x = 6"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Quelle est l'aire d'un cercle de rayon 5 cm?",
          options: ["25π cm²", "10π cm²", "5π cm²", "15π cm²"],
          correctAnswer: 0
        },
        {
          id: 3,
          question: "Quelle est la dérivée de f(x) = x²?",
          options: ["f'(x) = x", "f'(x) = 2x", "f'(x) = 2", "f'(x) = x²"],
          correctAnswer: 1
        }
      ];
    } else if (subject.includes('français') || subject.includes('littérature')) {
      return [
        {
          id: 1,
          question: "Qui a écrit 'Les Misérables'?",
          options: ["Albert Camus", "Victor Hugo", "Émile Zola", "Gustave Flaubert"],
          correctAnswer: 1
        },
        {
          id: 2,
          question: "Quel est le temps verbal dans 'Il mangea une pomme'?",
          options: ["Présent", "Imparfait", "Passé simple", "Passé composé"],
          correctAnswer: 2
        },
        {
          id: 3,
          question: "Comment s'appelle la principale figure de style qui consiste à comparer deux éléments sans utiliser 'comme'?",
          options: ["Comparaison", "Métaphore", "Allitération", "Hyperbole"],
          correctAnswer: 1
        }
      ];
    } else {
      // Default questions if subject is not recognized
      return [
        {
          id: 1,
          question: `Question sur ${plan.subject} - Difficulté adaptée à votre niveau scolaire ${plan.schoolLevel}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 0
        },
        {
          id: 2,
          question: `Question avancée sur ${plan.subject} - Basée sur vos difficultés: ${plan.learningDifficulties}`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 1
        },
        {
          id: 3,
          question: `Question spécifique sur ${plan.subject} - Adaptée à votre demande: ${plan.specificRequests.substring(0, 30)}...`,
          options: ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: 2
        }
      ];
    }
  };

  const handleOptionClick = (optionIndex: number) => {
    if (isAnswered) return;
    
    setSelectedOption(optionIndex);
    setIsAnswered(true);
    
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 mt-16 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-warm-orange" />
            <p className="mt-4">Chargement de votre quiz personnalisé...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-16 mt-16">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="mb-4 sm:mb-6 bg-white/80 hover:bg-white border-gray-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux rubriques
        </Button>
        
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4 sm:p-6 md:p-8">
          {!quizCompleted ? (
            <>
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                  <h2 className="text-xl sm:text-2xl font-bold gradient-text">Quiz: {currentPlan?.subject}</h2>
                  <span className="text-xs sm:text-sm font-medium bg-warm-orange/20 text-warm-orange px-3 py-1 rounded-full">
                    Question {currentQuestionIndex + 1}/{questions.length}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] h-2 rounded-full" 
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6">
                  {questions[currentQuestionIndex]?.question}
                </h3>
                
                <div className="space-y-3">
                  {questions[currentQuestionIndex]?.options.map((option, idx) => (
                    <div 
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedOption === idx 
                          ? selectedOption === questions[currentQuestionIndex].correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-red-500 bg-red-50"
                          : isAnswered && idx === questions[currentQuestionIndex].correctAnswer
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-warm-orange/50 hover:bg-warm-orange/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {isAnswered && idx === selectedOption && idx === questions[currentQuestionIndex].correctAnswer && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        {isAnswered && idx === selectedOption && idx !== questions[currentQuestionIndex].correctAnswer && (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        {isAnswered && idx !== selectedOption && idx === questions[currentQuestionIndex].correctAnswer && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center sm:justify-end">
                <Button
                  onClick={nextQuestion}
                  disabled={!isAnswered}
                  className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90 flex items-center w-full sm:w-auto justify-center"
                >
                  {currentQuestionIndex < questions.length - 1 ? "Question suivante" : "Terminer le quiz"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <h2 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Quiz terminé !</h2>
              <div className="text-4xl sm:text-5xl font-bold mb-4 sm:mb-6">{score}/{questions.length}</div>
              <p className="mb-6 sm:mb-8 text-sm sm:text-base px-4">
                {score === questions.length ? "Parfait ! Vous avez tout bon !" :
                 score >= questions.length / 2 ? "Bien joué ! Continuez à vous améliorer." :
                 "Continuez à pratiquer, vous ferez mieux la prochaine fois !"}
              </p>
              <Button
                onClick={restartQuiz}
                className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90 w-full sm:w-auto"
              >
                Recommencer le quiz
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Quiz;
