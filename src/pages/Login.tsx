
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur LearnPath AI!",
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = "Une erreur est survenue lors de la connexion";
      
      // Map Firebase error codes to user-friendly messages
      if (error.code === 'auth/invalid-credential') {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = "Aucun compte trouvé avec cet email";
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = "Mot de passe incorrect";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives de connexion. Veuillez réessayer plus tard";
      }
      
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Échec de connexion",
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
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center gradient-text">Connexion</h2>
          
          {error && (
            <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-xs sm:text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 sm:pl-10 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50 text-sm sm:text-base" 
                  placeholder="Entrez votre email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 sm:pl-10 pr-9 sm:pr-10 px-3 py-2 sm:py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-warm-orange/50 text-sm sm:text-base" 
                  placeholder="Entrez votre mot de passe"
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warm-orange focus:ring-warm-orange/50 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-700">
                  Se souvenir de moi
                </label>
              </div>
              <div className="text-xs sm:text-sm">
                <a href="#" className="font-medium text-warm-orange hover:underline">
                  Mot de passe oublié?
                </a>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas de compte?{" "}
              <Link 
                to="/signup" 
                className="text-warm-orange font-medium hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
