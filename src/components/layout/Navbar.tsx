import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Menu, X, User, BookmarkCheck, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      // Effectuer la déconnexion sans rien supprimer du localStorage
      await signOut(auth);
      
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt sur LearnPath AI!",
      });
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Un problème est survenu lors de la déconnexion",
      });
    }
  };

  const navLinks = [
    { name: "Fonctionnalités", href: "#features" },
    { name: "Comment ça marche", href: "#how-it-works" },
    { name: "Tarifs", href: "/pricing" },
    { name: "À propos", href: "/about" },
    // Ajout du lien vers les plans sauvegardés, visible uniquement pour les utilisateurs connectés
    ...(currentUser ? [{ name: "Mes plans sauvegardés", href: "/saved-plans" }] : [])
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'backdrop-blur-element py-3 shadow-sm' : 'py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl gradient-text">LearnPath AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-text-medium hover:text-text-dark transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {currentUser ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/LearningPlanCreation')}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Mon Plan
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                Paramètres
              </Button>
              <Button 
                size="default"
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90"
              >
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/login')}
                className={location.pathname === '/login' ? "text-warm-orange" : ""}
              >
                Connexion
              </Button>
              <Button 
                size="default"
                onClick={() => navigate('/signup')}
                className={`bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90 ${
                  location.pathname === '/signup' ? "ring-2 ring-warm-orange/50" : ""
                }`}
              >
                Inscription
              </Button>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden flex items-center"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-text-medium" />
          ) : (
            <Menu className="h-6 w-6 text-text-medium" />
          )}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background z-40 p-4 animate-fade-in">
          <nav className="flex flex-col space-y-4 mt-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-base py-2 border-b border-gray-100 font-medium text-text-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col space-y-3 pt-4">
              {currentUser ? (
                <>
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/learning-plan');
                    }}
                    className="flex items-center justify-start gap-2"
                  >
                    <User className="h-4 w-4" />
                    Mon Plan
                  </Button>
                  
                  {/* Ajout du bouton pour les plans sauvegardés dans le menu mobile */}
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/saved-plans');
                    }}
                    className="flex items-center justify-start gap-2"
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    Mes Plans Sauvegardés
                  </Button>
                  
                  <Button 
                    variant="ghost"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="flex items-center justify-start gap-2"
                  >
                    <SettingsIcon className="h-4 w-4" />
                    Paramètres
                  </Button>
                  
                  <Button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90"
                  >
                    Déconnexion
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/login');
                    }}
                    className={location.pathname === '/login' ? "text-warm-orange" : ""}
                  >
                    Connexion
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/signup');
                    }}
                    className={`bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark hover:shadow-md active:opacity-90 ${
                      location.pathname === '/signup' ? "ring-2 ring-warm-orange/50" : ""
                    }`}
                  >
                    Inscription
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
