
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";
import { CheckCircle, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { setHasSubscription, getRemainingFreePlans, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!currentUser) {
      toast.error("Vous devez être connecté pour accéder à cette page");
      navigate('/login');
      return;
    }

    // Simuler la vérification du paiement
    const timer = setTimeout(() => {
      // Mettre à jour le statut de l'abonnement pour l'utilisateur connecté
      setHasSubscription(true);
      
      // Afficher un message de succès
      toast.success("Votre abonnement a été activé avec succès !");
      
      // Rediriger vers la page de création de plan d'apprentissage après un court délai
      const redirectTimer = setTimeout(() => {
        navigate('/learning-plan');
      }, 2000);
      
      setLoading(false);
      
      return () => clearTimeout(redirectTimer);
    }, 2000); // 2 secondes de chargement pour une meilleure expérience utilisateur

    return () => clearTimeout(timer);
  }, [navigate, setHasSubscription, currentUser]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher pendant la redirection
  if (!currentUser) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary">Paiement confirmé !</h1>
          
          {loading ? (
            <div className="mt-6 space-y-4">
              <div className="w-12 h-12 mx-auto border-4 border-t-primary rounded-full animate-spin"></div>
              <p className="text-sm text-muted-foreground">Activation de votre abonnement...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-green-700">Abonnement activé avec succès</h2>
                <p className="text-sm text-muted-foreground">
                  Vous avez maintenant accès à un nombre illimité de plans d'apprentissage.
                </p>
                
                <div className="flex justify-center mt-4">
                  <div className="flex items-center space-x-2 bg-green-50 py-2 px-4 rounded-full border border-green-200">
                    <Gauge className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Plans illimités</span>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/learning-plan')}
                className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark"
              >
                Créer un plan d'apprentissage
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
