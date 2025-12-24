
import React, { useEffect, useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Book, Sparkles, WandSparkles, Brain, Zap } from 'lucide-react';
import Transition from '../components/ui/Transition';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@/components/ui/progress";

const LoadingPlan = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gradientPosition, setGradientPosition] = useState(0);
  const [progress, setProgress] = useState(0);

  // Vérifier si l'utilisateur est connecté
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    // Animation de la barre de progression
    const animationInterval = setInterval(() => {
      setGradientPosition(prev => (prev + 1) % 200);
    }, 50);

    // Progression simulée
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + Math.random() * 2;
      });
    }, 200);

    // Timeout pour la redirection
    const redirectTimeout = setTimeout(() => {
      if (currentUser) {
        navigate('/generated-plan');
      }
    }, 60000);

    return () => {
      clearInterval(animationInterval);
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [currentUser, navigate]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-warm-yellow/10 to-warm-pink/10 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-warm-yellow/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-warm-pink/20 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 mt-16 relative z-10">
        <Transition animation="fade-in">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-10">
              <div className="relative flex items-center">
                <div className="relative">
                  <Brain className="h-10 w-10 text-warm-orange mr-3 animate-pulse-slow" />
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse-slow animation-delay-300" />
                  </div>
                </div>
                <div className="flex items-center">
                  <Zap className="h-6 w-6 text-orange-500 mr-2 animate-pulse-slow animation-delay-500" />
                  <h2 className="text-3xl md:text-4xl font-bold gradient-text">Création de votre plan d'apprentissage</h2>
                </div>
              </div>
            </div>

            <Card className="mb-10 shadow-2xl border-2 border-warm-orange/20 overflow-hidden bg-white/90 backdrop-blur-sm">
              <CardContent className="pt-8 pb-8">
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-xl text-muted-foreground mb-2 font-medium">
                        Notre IA analyse vos informations pour créer un plan personnalisé...
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-warm-orange font-medium">
                        <WandSparkles className="h-4 w-4 animate-pulse-slow" />
                        <span>Intelligence artificielle en action</span>
                        <WandSparkles className="h-4 w-4 animate-pulse-slow animation-delay-500" />
                      </div>
                    </div>
                    
                    <div className="py-6 relative">
                      <div className="mb-4 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Progression</span>
                        <span className="text-sm font-semibold text-warm-orange">{Math.round(progress)}%</span>
                      </div>
                      
                      <div className="relative">
                        <div 
                          className="h-8 w-full rounded-full overflow-hidden shadow-inner border border-warm-orange/20"
                          style={{ background: 'linear-gradient(to right, rgba(254, 198, 161, 0.1), rgba(255, 222, 226, 0.1))' }}
                        >
                          <div 
                            className="h-full rounded-full relative overflow-hidden transition-all duration-500"
                            style={{ 
                              background: `linear-gradient(90deg, #FFD700, #FEC6A1, #FF9A7B, #FFDEE2, #FFD700)`,
                              backgroundSize: '200% 100%',
                              backgroundPosition: `${gradientPosition}% 0`,
                              width: `${progress}%`,
                              boxShadow: '0 0 20px rgba(254, 198, 161, 0.5)'
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse-slow"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8 py-6">
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center animate-pulse-slow shadow-lg">
                        <span className="text-white font-bold text-lg">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2 text-gray-800">Analyse de votre profil</h4>
                        <Skeleton className="h-3 w-3/4 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center animate-pulse-slow animation-delay-300 shadow-lg">
                        <span className="text-white font-bold text-lg">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2 text-gray-800">Génération du contenu personnalisé</h4>
                        <Skeleton className="h-3 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-full mb-2" />
                        <Skeleton className="h-3 w-2/3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 group">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center animate-pulse-slow animation-delay-500 shadow-lg">
                        <span className="text-white font-bold text-lg">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-2 text-gray-800">Optimisation et structuration</h4>
                        <Skeleton className="h-6 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg mb-2" />
                        <Skeleton className="h-6 w-4/5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center bg-gradient-to-r from-warm-yellow/20 to-warm-pink/20 rounded-xl p-6 border border-warm-orange/20">
                    <div className="flex items-center justify-center mb-3">
                      <Sparkles className="h-5 w-5 text-warm-orange mr-2 animate-pulse-slow" />
                      <span className="text-lg font-semibold text-gray-800">Finalisation en cours...</span>
                      <Sparkles className="h-5 w-5 text-warm-orange ml-2 animate-pulse-slow animation-delay-300" />
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      Cette opération peut prendre jusqu'à une minute...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </Transition>
      </main>
      <Footer />
    </div>
  );
};

export default LoadingPlan;
