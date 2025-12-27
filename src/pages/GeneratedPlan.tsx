import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Download, ArrowLeft, FileText, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast } from "sonner";
import Transition from '@/components/ui/Transition';

const GeneratedPlan = () => {
  const navigate = useNavigate();
  const { toast: toastHook } = useToast();
  const { getCurrentPlan, saveCurrentPlan, currentUser } = useAuth();
  const [parsedPlan, setParsedPlan] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);
  
  // Vérification de l'authentification
  useEffect(() => {
    if (!currentUser) {
      toast.error("Veuillez vous connecter pour accéder à vos plans d'apprentissage");
      navigate('/login');
    }
  }, [currentUser, navigate]);
  
  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!currentUser) {
    return null;
  }
  
  const currentPlan = getCurrentPlan();

  useEffect(() => {
    if (currentPlan?.generatedPlan) {
      try {
        // Essayer de parser le contenu comme du JSON si c'est une chaîne JSON
        if (typeof currentPlan.generatedPlan === 'string' && 
            (currentPlan.generatedPlan.startsWith('{') || currentPlan.generatedPlan.startsWith('['))) {
          try {
            const jsonContent = JSON.parse(currentPlan.generatedPlan);
            // Si c'est un objet JSON avec un champ contenant le texte du plan
            if (jsonContent.plan || jsonContent.content || jsonContent.text) {
              // Nettoyer le plan en supprimant les entêtes du type "Plan d'apprentissage pour [Nom de l'élève]"
              let planText = jsonContent.plan || jsonContent.content || jsonContent.text;
              
              // Suppression des entêtes génériques qui pourraient contenir [Nom de l'élève]
              planText = planText.replace(/##?\s*Plan d['']apprentissage.*?\[Nom de l['']élève\].*?(\n|$)/gi, '');
              setParsedPlan(planText.trim());
            } else {
              // Pour les autres formats JSON, on extrait uniquement les données pertinentes
              // et on supprime les métadonnées comme "nom", "matiere", etc.
              const cleanedJson = { ...jsonContent };
              delete cleanedJson.nom;
              delete cleanedJson.matiere;
              
              // Si après suppression il reste un champ "plan", l'utiliser directement
              if (cleanedJson.plan) {
                setParsedPlan(cleanedJson.plan);
              } else {
                // Sinon utiliser le JSON restant formaté proprement
                setParsedPlan(JSON.stringify(cleanedJson, null, 2));
              }
            }
          } catch (e) {
            // Si ce n'est pas un JSON valide, on utilise directement la chaîne
            // mais on nettoie quand même les entêtes génériques
            let planText = currentPlan.generatedPlan;
            planText = planText.replace(/##?\s*Plan d['']apprentissage.*?\[Nom de l['']élève\].*?(\n|$)/gi, '');
            setParsedPlan(planText.trim());
          }
        } else {
          // Si ce n'est pas un format JSON, nettoyer directement la chaîne
          let planText = currentPlan.generatedPlan;
          planText = planText.replace(/##?\s*Plan d['']apprentissage.*?\[Nom de l['']élève\].*?(\n|$)/gi, '');
          setParsedPlan(planText.trim());
        }
      } catch (error) {
        console.error("Erreur lors du traitement du plan:", error);
        // En cas d'erreur, utiliser le plan brut mais quand même nettoyer
        let planText = currentPlan.generatedPlan || '';
        planText = planText.replace(/##?\s*Plan d['']apprentissage.*?\[Nom de l['']élève\].*?(\n|$)/gi, '');
        setParsedPlan(planText.trim());
      }
    }
  }, [currentPlan]);

  // Si aucun plan n'existe, rediriger vers la création de plan
  useEffect(() => {
    if (!currentPlan) {
      navigate('/learning-plan');
    }
  }, [currentPlan, navigate]);

  if (!currentPlan) {
    return null;
  }

  // Fonction pour télécharger le plan au format PDF
  const handleDownloadPDF = () => {
    // Ici, nous simulons un téléchargement
    toastHook({
      title: "Téléchargement du PDF",
      description: "Le téléchargement de votre plan d'apprentissage va commencer...",
    });

    // Dans une application réelle, on génèrerait un PDF avec la bibliothèque jsPDF ou similaire
    setTimeout(() => {
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(parsedPlan || 'Plan non disponible'));
      element.setAttribute('download', `Plan_Apprentissage_${currentPlan.subject}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };

  // Fonction pour sauvegarder le plan
  const handleSavePlan = () => {
    // Vérifier si l'utilisateur est connecté
    if (!currentUser) {
      toastHook({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour sauvegarder ce plan",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Sauvegarder le plan
    saveCurrentPlan();
    setIsSaved(true);
    
    toast.success("Votre plan a été sauvegardé avec succès!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-16 mt-16">
        <div className="max-w-4xl mx-auto">
          <Transition animation="fade-in">
            <div className="flex items-center mb-6 sm:mb-8">
              <div className="bg-warm-yellow/30 p-1.5 sm:p-2 rounded-full mr-2 sm:mr-3">
                <Book className="h-5 w-5 sm:h-6 sm:w-6 text-warm-orange" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold gradient-text">Votre Plan d'Apprentissage Personnalisé</h2>
            </div>
          </Transition>

          <Transition animation="fade-in" delay={150}>
            <Card className="mb-6 sm:mb-8 shadow-lg border-warm-orange/20">
              <CardHeader className="bg-gradient-to-r from-[#FEF7CD]/30 to-[#FFDEE2]/30 rounded-t-lg p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg md:text-xl flex items-center">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FEC6A1] to-[#FF9A7B]">
                    Plan pour {currentPlan.subject}
                  </span>
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Créé pour un niveau {currentPlan.schoolLevel === 'primaire' ? 'Primaire' : 
                    currentPlan.schoolLevel === 'college' ? 'Collège' : 
                    currentPlan.schoolLevel === 'lycee' ? 'Lycée' : 'Études supérieures'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-3 sm:p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-warm-orange flex items-center">
                      <span className="w-1.5 h-4 sm:h-6 bg-warm-orange rounded-full mr-2"></span>
                      Informations de base
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">
                        Âge: <span className="font-medium text-text-dark">{currentPlan.age} ans</span>
                      </div>
                      <div className="bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">
                        Moyenne: <span className="font-medium text-text-dark">{currentPlan.averageGrade}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 sm:p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-warm-orange flex items-center">
                      <span className="w-1.5 h-4 sm:h-6 bg-warm-orange rounded-full mr-2"></span>
                      Difficultés d'apprentissage
                    </h3>
                    <p className="text-gray-700 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">{currentPlan.learningDifficulties}</p>
                  </div>
                  
                  <div className="p-3 sm:p-5 bg-gray-50/80 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base text-warm-orange flex items-center">
                      <span className="w-1.5 h-4 sm:h-6 bg-warm-orange rounded-full mr-2"></span>
                      Demandes spécifiques
                    </h3>
                    <p className="text-gray-700 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">{currentPlan.specificRequests}</p>
                  </div>
                  
                  <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-dashed border-gray-200">
                    <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4 gradient-text">Plan d'apprentissage généré</h3>
                    {parsedPlan ? (
                      <div className="markdown-content p-3 sm:p-4 md:p-6 bg-white rounded-lg border border-gray-100 shadow-sm text-sm sm:text-base">
                        <ReactMarkdown 
                          className="prose prose-sm sm:prose max-w-none"
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {parsedPlan}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 text-center text-sm sm:text-base">
                        <p>Le plan n'a pas pu être généré. Veuillez réessayer.</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Transition>

          <Transition animation="fade-in" delay={300}>
            {/* Disposition mobile améliorée pour les boutons d'action */}
            <div className="space-y-3 sm:space-y-4">
              {/* Ligne 1: Boutons de navigation principaux */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Button 
                  onClick={() => navigate('/learning-plan')} 
                  variant="outline"
                  className="flex items-center justify-center h-11 sm:h-12 w-full text-sm sm:text-base"
                >
                  <ArrowLeft className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Retour au questionnaire
                </Button>
                
                <Button 
                  onClick={() => navigate('/learning-plan')}
                  className="flex items-center justify-center h-11 sm:h-12 w-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md transition-all duration-200 text-sm sm:text-base"
                >
                  <FileText className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Nouveau plan
                </Button>
              </div>
              
              {/* Ligne 2: Boutons d'action sur le plan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                <Button 
                  onClick={handleSavePlan}
                  disabled={isSaved}
                  className={`flex items-center justify-center h-11 sm:h-12 w-full transition-all duration-200 text-sm sm:text-base ${isSaved ? 'bg-green-500 text-white' : 'bg-warm-orange text-white hover:shadow-md'}`}
                >
                  <Save className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {isSaved ? 'Plan sauvegardé' : 'Sauvegarder'}
                </Button>
                
                <Button 
                  onClick={handleDownloadPDF}
                  className="flex items-center justify-center h-11 sm:h-12 w-full hover:bg-blue-600 hover:shadow-md transition-all duration-200 text-sm sm:text-base"
                >
                  <Download className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Télécharger PDF
                </Button>
              </div>
            </div>
          </Transition>

          {/* Lien vers les plans sauvegardés */}
          {currentUser && (
            <Transition animation="fade-in" delay={450}>
              <div className="mt-4 sm:mt-6 text-center">
                <Button 
                  onClick={() => navigate('/saved-plans')}
                  variant="ghost"
                  className="text-warm-orange hover:bg-warm-orange/10 transition-all duration-200 h-11 sm:h-12 w-full sm:w-auto text-sm sm:text-base"
                >
                  <Book className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Voir tous mes plans sauvegardés
                </Button>
              </div>
            </Transition>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default GeneratedPlan;
