
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Transition from '../components/ui/Transition';
import { useAuth } from '@/contexts/AuthContext';

const PricingPage = () => {
  const navigate = useNavigate();
  const { hasSubscription, setHasSubscription } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState(hasSubscription ? 'active' : 'inactive');
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleSubscribe = (plan: string) => {
    console.log(`Redirection vers Stripe pour le plan ${plan} - ${billingPeriod}`);
    
    if (plan === 'mensuel') {
      window.location.href = 'https://buy.stripe.com/28E8wP2exgKL416fXxdUY00';
    } else if (plan === 'annuel') {
      window.location.href = 'https://buy.stripe.com/28E00jbP7amnbty9z9dUY01';
    }
    
    // Note: The payment confirmation and status update happens in PaymentSuccess.tsx
    // which the user will be redirected to by Stripe after successful payment
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 mt-16">
        <Transition animation="fade-in">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-warm-yellow/50 border border-warm-orange/20">
              <span className="text-sm font-medium text-text-dark">Nos tarifs</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
              Un prix simple pour un 
              <span className="gradient-text"> apprentissage sans limites</span>
            </h1>
            <p className="text-text-medium text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Choisissez la formule qui vous convient et commencez votre voyage d'apprentissage dès aujourd'hui.
            </p>
          </div>
        </Transition>

        <Transition animation="fade-in" delay={150}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly' 
                    ? 'bg-white shadow-sm text-text-dark' 
                    : 'text-text-medium hover:text-text-dark'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'yearly' 
                    ? 'bg-white shadow-sm text-text-dark' 
                    : 'text-text-medium hover:text-text-dark'
                }`}
              >
                Annuel
              </button>
            </div>
          </div>
        </Transition>

        <Transition animation="fade-in" delay={300}>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`rounded-2xl p-8 border ${billingPeriod === 'monthly' ? 'border-warm-orange/50 shadow-lg bg-white' : 'border-gray-200 bg-gray-50'}`}>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-dark mb-2">Abonnement Mensuel</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">5€</span>
                  <span className="text-text-medium ml-1">/mois</span>
                </div>
                <p className="mt-3 text-text-medium">
                  Accédez à toutes les fonctionnalités pour seulement 5€ / mois
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-warm-orange mr-2" />
                  <span>Accès illimité</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-warm-orange mr-2" />
                  <span>Un investissement malin pour ta réussite scolaire</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-warm-orange mr-2" />
                  <span>Support prioritaire</span>
                </div>
              </div>
              
              <Button 
                className={`w-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark ${billingPeriod !== 'monthly' ? 'opacity-70' : ''}`}
                onClick={() => handleSubscribe('mensuel')}
                disabled={billingPeriod !== 'monthly'}
              >
                Commencer maintenant
              </Button>
            </div>
            
            <div className={`rounded-2xl p-8 relative border ${billingPeriod === 'yearly' ? 'border-warm-orange/50 shadow-lg bg-white' : 'border-gray-200 bg-gray-50'}`}>
              {billingPeriod === 'yearly' && (
                <div className="absolute -top-4 right-4 bg-warm-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                  Recommandé
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-text-dark mb-2">Abonnement Annuel</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">50€</span>
                  <span className="text-text-medium ml-1">/an</span>
                </div>
                <p className="mt-3 text-text-medium">
                  Profitez de 2 mois gratuits en payant une seule fois
                </p>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-warm-orange mr-2" />
                  <span>Accès illimité</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-warm-orange mr-2" />
                  <span>2 mois offerts</span>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-warm-orange mr-2" />
                  <span>Support prioritaire</span>
                </div>
              </div>
              
              <Button 
                className={`w-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark ${billingPeriod !== 'yearly' ? 'opacity-70' : ''}`}
                onClick={() => handleSubscribe('annuel')}
                disabled={billingPeriod !== 'yearly'}
              >
                Économisez 10€
              </Button>
            </div>
          </div>
        </Transition>
        
        <Transition animation="fade-in" delay={450}>
          <div className="max-w-lg mx-auto mt-16 p-6 rounded-xl border border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold mb-3 text-center">Statut de votre abonnement</h3>
            <div className="flex items-center justify-center gap-3">
              <div className={`h-3 w-3 rounded-full ${
                subscriptionStatus === 'active' ? 'bg-green-500' : 
                subscriptionStatus === 'pending' ? 'bg-yellow-500 animate-pulse' : 
                'bg-gray-400'
              }`}></div>
              <span className="text-sm font-medium">
                {subscriptionStatus === 'active' ? 'Abonnement actif' : 
                 subscriptionStatus === 'pending' ? 'Traitement en cours...' : 
                 'Aucun abonnement actif'}
              </span>
            </div>
          </div>
        </Transition>
        
        <Transition animation="fade-in" delay={600}>
          <div className="max-w-3xl mx-auto mt-20 text-center">
            <h3 className="text-2xl font-bold mb-4">Des questions ?</h3>
            <p className="text-text-medium mb-6">
              N'hésitez pas à nous contacter à l'adresse suivante : learnpath.ai@gmail.com
            </p>
            <Button 
              variant="outline" 
              className="border-warm-orange/30 text-text-dark"
              onClick={() => window.location.href = 'mailto:learnpath.ai@gmail.com'}
            >
              Contacter le support
            </Button>
          </div>
        </Transition>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;
