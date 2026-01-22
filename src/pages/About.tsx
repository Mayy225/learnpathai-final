import { Brain, Target, Focus, MessageSquare, Sparkles, Rocket, GraduationCap, Heart, Zap } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Transition from '@/components/ui/Transition';

const About = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Plans d'apprentissage automatiques",
      description: "Adaptés à ta matière et ton niveau pour un parcours sur mesure."
    },
    {
      icon: Focus,
      title: "Mode Focus",
      description: "Choisis ta méthode de révision : lecture, quiz, fiches, et plus encore."
    },
    {
      icon: MessageSquare,
      title: "Assistant IA intelligent",
      description: "Disponible 24h/24 pour répondre à toutes tes questions."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-24">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-warm-yellow/20 via-warm-orange/10 to-warm-pink/20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-warm-yellow/30 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-warm-pink/20 rounded-full blur-3xl" />
          
          <div className="container mx-auto px-4 relative z-10">
            <Transition animation="fade-in" delay={0}>
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-warm-yellow/30 to-warm-orange/30 backdrop-blur-sm mb-6">
                  <Sparkles className="w-5 h-5 text-warm-orange" />
                  <span className="text-sm font-medium text-text-dark">À propos de LearnPath AI</span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">
                  Réinventer la façon d'apprendre
                </h1>
                
                <p className="text-lg md:text-xl text-text-medium max-w-2xl mx-auto leading-relaxed">
                  Bienvenue sur <span className="font-semibold text-text-dark">LearnPath AI</span>, la plateforme qui réinvente la façon d'apprendre et de réviser.
                  Notre mission est simple : aider chaque étudiant à progresser plus vite, grâce à l'intelligence artificielle. 🚀
                </p>
              </div>
            </Transition>
          </div>
        </section>

        {/* Notre Vision Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Transition animation="fade-in" delay={100}>
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl">
                  <div className="absolute -top-6 left-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warm-yellow to-warm-orange flex items-center justify-center shadow-lg">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 mt-4 gradient-text">
                    🎯 Notre vision
                  </h2>
                  
                  <div className="space-y-4 text-text-medium text-lg leading-relaxed">
                    <p>
                      Nous croyons que <span className="font-semibold text-text-dark">chacun apprend différemment</span>.
                      C'est pourquoi LearnPath AI crée pour toi un plan d'apprentissage <span className="font-semibold text-warm-orange">100 % personnalisé</span>, adapté à ton niveau, ton rythme et ta manière d'étudier.
                    </p>
                    <p>
                      Avec notre IA éducative, tu n'es plus seul face à tes cours.
                      Elle t'accompagne pas à pas pour mieux <span className="font-semibold text-text-dark">comprendre</span>, <span className="font-semibold text-text-dark">mémoriser</span> et <span className="font-semibold text-text-dark">t'organiser</span>.
                    </p>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-warm-yellow/5 to-transparent">
          <div className="container mx-auto px-4">
            <Transition animation="fade-in" delay={0}>
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
                  🌟 Ce que LearnPath AI t'apporte
                </h2>
              </div>
            </Transition>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <Transition key={index} animation="scale-in" delay={index * 100}>
                  <div className="group relative bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-warm-yellow/0 via-warm-orange/0 to-warm-pink/0 group-hover:from-warm-yellow/10 group-hover:via-warm-orange/10 group-hover:to-warm-pink/10 rounded-2xl transition-all duration-300" />
                    
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-warm-yellow to-warm-orange flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-xl font-semibold mb-2 text-text-dark">
                        {feature.title}
                      </h3>
                      
                      <p className="text-text-medium">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Transition>
              ))}
            </div>
          </div>
        </section>

        {/* Notre Objectif Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Transition animation="fade-in" delay={100}>
              <div className="max-w-4xl mx-auto">
                <div className="relative bg-gradient-to-br from-warm-pink/20 via-warm-orange/10 to-warm-yellow/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-xl overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-warm-orange/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warm-orange to-warm-pink flex items-center justify-center shadow-lg">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold gradient-text">
                        💡 Notre objectif
                      </h2>
                    </div>
                    
                    <div className="space-y-4 text-text-medium text-lg leading-relaxed">
                      <p>
                        Faire de LearnPath AI <span className="font-semibold text-text-dark">ton meilleur allié pour réussir</span>.
                      </p>
                      <p>
                        Que tu sois au <span className="font-semibold text-warm-orange">collège</span>, au <span className="font-semibold text-warm-orange">lycée</span> ou dans le <span className="font-semibold text-warm-orange">supérieur</span>, nous voulons rendre tes révisions plus simples, plus efficaces et surtout plus motivantes. 🌈
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </section>

        {/* L'avenir Section */}
        <section className="py-16 md:py-20 bg-gradient-to-b from-transparent via-warm-orange/5 to-transparent">
          <div className="container mx-auto px-4">
            <Transition animation="fade-in" delay={100}>
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warm-yellow to-warm-orange flex items-center justify-center shadow-lg">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-6 gradient-text">
                  🚀 L'avenir de LearnPath AI
                </h2>
                
                <p className="text-lg text-text-medium max-w-2xl mx-auto mb-8">
                  Ce n'est que le début. De nouvelles fonctionnalités arrivent bientôt pour rendre ton expérience d'apprentissage encore plus incroyable.
                </p>
                
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-warm-orange animate-pulse" />
                  <span className="text-text-medium font-medium">Stay tuned...</span>
                  <Zap className="w-5 h-5 text-warm-orange animate-pulse" />
                </div>
              </div>
            </Transition>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Transition animation="scale-in" delay={0}>
              <div className="max-w-3xl mx-auto text-center relative">
                <div className="absolute inset-0 bg-gradient-to-r from-warm-yellow/30 via-warm-orange/30 to-warm-pink/30 rounded-3xl blur-2xl" />
                
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl">
                  <Sparkles className="w-10 h-10 text-warm-orange mx-auto mb-6" />
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 gradient-text">
                    ✨ Apprends autrement. Révise efficacement.
                  </h2>
                  
                  <p className="text-xl font-semibold text-text-dark mb-2">
                    Progresse avec LearnPath AI.
                  </p>
                  
                  <p className="text-lg text-text-medium italic">
                    Ton apprentissage, ton rythme, ton succès.
                  </p>
                </div>
              </div>
            </Transition>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
