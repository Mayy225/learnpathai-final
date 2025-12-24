
import Transition from '../ui/Transition';
import { Brain, Target, Clock, PenTool, BookOpen, Focus, MessageSquare } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Analyse Propulsée par l\'IA',
    description: 'Notre IA avancée analyse votre style d\'apprentissage, vos forces et vos points à améliorer.',
    gradient: 'from-purple-500 to-blue-500'
  },
  {
    icon: Target,
    title: 'Plans Personnalisés',
    description: 'Obtenez des plans d\'apprentissage sur mesure qui s\'adaptent à vos besoins et objectifs spécifiques.',
    gradient: 'from-orange-500 to-red-500'
  },
  {
    icon: Clock,
    title: 'Optimisation du Temps',
    description: 'Gérez efficacement votre temps d\'étude avec des horaires d\'apprentissage optimisés.',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: PenTool,
    title: 'Contenu Personnalisable',
    description: 'Modifiez et ajustez vos plans d\'apprentissage selon vos préférences.',
    gradient: 'from-pink-500 to-rose-500'
  },
  {
    icon: BookOpen,
    title: 'Ressources Complètes',
    description: 'Accédez à une large gamme de matériels éducatifs adaptés à votre programme.',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    icon: Focus,
    title: 'Mode Focus',
    description: 'Concentrez-vous pleinement sur vos études avec un environnement sans distractions et un suivi du temps.',
    gradient: 'from-cyan-500 to-blue-500'
  },
  {
    icon: MessageSquare,
    title: 'Assistant IA',
    description: 'Posez vos questions à tout moment et obtenez des réponses instantanées de notre assistant intelligent.',
    gradient: 'from-violet-500 to-purple-500'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 bg-gradient-to-b from-white to-gray-50/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 h-48 sm:w-72 sm:h-72 bg-warm-yellow/20 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 h-64 sm:w-96 sm:h-96 bg-warm-pink/20 rounded-full blur-2xl sm:blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Transition animation="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 sm:mb-6 rounded-full bg-gradient-to-r from-warm-orange/30 to-warm-pink/20 backdrop-blur-sm border border-warm-orange/20 shadow-sm">
              <span className="text-xs sm:text-sm font-semibold text-text-dark">✨ Fonctionnalités</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight px-4 sm:px-0">
              Tout ce dont vous avez besoin pour un <span className="gradient-text">apprentissage efficace</span>
            </h2>
            <p className="text-text-medium text-lg sm:text-xl leading-relaxed font-light px-4 sm:px-0">
              Notre plateforme combine la technologie IA avec l'expertise éducative pour créer l'expérience d'apprentissage parfaite pour les étudiants de tous niveaux.
            </p>
          </div>
        </Transition>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Transition key={index} animation="slide-up" delay={100 + index * 100}>
              <div className="group relative bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-100/50 shadow-lg hover:shadow-2xl transition-all duration-500 h-full hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-warm-yellow/5 via-warm-orange/5 to-warm-pink/5 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 mb-4 sm:mb-6 rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-900 group-hover:text-gray-800 transition-colors">{feature.title}</h3>
                  <p className="text-text-medium leading-relaxed font-light text-sm sm:text-base">{feature.description}</p>
                </div>
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
