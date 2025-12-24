
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas",
      });
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({
        title: "Compte créé avec succès",
        description: "Bienvenue sur LearnPath AI!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Une erreur est survenue lors de l'inscription";
      
      // Map Firebase error codes to user-friendly messages
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Cet email est déjà utilisé";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Format d'email invalide";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Le mot de passe doit contenir au moins 6 caractères";
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Échec d'inscription",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 sm:px-6 py-12 sm:py-16 mt-16">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center gradient-text">Créez Votre Compte</h2>
          
          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Nom Complet</label>
              <input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50 text-sm sm:text-base" 
                placeholder="Entrez votre nom complet"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                id="email" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50 text-sm sm:text-base" 
                placeholder="Entrez votre email"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50 text-sm sm:text-base" 
                placeholder="Créez un mot de passe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="passwordConfirm" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Confirmer le Mot de passe</label>
              <input 
                id="passwordConfirm" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50 text-sm sm:text-base" 
                placeholder="Confirmez votre mot de passe"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Inscription en cours..." : "S'inscrire"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <button 
                onClick={() => navigate('/login')} 
                className="text-warm-orange font-medium hover:underline"
              >
                Connexion
              </button>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Signup;
