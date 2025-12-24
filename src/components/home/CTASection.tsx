
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Transition from '../ui/Transition';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden">
      {/* Enhanced background with animated elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-yellow/20 via-warm-orange/30 to-warm-pink/20"></div>
      <div className="absolute inset-0 noise-bg opacity-10"></div>
      
      {/* Floating background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-warm-yellow/30 rounded-full blur-2xl sm:blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-56 h-56 sm:w-80 sm:h-80 bg-warm-pink/40 rounded-full blur-2xl sm:blur-3xl animate-float animation-delay-500"></div>
        <div className="absolute top-1/2 left-3/4 w-52 h-52 sm:w-72 sm:h-72 bg-warm-orange/30 rounded-full blur-2xl sm:blur-3xl animate-float animation-delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <Transition animation="slide-up">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-white/40 backdrop-blur-md border border-warm-orange/30 shadow-lg">
              <span className="text-xs sm:text-sm font-semibold text-text-dark">🚀 Commencez aujourd'hui</span>
            </div>
          </Transition>
          
          <Transition animation="slide-up" delay={100}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 tracking-tight leading-tight px-4 sm:px-0">
              <span className="text-text-dark">Prêt à transformer votre </span>
              <span className="gradient-text drop-shadow-sm">expérience d'apprentissage</span>
              <span className="text-text-dark"> ?</span>
            </h2>
          </Transition>
          
          <Transition animation="slide-up" delay={200}>
            <p className="text-text-medium text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4 sm:px-0">
              Rejoignez des milliers d'étudiants qui ont déjà amélioré leurs performances académiques avec des parcours d'apprentissage personnalisés.
            </p>
          </Transition>
          
          <Transition animation="slide-up" delay={300}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="group w-full sm:w-auto bg-gradient-to-r from-warm-orange via-[#FF9A7B] to-warm-pink hover:shadow-2xl hover:scale-105 active:scale-95 text-text-dark px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl shadow-xl border border-white/20 h-12 sm:h-14 md:h-16 font-semibold transition-all duration-300"
                onClick={() => navigate('/dashboard')}
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto bg-white/80 backdrop-blur-md border-2 border-warm-pink/30 hover:bg-warm-yellow/30 hover:border-warm-orange/50 text-text-dark px-6 sm:px-8 md:px-10 text-base sm:text-lg md:text-xl shadow-lg h-12 sm:h-14 md:h-16 font-medium transition-all duration-300 hover:scale-105"
                onClick={() => navigate('/pricing')}
              >
                Voir les tarifs
              </Button>
            </div>
          </Transition>
          
          <Transition animation="slide-up" delay={400}>
            <div className="mt-12 sm:mt-16 flex flex-wrap justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              {[
                { label: 'Personnalisé', color: 'from-purple-500 to-blue-500' },
                { label: 'Efficace', color: 'from-green-500 to-emerald-500' },
                { label: 'Adaptatif', color: 'from-orange-500 to-red-500' },
                { label: 'Intelligent', color: 'from-pink-500 to-rose-500' }
              ].map((tag, i) => (
                <span 
                  key={i} 
                  className={`text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r ${tag.color} text-white shadow-lg backdrop-blur-sm border border-white/20 hover:scale-105 transition-transform duration-300 font-medium`}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </Transition>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
