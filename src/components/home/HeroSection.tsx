
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Transition from '../ui/Transition';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-32 md:pb-24">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 noise-bg"></div>
      <div className="absolute inset-0 bg-gradient-radial from-warm-yellow/40 via-warm-orange/20 to-transparent"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-warm-pink/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-warm-yellow/40 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Transition animation="fade-in">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-warm-yellow/60 to-warm-orange/40 border border-warm-orange/30 backdrop-blur-sm shadow-lg">
              <span className="text-xs sm:text-sm font-semibold text-text-dark bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                ✨ Apprentissage personnalisé propulsé par l'IA
              </span>
            </div>
          </Transition>
          
          <Transition animation="fade-in" delay={150}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8 tracking-tight leading-tight px-2 sm:px-0">
              Parcours d'apprentissage
              <span className="gradient-text block sm:inline drop-shadow-sm"> adaptés à vous</span>
            </h1>
          </Transition>
          
          <Transition animation="fade-in" delay={300}>
            <p className="text-text-medium text-lg sm:text-xl md:text-2xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              Créez des plans d'apprentissage personnalisés basés sur vos compétences, objectifs et style d'apprentissage le tout propulsé par une IA avancée.
            </p>
          </Transition>
          
          <Transition animation="fade-in" delay={450}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="group w-full sm:w-auto bg-gradient-to-r from-[#FEC6A1] via-[#FF9A7B] to-[#FFDEE2] text-text-dark hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg font-semibold shadow-lg border border-white/20"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                onClick={() => navigate('#how-it-works')}
                className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-base sm:text-lg hover:bg-white/20 backdrop-blur-sm border border-transparent hover:border-warm-orange/30 transition-all duration-300 font-medium"
              >
                Découvrir comment ça marche
              </Button>
            </div>
          </Transition>
        </div>
        
        <Transition animation="fade-in" delay={600}>
          <div className="mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto px-4 sm:px-0">
            <div className="relative group">
              <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink opacity-30 blur-xl sm:blur-2xl group-hover:opacity-40 transition-opacity duration-500 rounded-xl sm:rounded-2xl"></div>
              <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow-xl sm:shadow-2xl border border-gray-100/50 backdrop-blur-sm">
                <img 
                  src="/lovable-uploads/fed59134-0bee-4dc2-a00f-c89d898dcf79.png" 
                  alt="Comparaison entre un étudiant frustré et une étudiante utilisant LearnPath AI" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent"></div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </section>
  );
};

export default HeroSection;
