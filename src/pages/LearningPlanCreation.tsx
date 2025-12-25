import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Check, ArrowRight, ArrowLeft, FileText, AlertTriangle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Circle, CircleDashed, Gauge } from 'lucide-react';

const LearningPlanCreation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    hasSubscription, 
    saveLearningPlan, 
    getCurrentPlan, 
    hasReachedFreeLimit, 
    getRemainingFreePlans,
    getPlansCount,
    currentUser
  } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const currentPlan = getCurrentPlan();
  const remainingPlans = getRemainingFreePlans();
  const limitReached = hasReachedFreeLimit();
  const plansCount = getPlansCount();
  
  const [formData, setFormData] = useState({
    age: currentPlan?.age || '',
    schoolLevel: currentPlan?.schoolLevel || 'primaire',
    averageGrade: currentPlan?.averageGrade || '',
    learningDifficulties: currentPlan?.learningDifficulties || '',
    subject: currentPlan?.subject || '',
    specificRequests: currentPlan?.specificRequests || ''
  });

  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer un plan d'apprentissage",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }

    if (limitReached && !hasSubscription) {
      toast({
        title: "Limite atteinte",
        description: "Vous avez atteint votre quota de plans gratuits. Veuillez passer à la version premium.",
        variant: "destructive"
      });
    }
  }, [limitReached, hasSubscription, toast, currentUser, navigate]);

  if (!currentUser) {
    return null;
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const goToNextStep = () => {
    if (currentStep === 1 && !formData.age) {
      toast({
        title: "Information manquante",
        description: "Veuillez entrer votre âge",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 2 && !formData.averageGrade) {
      toast({
        title: "Information manquante",
        description: "Veuillez entrer votre moyenne générale",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 3 && !formData.learningDifficulties) {
      toast({
        title: "Information manquante",
        description: "Veuillez indiquer vos difficultés d'apprentissage",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 4 && !formData.subject) {
      toast({
        title: "Information manquante",
        description: "Veuillez indiquer la matière pour laquelle vous souhaitez un plan personnalisé",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 5 && !formData.specificRequests) {
      toast({
        title: "Information manquante",
        description: "Veuillez préciser vos demandes spécifiques pour le plan d'apprentissage",
        variant: "destructive"
      });
      return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Vérifier si l'utilisateur a atteint sa limite de plans gratuits
    if (limitReached && !hasSubscription) {
      toast({
        title: "Limite de plans atteinte",
        description: "Vous avez atteint votre quota de plans gratuits. Veuillez passer à la version premium pour continuer.",
        variant: "destructive"
      });
      navigate('/pricing');
      return;
    }
    
    console.log("Plan d'apprentissage créé:", formData);
    
    try {
      navigate('/loading-plan');

      // Format des données selon le format exact attendu par Make
      const makePayload = {
        nom: "Utilisateur", // Valeur par défaut
        age: formData.age,
        niveau: formData.schoolLevel,
        moyenne: formData.averageGrade,
        difficultes: formData.learningDifficulties,
        matiere: formData.subject,
        demande: formData.specificRequests
      };

      console.log("Payload envoyé à Make:", makePayload);

      // Envoi des données au webhook Make avec des en-têtes appropriés
      const response = await fetch('https://hook.eu2.make.com/qu23ooj3j2ad7rypedtbglkwirvhvptk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(makePayload)
      });

      console.log("Statut de la réponse:", response.status);
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Récupérer le texte brut avant de tenter de parser en JSON
      const responseText = await response.text();
      console.log("Réponse brute:", responseText);
      
      let responseData;
      try {
        // Tenter de parser le JSON
        responseData = JSON.parse(responseText);
        console.log("Réponse du webhook parsée:", responseData);
      } catch (parseError) {
        console.error("Erreur de parsing JSON:", parseError);
        // Si le texte n'est pas un JSON valide, mais contient du texte, on l'utilise directement
        if (responseText && responseText.trim().length > 0) {
          responseData = { plan: responseText };
          console.log("Utilisation de la réponse brute comme plan:", responseData);
        } else {
          throw new Error("Format de réponse invalide");
        }
      }

      // Vérifier si responseData existe et contient un plan
      if (!responseData || (!responseData.plan && typeof responseData !== 'string')) {
        console.error("Réponse du webhook sans plan:", responseData);
        
        // Si responseData est une chaîne, on la considère comme le plan
        if (typeof responseData === 'string') {
          responseData = { plan: responseData };
        } else {
          // Sinon on crée un plan par défaut
          throw new Error("Réponse du webhook sans plan");
        }
      }

      // Si responseData est un string, c'est probablement directement le plan
      const planText = typeof responseData === 'string' ? responseData : 
                      responseData.plan || "Plan par défaut: Nous vous recommandons de suivre un apprentissage progressif adapté à votre niveau et vos difficultés.";
      
      // Sauvegarde locale du plan incluant les données générées par Make
      const enrichedPlan = {
        ...formData,
        generatedPlan: planText
      };
      
      saveLearningPlan(enrichedPlan);
      
      toast({
        title: "Plan d'apprentissage créé!",
        description: `Votre plan d'apprentissage personnalisé en ${formData.subject} a été créé avec succès.`
      });
      
      // Rediriger vers la page du plan généré
      navigate('/generated-plan');

    } catch (error) {
      console.error("Erreur lors de la création du plan:", error);
      
      // Sauvegarde d'un plan par défaut en cas d'erreur
      const defaultPlan = {
        ...formData,
        generatedPlan: "Plan par défaut: Nous n'avons pas pu générer un plan personnalisé en raison d'une erreur technique. Veuillez réessayer ultérieurement."
      };
      
      saveLearningPlan(defaultPlan);
      
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création du plan d'apprentissage",
        variant: "destructive"
      });
      
      // Rediriger vers la page du plan généré avec le plan par défaut
      navigate('/generated-plan');
    }
  };

  if (limitReached && !hasSubscription) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 mt-16">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8">
            <div className="flex items-center mb-8">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h2 className="text-2xl font-bold text-red-500">Limite de plans gratuits atteinte</h2>
            </div>
            
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Vous avez atteint votre limite de plans gratuits</AlertTitle>
              <AlertDescription>
                Votre compte vous permet de créer jusqu'à 15 plans d'apprentissage gratuitement.
                Pour continuer à créer de nouveaux plans, veuillez souscrire à notre abonnement.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                onClick={() => navigate('/pricing')}
                className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark"
              >
                Voir les abonnements
              </Button>
              
              <Button 
                onClick={() => navigate('/saved-plans')}
                variant="outline"
              >
                Voir mes plans sauvegardés
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Quel est votre âge?</h3>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Entrez votre âge"
              min="5"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
            />
            
            <div>
              <h4 className="text-lg font-medium mb-3">Votre niveau scolaire</h4>
              <div className="flex flex-col space-y-2">
                {[
                  { id: 'primaire', label: 'Primaire' },
                  { id: 'college', label: 'Collège' },
                  { id: 'lycee', label: 'Lycée' },
                  { id: 'superieur', label: 'Études supérieures' }
                ].map((level) => (
                  <label key={level.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="schoolLevel"
                      value={level.id}
                      checked={formData.schoolLevel === level.id}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-warm-orange focus:ring-warm-orange/50 border-gray-300"
                    />
                    <span className="text-gray-700">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Quelle est votre moyenne générale?</h3>
            <input
              type="text"
              name="averageGrade"
              value={formData.averageGrade}
              onChange={handleInputChange}
              placeholder="Ex: 14/20, B+, etc."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
            />
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Quelles sont vos difficultés d'apprentissage?</h3>
            <textarea
              name="learningDifficulties"
              value={formData.learningDifficulties}
              onChange={handleInputChange}
              placeholder="Ex: Concentration, compréhension, mémorisation..."
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
            />
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Dans quelle matière souhaitez-vous un plan personnalisé?</h3>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Ex: Mathématiques, Français, Physique..."
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50"
            />
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Avez-vous des demandes spécifiques pour votre plan d'apprentissage?</h3>
            <Textarea
              name="specificRequests"
              value={formData.specificRequests}
              onChange={handleInputChange}
              placeholder="Ex: Je souhaite plus d'exercices pratiques, des explications détaillées sur certains concepts..."
              className="w-full h-32 focus:ring-warm-orange/50"
            />
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-medium">Récapitulatif de votre profil d'apprentissage</h3>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">Âge:</span>
                  <span>{formData.age} ans</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Niveau scolaire:</span>
                  <span className="capitalize">
                    {formData.schoolLevel === 'primaire' ? 'Primaire' : 
                     formData.schoolLevel === 'college' ? 'Collège' : 
                     formData.schoolLevel === 'lycee' ? 'Lycée' : 'Études supérieures'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Moyenne générale:</span>
                  <span>{formData.averageGrade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Difficultés d'apprentissage:</span>
                  <span className="text-right max-w-[60%]">{formData.learningDifficulties}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Matière:</span>
                  <span>{formData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Demandes spécifiques:</span>
                  <span className="text-right max-w-[60%]">{formData.specificRequests}</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
            <div className="flex items-center">
              <Book className="h-5 w-5 sm:h-6 sm:w-6 text-warm-orange mr-2" />
              <h2 className="text-xl sm:text-2xl font-bold gradient-text">Créer Votre Plan d'Apprentissage</h2>
            </div>
            
            {!hasSubscription && (
              <div className="flex items-center space-x-2 bg-gray-50 py-1 px-3 rounded-full border text-sm sm:text-base">
                <Gauge className="h-3 w-3 sm:h-4 sm:w-4 text-warm-orange" />
                <span className="font-medium">
                  {plansCount} / 15 plans utilisés
                </span>
              </div>
            )}
          </div>
          
          {!hasSubscription && remainingPlans < 5 && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertTitle>Quota limité</AlertTitle>
              <AlertDescription>
                Il vous reste {remainingPlans} plan{remainingPlans > 1 ? 's' : ''} gratuit{remainingPlans > 1 ? 's' : ''} disponible{remainingPlans > 1 ? 's' : ''}.
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-warm-orange"
                  onClick={() => navigate('/pricing')}
                >
                  Passer à la version premium
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] h-2 rounded-full" 
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div 
                key={step} 
                className={`flex items-center justify-center rounded-full h-8 w-8 ${
                  step <= currentStep 
                    ? 'bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step < currentStep ? <Check className="h-5 w-5" /> : step}
              </div>
            ))}
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStepContent()}
            
            <div className="flex justify-between pt-4">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={goToPreviousStep}
                  className="flex items-center"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Précédent
                </Button>
              ) : (
                <div></div> // Placeholder for flex layout
              )}
              
              {currentStep < 6 ? (
                <Button 
                  type="button"
                  onClick={goToNextStep} 
                  className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90 flex items-center"
                >
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90"
                  disabled={limitReached && !hasSubscription}
                >
                  Créer mon plan
                </Button>
              )}
            </div>
          </form>

          {!hasSubscription && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Utilisation du quota gratuit</h4>
                <span className="text-sm text-muted-foreground">{plansCount} / 15</span>
              </div>
              
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2]" 
                  style={{ width: `${(plansCount / 15) * 100}%` }}
                ></div>
              </div>
              
              {plansCount > 0 && plansCount < 15 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {remainingPlans} plan{remainingPlans > 1 ? 's' : ''} restant{remainingPlans > 1 ? 's' : ''}
                </p>
              )}
              
              {plansCount === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Vous n'avez pas encore créé de plan d'apprentissage
                </p>
              )}
            </div>
          )}

          {currentPlan && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Votre plan d'apprentissage actuel</h3>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => navigate('/learning-plan')}
                  className="flex items-center bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Créer un nouveau plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearningPlanCreation;
