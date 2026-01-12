import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Brain, Zap, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Transition from '../components/ui/Transition';

type FocusMode = 'pomodoro' | 'deep' | 'sprint' | 'custom';
type SessionType = 'focus' | 'break';

const focusModes = {
  pomodoro: { focus: 25, break: 5, name: 'Pomodoro', icon: Brain, gradient: 'from-warm-yellow via-warm-orange to-warm-pink' },
  deep: { focus: 45, break: 10, name: 'Deep Focus', icon: Brain, gradient: 'from-warm-yellow via-warm-orange to-warm-pink' },
  sprint: { focus: 15, break: 5, name: 'Sprint', icon: Zap, gradient: 'from-warm-yellow via-warm-orange to-warm-pink' },
  custom: { focus: 25, break: 5, name: 'Libre', icon: Clock, gradient: 'from-warm-yellow via-warm-orange to-warm-pink' },
};

const motivationalQuotes = [
  "Restez concentré, vous faites un excellent travail ! 💪",
  "Chaque minute compte vers votre objectif ! 🎯",
  "La concentration est la clé du succès ! ✨",
  "Vous êtes sur la bonne voie ! 🚀",
  "Continuez ainsi, c'est excellent ! 🌟",
  "Votre futur vous remerciera ! 💡",
  "La persévérance mène à la réussite ! 🏆",
  "Restez dans la zone, vous êtes incroyable ! 🔥",
];

const completionMessages = [
  "Bravo ! Session terminée avec succès ! 🎉",
  "Excellent travail ! Vous l'avez fait ! 🌟",
  "Félicitations ! Quelle concentration ! 🏆",
  "Superbe ! Vous êtes sur la bonne voie ! 🚀",
  "Magnifique session ! Continuez ainsi ! ✨",
];

const FocusMode = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<FocusMode | null>(null);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>('focus');
  const [customHours, setCustomHours] = useState(0);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [completionMessage, setCompletionMessage] = useState('');

  useEffect(() => {
    if (isActive) {
      const quoteInterval = setInterval(() => {
        setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      }, 30000);
      setCurrentQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
      return () => clearInterval(quoteInterval);
    }
  }, [isActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            handleSessionComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, minutes, seconds, sessionType]);

  const handleSessionComplete = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYJGWi77eeaTRAMUKbk77ZiGwU7k9jyz3omBSh+zPLaizsKFGS56+yoVRQLR5/h8r5sIAUsgs/y2og1CRlpu+znmk0QDU+m5O+1YRsGOpPY8tB5JgUogc3y2oo2ChVluuvur1cVDEef4PK/bCAFKoPO8teJNQgaaLvs56FNDwxPpuTvtmEbBTqS2PLQeSUGJ4HN8tuKNgoUZbnr7q9XFQtHn+Dyv20gBSqDzvLXiTUIG2i77OWeThAMUKXk8LVhGgU4k9jy0HklBiiCzvLaizYKFGS56++vVxQMR5/g8r9sIAUqg87y14k1CB1nu+znm08PDlCl5O+2YRsGOZLZ8s96JgUngM3y3Is2ChRluevssFYUC0ef4PK+bCEGKoLO8tiJNQgbabvs55tOEAxPpeTvtmAbBTmS2PLPeSYFJ4DN8tyLNgoUZLnr7K9WFAxHn+Dywm0gBSuCzvLYiDQIG2i67OeZThANUKXk77VhGwU5ktjyz3klBSeAzfLcizcKFGS56+yvVhQLSJ/g8sJtIAUqgs7y2Ig0CBtouuzsmU4QDVCl5O+1YRsFOZLY8s95JQUnf87y3Io2ChRkuevssFYUC0if4PLCbSAFK4LO8tiINAgcZ7vs55lOEA1QpeTvtWEbBTmS2PLPeiUFKIDO8tyKNgsUZLjr7LBWFAtIn+Dyv2wgBSuBzvLYiDQIG2i67OebThANU6fk77RhGwU5ktjy0HklBSeAzvLcizYLFGS56+ywVxQKSKDg8r5sIAUrgc7y2IcyBx1ou+zjm04QDlKm5O+0YRsGOpPY8s95JQYngM/y3Is2ChRjuevssVcUC0if4PK/ax8GK4HO8tiIMwgcZ7vr6JpNEQ5SpuTvtGEbBTuU2PLPeSUGKIDO8tyLNQoUY7rr67BXFApIn+Dyv20fBSyBzvLZhzIHHGe76+iaThANUqbk77NhGwU7k9jy0HklBSh/zvLcizcKE2O46+uxVxQKSJ/h8r5sIQUsgs7y2IczBhtmu+vomE4RDUSX5O+2YBsGOpPX8tB5JQUnfs7y3Io2ChNjuOvqsFcVC0ef4fK+bCEELYPO8tiHMgcbZrvr6JhNEQxEm+TvtmEbBTqT2PLQeCUFJ37O8tyKNgoTY7jr6rBWFAtHn+Hyv2wgBSuDzvLYhzMHHGi76+eZThEMQ5nk77RhGwY6k9jy0HkmBSh+zvLcizcKE2O46+qwVxQKSJ/g8sBsIAUsgs7y2IcyBxxou+vom04RDUKa5O+2YRsFOpPY8s96JgYnfs7y24s2ChRjuevrsVYUCkie4PK+bCAFKoLO8tiHMgcdaLvr5ppNEQ1CmuTwtmEaBTmU2PLPeSUGJ37O8tuKNgsUY7nr7LFWFApJn+DyvmwgBSqCzvLYhzMHHWi76+aaTRANQprk77VgGwU5lNjyz3kl');
    audio.play().catch(() => {});
    
    setCompletionMessage(completionMessages[Math.floor(Math.random() * completionMessages.length)]);
    setShowCompletion(true);

    if (mode && sessionType === 'focus') {
      setSessionType('break');
      setMinutes(focusModes[mode].break);
      setSeconds(0);
    } else if (mode) {
      setSessionType('focus');
      setMinutes(focusModes[mode].focus);
      setSeconds(0);
    }

    setTimeout(() => setShowCompletion(false), 5000);
  };

  const selectMode = (selectedMode: FocusMode) => {
    setMode(selectedMode);
    setSessionType('focus');
    if (selectedMode === 'custom') {
      setMinutes(customHours * 60 + customMinutes);
      setSeconds(customSeconds);
    } else {
      setMinutes(focusModes[selectedMode].focus);
      setSeconds(0);
    }
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSessionType('focus');
    if (mode === 'custom') {
      setMinutes(customHours * 60 + customMinutes);
      setSeconds(customSeconds);
    } else if (mode) {
      setMinutes(focusModes[mode].focus);
      setSeconds(0);
    }
    setShowCompletion(false);
  };

  const formatTime = (mins: number, secs: number) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!mode) return 0;
    const totalSeconds = sessionType === 'focus' 
      ? (mode === 'custom' ? (customHours * 3600 + customMinutes * 60 + customSeconds) : focusModes[mode].focus * 60)
      : focusModes[mode].break * 60;
    const currentSeconds = minutes * 60 + seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  if (!mode) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
        <Navbar />
        <main className="flex-1 py-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),rgba(251,146,60,0.1),rgba(251,113,133,0.1))]"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-warm-yellow/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-warm-pink/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Transition animation="fade-in">
              <div className="max-w-4xl mx-auto">
                <div className="mb-4">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark">
                    Mode Focus 🎯
                  </h1>
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="mb-6 sm:mb-8 bg-white/80 hover:bg-white border-gray-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux rubriques
                </Button>

                <p className="text-center text-text-medium text-base sm:text-lg mb-6 sm:mb-8 px-4">
                  Choisissez votre mode de concentration
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                  {(Object.keys(focusModes) as FocusMode[]).map((modeKey, index) => {
                    const modeData = focusModes[modeKey];
                    const Icon = modeData.icon;
                    return (
                      <Transition key={modeKey} animation="fade-in" delay={index * 100}>
                        <Card
                          onClick={() => modeKey !== 'custom' && selectMode(modeKey)}
                          className="relative group cursor-pointer overflow-hidden border-0 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(251,146,60,0.3)] hover:scale-[1.02] bg-white/80 backdrop-blur-sm"
                        >
                          <div className={`absolute inset-0 bg-gradient-to-br ${modeData.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`}></div>
                          
                          <div className="relative p-6 sm:p-8 md:p-10 text-center">
                            <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${modeData.gradient} mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-all duration-500`}>
                              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
                            </div>
                            
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-text-dark transition-colors duration-500">
                              {modeData.name}
                            </h3>
                            
                            {modeKey === 'custom' ? (
                              <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
                                <p className="text-sm sm:text-base text-text-medium transition-colors duration-500">Durée personnalisée</p>
                                <div className="flex items-center justify-center gap-2 sm:gap-3">
                                  <div className="flex flex-col items-center">
                                    <input
                                      type="number"
                                      min="0"
                                      max="23"
                                      value={customHours}
                                      onChange={(e) => setCustomHours(Number(e.target.value))}
                                      className="w-14 sm:w-20 px-2 sm:px-3 py-2 border-2 border-gray-200 rounded-lg text-center font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-warm-orange focus:border-transparent transition-all"
                                    />
                                    <span className="text-xs text-text-medium mt-1">heures</span>
                                  </div>
                                  <span className="text-xl sm:text-2xl font-bold text-text-medium">:</span>
                                  <div className="flex flex-col items-center">
                                    <input
                                      type="number"
                                      min="0"
                                      max="59"
                                      value={customMinutes}
                                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                                      className="w-14 sm:w-20 px-2 sm:px-3 py-2 border-2 border-gray-200 rounded-lg text-center font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-warm-orange focus:border-transparent transition-all"
                                    />
                                    <span className="text-xs text-text-medium mt-1">minutes</span>
                                  </div>
                                  <span className="text-xl sm:text-2xl font-bold text-text-medium">:</span>
                                  <div className="flex flex-col items-center">
                                    <input
                                      type="number"
                                      min="0"
                                      max="59"
                                      value={customSeconds}
                                      onChange={(e) => setCustomSeconds(Number(e.target.value))}
                                      className="w-14 sm:w-20 px-2 sm:px-3 py-2 border-2 border-gray-200 rounded-lg text-center font-semibold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-warm-orange focus:border-transparent transition-all"
                                    />
                                    <span className="text-xs text-text-medium mt-1">secondes</span>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => selectMode('custom')}
                                  className="mt-4 w-full sm:w-auto bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink hover:shadow-lg"
                                >
                                  Démarrer
                                </Button>
                              </div>
                            ) : (
                              <p className="text-base sm:text-lg text-text-medium transition-colors duration-500 font-medium">
                                {modeData.focus} min focus • {modeData.break} min pause
                              </p>
                            )}
                          </div>
                        </Card>
                      </Transition>
                    );
                  })}
                </div>
              </div>
            </Transition>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-pink-50">
      <Navbar />
      <main className="flex-1 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),rgba(251,146,60,0.1),rgba(251,113,133,0.1))]"></div>
        
        {isActive && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-warm-orange/20 rounded-full blur-3xl animate-pulse"></div>
        )}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Transition animation="fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-dark">
                  {focusModes[mode].name} 🎯
                </h1>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/80 hover:bg-white border-gray-200 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour aux rubriques
                </Button>
                <Button
                  onClick={() => setMode(null)}
                  className="bg-white/80 hover:bg-white shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 text-text-dark w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Changer de mode
                </Button>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                <div className={`inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full backdrop-blur-md border-2 shadow-lg transition-all duration-500 ${
                  sessionType === 'focus'
                    ? 'bg-warm-yellow/80 border-warm-orange/50 text-text-dark'
                    : 'bg-green-100/80 border-green-300/50 text-green-700'
                }`}>
                  <span className="text-sm sm:text-base md:text-lg font-semibold">
                    {sessionType === 'focus' ? '🧘‍♂️ Session de concentration' : '☕ Pause bien méritée'}
                  </span>
                </div>
              </div>

              {showCompletion && (
                <Transition animation="scale-in">
                  <div className="mb-6 sm:mb-8 bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink p-4 sm:p-6 rounded-2xl text-center text-white shadow-2xl animate-pulse">
                    <p className="text-lg sm:text-xl md:text-2xl font-bold">{completionMessage}</p>
                  </div>
                </Transition>
              )}

              <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(251,146,60,0.15)] p-6 sm:p-8 md:p-12 mb-6 sm:mb-8 border border-white/40">
                <div className="text-center">
                  <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto mb-6 sm:mb-8 md:mb-10">
                    <div className={`absolute inset-0 rounded-full ${isActive ? 'animate-pulse' : ''}`} style={{
                      background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)',
                    }}></div>

                    <svg
                      viewBox="0 0 200 200"
                      className="w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto -rotate-90"
                    >
                      {/* Cercle de fond */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        stroke="currentColor"
                        strokeWidth="10"
                        fill="transparent"
                        className="text-gray-200"
                      />

                      {/* Cercle de progression */}
                      <circle
                        cx="100"
                        cy="100"
                        r="90"
                        stroke="url(#gradient)"
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 90}
                        strokeDashoffset={
                          2 * Math.PI * 90 * (1 - getProgress() / 100)
                        }
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />

                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="hsl(var(--warm-yellow))" />
                          <stop offset="50%" stopColor="hsl(var(--warm-orange))" />
                          <stop offset="100%" stopColor="hsl(var(--warm-pink))" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-br from-warm-yellow via-warm-orange to-warm-pink bg-clip-text text-transparent tracking-tight font-mono">
                        {formatTime(minutes, seconds)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                    <Button
                      size="lg"
                      onClick={toggleTimer}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-full shadow-xl bg-gradient-to-br from-warm-yellow via-warm-orange to-warm-pink hover:shadow-2xl transition-all duration-300 hover:scale-110 border-4 border-white"
                    >
                      {isActive ? (
                        <Pause className="h-8 w-8 sm:h-10 sm:w-10 text-white" strokeWidth={3} />
                      ) : (
                        <Play className="h-8 w-8 sm:h-10 sm:w-10 text-white ml-1" strokeWidth={3} />
                      )}
                    </Button>
                    <Button
                      size="lg"
                      onClick={resetTimer}
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 border-2 border-warm-orange/30"
                    >
                      <RotateCcw className="h-6 w-6 sm:h-7 sm:w-7 text-warm-orange" strokeWidth={2.5} />
                    </Button>
                  </div>

                  {isActive && currentQuote && (
                    <Transition animation="fade-in">
                      <div className="bg-gradient-to-r from-warm-yellow/20 via-warm-orange/20 to-warm-pink/20 rounded-2xl p-4 sm:p-6 border border-warm-orange/30 shadow-lg backdrop-blur-sm">
                        <p className="text-text-dark text-base sm:text-lg font-medium text-center">{currentQuote}</p>
                      </div>
                    </Transition>
                  )}
                </div>
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 sm:p-6 md:p-8 border border-white/40 shadow-lg">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-text-dark flex items-center gap-2">
                  💡 Conseils pour une session efficace
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-text-medium text-sm sm:text-base">
                  <li className="flex items-start group">
                    <span className="text-warm-orange font-bold mr-2 sm:mr-3 group-hover:scale-125 transition-transform">•</span>
                    <span className="group-hover:text-text-dark transition-colors">Éliminez toutes les distractions</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-warm-orange font-bold mr-2 sm:mr-3 group-hover:scale-125 transition-transform">•</span>
                    <span className="group-hover:text-text-dark transition-colors">Concentrez-vous sur une seule tâche</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-warm-orange font-bold mr-2 sm:mr-3 group-hover:scale-125 transition-transform">•</span>
                    <span className="group-hover:text-text-dark transition-colors">Prenez des pauses régulières</span>
                  </li>
                  <li className="flex items-start group">
                    <span className="text-warm-orange font-bold mr-2 sm:mr-3 group-hover:scale-125 transition-transform">•</span>
                    <span className="group-hover:text-text-dark transition-colors">Restez hydraté</span>
                  </li>
                </ul>
              </div>
            </div>
          </Transition>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FocusMode;
