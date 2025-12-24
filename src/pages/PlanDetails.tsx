
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Book, ArrowLeft, Download, List } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth, LearningPlan } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import Transition from '@/components/ui/Transition';

const PlanDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { currentUser, getSavedPlans, learningPlans } = useAuth();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [parsedPlan, setParsedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Fonction pour nettoyer et traiter le contenu du plan
  const cleanPlanContent = (content: string) => {
    // Suppression des entêtes génériques qui pourraient contenir [Nom de l'élève]
    let cleanedContent = content.replace(/##?\s*Plan d['']apprentissage.*?\[Nom de l['']élève\].*?(\n|$)/gi, '');
    
    // Nettoyage des caractères d'échappement et formatage
    cleanedContent = cleanedContent
      .replace(/\\n/g, '\n')
      .replace(/\\"/g, '"')
      .replace(/\\\//g, '/')
      .trim();
    
    return cleanedContent;
  };

  // Fonction pour traiter le plan généré
  const processPlan = (generatedPlan: string) => {
    console.log("Contenu brut du plan:", generatedPlan);
    
    if (!generatedPlan) {
      console.log("Aucun plan généré trouvé");
      return '';
    }

    try {
      // Vérifier si c'est du JSON
      if (typeof generatedPlan === 'string' && 
          (generatedPlan.trim().startsWith('{') || generatedPlan.trim().startsWith('['))) {
        try {
          const jsonContent = JSON.parse(generatedPlan);
          console.log("Contenu JSON parsé:", jsonContent);
          
          // Extraire le contenu du plan selon différents formats possibles
          if (jsonContent.plan) {
            return cleanPlanContent(jsonContent.plan);
          } else if (jsonContent.content) {
            return cleanPlanContent(jsonContent.content);
          } else if (jsonContent.text) {
            return cleanPlanContent(jsonContent.text);
          } else if (typeof jsonContent === 'string') {
            return cleanPlanContent(jsonContent);
          } else {
            // Si c'est un objet complexe, le convertir en texte lisible
            const cleanedJson = { ...jsonContent };
            delete cleanedJson.nom;
            delete cleanedJson.matiere;
            delete cleanedJson.userId;
            delete cleanedJson.id;
            delete cleanedJson.createdAt;
            
            if (Object.keys(cleanedJson).length > 0) {
              return JSON.stringify(cleanedJson, null, 2);
            }
          }
        } catch (jsonError) {
          console.log("Erreur parsing JSON, traitement comme texte:", jsonError);
          return cleanPlanContent(generatedPlan);
        }
      } else {
        // Traiter comme du texte brut
        return cleanPlanContent(generatedPlan);
      }
    } catch (error) {
      console.error("Erreur lors du traitement du plan:", error);
      return cleanPlanContent(generatedPlan);
    }
    
    return '';
  };
  
// Effet pour rediriger vers la page de connexion si l'utilisateur n'est pas connecté
useEffect(() => {
  if (!currentUser) {
    navigate('/login');
    return;
  }

  setIsLoading(true);

  // Récupérer le plan sélectionné du localStorage
  const storedPlan = localStorage.getItem('selectedPlan');
  console.log("Plan stocké dans localStorage:", storedPlan);

  let selectedPlan: LearningPlan | null = null;
  if (storedPlan) {
    try {
      selectedPlan = JSON.parse(storedPlan);
      console.log("Plan sélectionné depuis localStorage:", selectedPlan);
    } catch (error) {
      console.error("Erreur lors du parsing du plan stocké:", error);
    }
  }

  // Si un id est présent dans l'URL, s'assurer que c'est le bon plan et récupérer au besoin
  if (id) {
    if (!selectedPlan || selectedPlan.id !== id || !selectedPlan.generatedPlan) {
      // Chercher d'abord dans les plans sauvegardés, puis dans tous les plans
      const fromSaved = getSavedPlans()?.find(p => p.id === id);
      const fromAll = fromSaved || learningPlans.find(p => p.id === id) || null;
      if (fromAll) {
        selectedPlan = fromAll;
        // Mettre à jour le localStorage pour les navigations suivantes
        localStorage.setItem('selectedPlan', JSON.stringify(fromAll));
      }
    }
  }

  if (selectedPlan) {
    setPlan(selectedPlan);
    if (selectedPlan.generatedPlan) {
      const processedPlan = processPlan(selectedPlan.generatedPlan);
      console.log("Plan traité:", processedPlan);
      setParsedPlan(processedPlan);
    } else {
      console.log("Aucun plan généré dans le plan sélectionné");
      setParsedPlan('');
    }
  } else {
    console.log("Aucun plan trouvé, redirection vers saved-plans");
    navigate('/saved-plans');
  }

  setIsLoading(false);
}, [navigate, currentUser, id, getSavedPlans, learningPlans]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!currentUser) {
    return null;
  }

  // Affichage du loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg">Chargement en cours...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si aucun plan n'existe
  if (!plan) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg mb-4">Plan non trouvé</p>
            <Button onClick={() => navigate('/saved-plans')} className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark">
              Retour à mes plans
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Fonction pour télécharger le plan au format PDF
  const handleDownloadPDF = () => {
    // Ici, nous simulons un téléchargement
    toast({
      title: "Téléchargement du PDF",
      description: "Le téléchargement de votre plan d'apprentissage va commencer...",
    });

    // Dans une application réelle, on génèrerait un PDF avec la bibliothèque jsPDF ou similaire
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(parsedPlan || 'Plan non disponible'));
      element.setAttribute('download', `Plan_Apprentissage_${plan.subject}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-16 mt-16">
        <div className="max-w-4xl mx-auto">
          <Transition animation="fade-in">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="bg-warm-yellow/30 p-2 rounded-full mr-3">
                <Book className="h-5 w-5 sm:h-6 sm:w-6 text-warm-orange" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold gradient-text">Détail de votre Plan d'Apprentissage</h2>
            </div>
          </Transition>

          <Transition animation="fade-in" delay={150}>
            <Card className="mb-6 sm:mb-8 shadow-lg border-warm-orange/20">
              <CardHeader className="bg-gradient-to-r from-[#FEF7CD]/30 to-[#FFDEE2]/30 rounded-t-lg p-4 sm:p-6">
                <CardTitle className="text-lg sm:text-xl flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FEC6A1] to-[#FF9A7B]">
                    Plan pour {plan.subject}
                  </span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Créé pour un niveau {plan.schoolLevel === 'primaire' ? 'Primaire' : 
                    plan.schoolLevel === 'college' ? 'Collège' : 
                    plan.schoolLevel === 'lycee' ? 'Lycée' : 'Études supérieures'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-3 sm:p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-medium mb-3 text-warm-orange flex items-center text-sm sm:text-base">
                      <span className="w-1.5 h-4 sm:h-6 bg-warm-orange rounded-full mr-2"></span>
                      Informations de base
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">
                        Âge: <span className="font-medium text-text-dark">{plan.age} ans</span>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">
                        Moyenne: <span className="font-medium text-text-dark">{plan.averageGrade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-medium mb-3 text-warm-orange flex items-center text-sm sm:text-base">
                      <span className="w-1.5 h-4 sm:h-6 bg-warm-orange rounded-full mr-2"></span>
                      Difficultés d'apprentissage
                    </h3>
                    <p className="text-gray-700 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">{plan.learningDifficulties}</p>
                  </div>
                  
                  <div className="p-3 sm:p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-medium mb-3 text-warm-orange flex items-center text-sm sm:text-base">
                      <span className="w-1.5 h-4 sm:h-6 bg-warm-orange rounded-full mr-2"></span>
                      Demandes spécifiques
                    </h3>
                    <p className="text-gray-700 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">{plan.specificRequests}</p>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 pt-4 border-t border-dashed border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold mb-4 gradient-text">Plan d'apprentissage généré</h3>
                    {parsedPlan ? (
                      <div className="markdown-content p-4 sm:p-6 bg-white rounded-lg border border-gray-100 shadow-sm">
                        <ReactMarkdown className="prose prose-sm sm:prose max-w-none text-sm sm:text-base">
                          {parsedPlan}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 text-center">
                        <p className="text-sm sm:text-base mb-4">Le contenu du plan n'est pas disponible.</p>
                        <Button 
                          onClick={() => navigate('/saved-plans')} 
                          className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark text-sm sm:text-base"
                        >
                          Retour à mes plans
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Transition>

          <Transition animation="fade-in" delay={300}>
            {/* Disposition mobile optimisée pour les boutons d'action */}
            <div className="space-y-3 sm:space-y-4">
              {/* Ligne 1: Boutons de navigation principaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  onClick={() => navigate('/saved-plans')} 
                  variant="outline"
                  className="flex items-center justify-center h-11 sm:h-12 w-full text-sm sm:text-base"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour à mes plans
                </Button>
                
                <Button 
                  onClick={() => navigate('/learning-plan')}
                  className="flex items-center justify-center h-11 sm:h-12 w-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md transition-all duration-200 text-sm sm:text-base"
                >
                  <Book className="mr-2 h-4 w-4" />
                  Nouveau plan
                </Button>
              </div>
              
              {/* Ligne 2: Bouton de téléchargement centré */}
              <div className="flex justify-center">
                <Button 
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center h-11 sm:h-12 w-full sm:w-auto sm:px-8 hover:bg-blue-600 hover:shadow-md transition-all duration-200 text-sm sm:text-base"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger en PDF
                </Button>
              </div>
            </div>
          </Transition>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PlanDetails;
