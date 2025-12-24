import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft, Trash2 } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth, LearningPlan } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const SavedPlans = () => {
  const navigate = useNavigate();
  const { getSavedPlans, currentUser, deleteSavedPlan } = useAuth();
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Effet pour rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!currentUser) {
    return null;
  }

  const savedPlans = getSavedPlans();

  // Fonction pour ouvrir la boîte de dialogue de confirmation
  const handleDeleteClick = (planId: string) => {
    setPlanToDelete(planId);
    setIsDialogOpen(true);
  };

  // Fonction pour confirmer la suppression
  const confirmDelete = () => {
    if (planToDelete) {
      deleteSavedPlan(planToDelete);
      setIsDialogOpen(false);
      setPlanToDelete(null);
      
      // Modifier le type de variant pour utiliser 'default' au lieu de 'success'
      toast({
        title: "Plan supprimé",
        description: "Votre plan d'apprentissage a été supprimé avec succès.",
        variant: "default"
      });
    }
  };

  // Si aucun plan n'est sauvegardé
  if (savedPlans.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 mt-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-8">
              <Book className="h-6 w-6 text-warm-orange mr-2" />
              <h2 className="text-2xl font-bold gradient-text">Mes Plans Sauvegardés</h2>
            </div>

            <Card className="mb-8 shadow-lg">
              <CardContent className="p-8">
                <p className="text-lg mb-4">Vous n'avez pas encore de plans sauvegardés.</p>
                <Button 
                  onClick={() => navigate('/learning-plan')}
                  className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark"
                >
                  Créer votre premier plan
                </Button>
              </CardContent>
            </Card>

            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleViewPlan = (plan: LearningPlan) => {
    // Stockage temporaire du plan sélectionné pour l'afficher
    localStorage.setItem('selectedPlan', JSON.stringify(plan));
    navigate(`/plan/${plan.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <Book className="h-6 w-6 text-warm-orange mr-2" />
            <h2 className="text-2xl font-bold gradient-text">Mes Plans Sauvegardés</h2>
          </div>

          <div className="grid gap-6 mb-8">
            {savedPlans.map((plan) => (
              <Card key={plan.id} className="shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink bg-opacity-10">
                  <CardTitle className="text-xl">{plan.subject}</CardTitle>
                  <CardDescription>
                    Créé le {format(new Date(plan.createdAt), 'dd MMMM yyyy', { locale: fr })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>Niveau: <span className="font-medium">{
                      plan.schoolLevel === 'primaire' ? 'Primaire' : 
                      plan.schoolLevel === 'college' ? 'Collège' : 
                      plan.schoolLevel === 'lycee' ? 'Lycée' : 'Études supérieures'
                    }</span></div>
                    <div>Âge: <span className="font-medium">{plan.age} ans</span></div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-between">
                  <Button 
                    onClick={() => handleViewPlan(plan)}
                    className="bg-gradient-to-r from-warm-yellow to-warm-orange text-text-dark"
                  >
                    Voir le plan
                  </Button>
                  <Button
                    variant="outline"
                    className="border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600"
                    onClick={() => handleDeleteClick(plan.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
            
            <Button 
              onClick={() => navigate('/learning-plan')}
              className="flex items-center bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark"
            >
              <Book className="mr-2 h-4 w-4" />
              Créer un nouveau plan
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Boîte de dialogue de confirmation de suppression */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce plan d'apprentissage ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDelete}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
    </div>
  );
};

export default SavedPlans;
