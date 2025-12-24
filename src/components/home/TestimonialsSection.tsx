
import Transition from '../ui/Transition';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "LearnPath AI a transformé ma façon d'étudier pour les examens. Les plans personnalisés se concentrent exactement sur ce que j'ai besoin d'améliorer.",
    author: "Sarah K.",
    role: "Lycéenne",
    stars: 5
  },
  {
    quote: "Je luttais avec la gestion du temps pour mes études. LearnPath a créé un emploi du temps qui fonctionne parfaitement avec mon style d'apprentissage.",
    author: "Emma L.",
    role: "Étudiante universitaire",
    stars: 4
  }
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Transition animation="slide-up">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 mb-4 rounded-full bg-warm-yellow/50">
              <span className="text-xs sm:text-sm font-medium text-text-dark">Témoignages</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 px-4 sm:px-0">
              Histoires de réussite de nos <span className="gradient-text">utilisateurs satisfaits</span>
            </h2>
            <p className="text-text-medium text-lg sm:text-xl px-4 sm:px-0">
              Découvrez comment LearnPath AI a aidé des étudiants à améliorer leurs résultats d'apprentissage.
            </p>
          </div>
        </Transition>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Transition key={index} animation="slide-up" delay={100 + index * 100}>
              <div className="bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warm-orange text-warm-orange" />
                  ))}
                  {[...Array(5 - testimonial.stars)].map((_, i) => (
                    <Star key={i + testimonial.stars} className="h-4 w-4 text-gray-200" />
                  ))}
                </div>
                <p className="text-text-medium mb-6 text-sm sm:text-base leading-relaxed">"{testimonial.quote}"</p>
                <div className="mt-auto">
                  <p className="font-semibold text-sm sm:text-base">{testimonial.author}</p>
                  <p className="text-text-light text-xs sm:text-sm">{testimonial.role}</p>
                </div>
              </div>
            </Transition>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
