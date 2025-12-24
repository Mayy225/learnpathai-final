import { BookOpen, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Transition from '../components/ui/Transition';
import { Card } from '@/components/ui/card';

const Dashboard = () => {
  const navigate = useNavigate();

  const options = [
    {
      icon: BookOpen,
      title: 'Créer mon plan d\'apprentissage',
      emoji: '📚',
      description: 'Générez un parcours personnalisé adapté à vos objectifs',
      gradient: 'from-warm-yellow via-warm-orange to-warm-pink',
      onClick: () => navigate('/learning-plan'),
    },
    {
      icon: Target,
      title: 'Mode focus',
      emoji: '🎯',
      description: 'Concentrez-vous sur vos sessions d\'apprentissage',
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      onClick: () => navigate('/focus'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 noise-bg opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-warm-yellow/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-warm-pink/30 rounded-full blur-3xl animate-float animation-delay-1000"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Transition animation="fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight">
                Bienvenue sur <span className="gradient-text">LearnPath AI</span>
              </h1>
              <p className="text-text-medium text-lg sm:text-xl max-w-2xl mx-auto">
                Choisissez une option pour commencer votre parcours d'apprentissage
              </p>
            </div>
          </Transition>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {options.map((option, index) => {
              const Icon = option.icon;
              return (
                <Transition key={index} animation="fade-in" delay={index * 100}>
                  <Card
                    onClick={option.onClick}
                    className="relative group cursor-pointer overflow-hidden border-2 border-gray-200/50 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:scale-105"
                  >
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                    
                    {/* Card content */}
                    <div className="relative p-8 text-center">
                      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${option.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-text-dark">
                        {option.title} {option.emoji}
                      </h3>
                      
                      <p className="text-text-medium leading-relaxed">
                        {option.description}
                      </p>

                      {/* Animated arrow indicator */}
                      <div className="mt-6 flex items-center justify-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                        <span>Accéder</span>
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Transition>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
