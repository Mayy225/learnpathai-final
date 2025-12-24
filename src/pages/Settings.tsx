import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, CreditCard, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Settings = () => {
  const { currentUser, hasSubscription } = useAuth();
  const navigate = useNavigate();

  const handleCancelSubscription = () => {
    window.open('https://billing.stripe.com/p/login/test_28E8wP2exgKL416fXxdUY00', '_blank');
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-yellow/20 via-warm-orange/20 to-warm-pink/20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au tableau de bord
        </Button>

        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
              Paramètres du compte
            </h1>
            <p className="text-text-medium">
              Gérez vos informations personnelles et votre abonnement
            </p>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-warm-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-warm-orange" />
                Informations du compte
              </CardTitle>
              <CardDescription>
                Vos informations de connexion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warm-yellow/10">
                <Mail className="h-5 w-5 text-warm-orange" />
                <div>
                  <p className="text-sm text-text-medium">Email</p>
                  <p className="font-medium text-text-dark">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-lg bg-warm-yellow/10">
                <Calendar className="h-5 w-5 text-warm-orange" />
                <div>
                  <p className="text-sm text-text-medium">Membre depuis</p>
                  <p className="font-medium text-text-dark">
                    {currentUser.metadata?.creationTime 
                      ? new Date(currentUser.metadata.creationTime).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'Date non disponible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-warm-orange/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-warm-orange" />
                Abonnement
              </CardTitle>
              <CardDescription>
                Gérez votre abonnement et votre facturation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-warm-yellow/20 to-warm-orange/20">
                <div>
                  <p className="font-semibold text-text-dark text-lg">
                    {hasSubscription ? 'Plan Premium' : 'Plan Gratuit'}
                  </p>
                  <p className="text-sm text-text-medium">
                    {hasSubscription 
                      ? 'Accès illimité à toutes les fonctionnalités' 
                      : 'Limité à 5 plans d\'apprentissage'}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-full ${
                  hasSubscription 
                    ? 'bg-gradient-to-r from-warm-orange to-warm-pink text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  <span className="font-semibold text-sm">
                    {hasSubscription ? 'Actif' : 'Gratuit'}
                  </span>
                </div>
              </div>

              <Separator />
              
              {hasSubscription ? (
                <div className="space-y-3">
                  <p className="text-sm text-text-medium">
                    Gérez votre abonnement, mettez à jour vos informations de paiement ou annulez votre abonnement via le portail de facturation.
                  </p>
                  <Button
                    onClick={handleCancelSubscription}
                    variant="outline"
                    className="w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50"
                  >
                    Résilier mon abonnement
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-text-medium">
                    Vous ne souscrivez à aucun abonnement actuellement.
                  </p>
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="w-full sm:w-auto bg-gradient-to-r from-warm-yellow via-warm-orange to-warm-pink text-text-dark hover:opacity-90"
                  >
                    Passer au Premium
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
