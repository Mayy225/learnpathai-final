
import Transition from '../ui/Transition';
import { CheckCircle } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Saisissez vos informations',
    description: 'Partagez votre âge, niveau, performances académiques, défis et matière d\'intérêt.',
    points: ['Formulaire simple et intuitif', 'Prend moins de 2 minutes', 'Création de profil complète']
  },
  {
    number: '02',
    title: 'L\'IA génère votre plan',
    description: 'Nos algorithmes avancés créent un plan d\'apprentissage personnalisé adapté à vos besoins.',
    points: ['Analyse votre style d\'apprentissage', 'Identifie les stratégies optimales', 'S\'adapte à votre rythme']
  },
  {
    number: '03',
    title: 'Révisez et personnalisez',
    description: 'Examinez votre plan d\'apprentissage et apportez des ajustements pour mieux correspondre à vos préférences.',
    points: ['Capacités d\'édition complètes', 'Ajoutez ou supprimez des sections', 'Priorisez des domaines spécifiques']
  },
  {
    number: '04',
    title: 'Commencez à apprendre efficacement',
    description: 'Suivez votre plan personnalisé et suivez votre progression pendant que vous apprenez et évoluez.',
    points: ['Guide étape par étape clair', 'Téléchargement en PDF', 'Revisitez et mettez à jour à tout moment']
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Transition animation="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 rounded-full bg-warm-pink/30">
              <span className="text-xs sm:text-sm font-medium text-text-dark">Comment ça marche</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight px-4 sm:px-0">
              Quatre étapes simples vers <span className="gradient-text">la réussite d'apprentissage</span>
            </h2>
            <p className="text-text-medium text-lg sm:text-xl leading-relaxed px-4 sm:px-0">
              Notre processus rationalisé facilite la prise en main de plans d'apprentissage personnalisés en quelques minutes.
            </p>
          </div>
        </Transition>
        
        <div className="space-y-8 sm:space-y-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <Transition key={index} animation="slide-up" delay={100 + index * 100}>
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-start bg-white/50 p-6 sm:p-8 rounded-xl sm:rounded-2xl backdrop-blur-sm border border-gray-100/50 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 rounded-full bg-gradient-warm flex items-center justify-center mx-auto md:mx-0">
                  <span className="text-lg sm:text-xl font-bold text-text-dark">{step.number}</span>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-text-medium text-base sm:text-lg mb-3 sm:mb-4">{step.description}</p>
                  
                  <ul className="space-y-1.5 sm:space-y-2">
                    {step.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-2 justify-center md:justify-start">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-warm-orange mt-0.5 flex-shrink-0" />
                        <span className="text-text-medium text-sm sm:text-base">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
