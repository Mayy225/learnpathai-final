import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';

export interface LearningPlan {
  id: string;
  age: string;
  schoolLevel: string;
  averageGrade: string;
  learningDifficulties: string;
  subject: string;
  specificRequests: string;
  createdAt: number;
  generatedPlan?: string;
  isSaved?: boolean;
  userId?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  loading: boolean;
  hasSubscription: boolean;
  learningPlans: LearningPlan[];
  savedPlans: LearningPlan[];
  setHasSubscription: (value: boolean) => void;
  saveLearningPlan: (plan: Omit<LearningPlan, 'id' | 'createdAt' | 'userId'>) => void;
  getCurrentPlan: () => LearningPlan | undefined;
  saveCurrentPlan: () => void;
  getSavedPlans: () => LearningPlan[];
  getPlansCount: () => number;
  getRemainingFreePlans: () => number;
  hasReachedFreeLimit: () => boolean;
  deleteSavedPlan: (planId: string) => void;
}

const MAX_FREE_PLANS = 15;

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: true,
  hasSubscription: false,
  learningPlans: [],
  savedPlans: [],
  setHasSubscription: () => {},
  saveLearningPlan: () => {},
  getCurrentPlan: () => undefined,
  saveCurrentPlan: () => {},
  getSavedPlans: () => [],
  getPlansCount: () => 0,
  getRemainingFreePlans: () => MAX_FREE_PLANS,
  hasReachedFreeLimit: () => false,
  deleteSavedPlan: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [learningPlans, setLearningPlans] = useState<LearningPlan[]>([]);
  const [savedPlans, setSavedPlans] = useState<LearningPlan[]>([]);

  // Fonction pour charger les données utilisateur du localStorage
  const loadUserData = (userId: string) => {
    console.log(`Chargement des données pour l'utilisateur: ${userId}`);
    
    // Charger les plans d'apprentissage spécifiques à l'utilisateur
    const storedPlans = localStorage.getItem(`learningPlans_${userId}`);
    if (storedPlans) {
      try {
        const parsedPlans = JSON.parse(storedPlans);
        console.log(`Plans trouvés dans localStorage: ${parsedPlans.length}`);
        
        // Filtrer pour ne garder que les plans de l'utilisateur actuel
        const filteredPlans = parsedPlans.filter((plan: LearningPlan) => 
          !plan.userId || plan.userId === userId
        );
        
        // Ajouter l'userId à tous les plans qui n'en ont pas
        const updatedPlans = filteredPlans.map((plan: LearningPlan) => ({
          ...plan,
          userId: plan.userId || userId
        }));
        
        setLearningPlans(updatedPlans);
        console.log(`Plans chargés pour l'utilisateur ${userId}: ${updatedPlans.length}`);
        
        // Mettre à jour le stockage avec les plans mis à jour
        localStorage.setItem(`learningPlans_${userId}`, JSON.stringify(updatedPlans));
      } catch (error) {
        console.error("Erreur lors du chargement des plans:", error);
        setLearningPlans([]);
      }
    } else {
      console.log(`Aucun plan trouvé dans localStorage pour l'utilisateur ${userId}`);
      setLearningPlans([]);
    }

    // Charger les plans sauvegardés spécifiques à l'utilisateur
    const storedSavedPlans = localStorage.getItem(`savedPlans_${userId}`);
    if (storedSavedPlans) {
      try {
        const parsedSavedPlans = JSON.parse(storedSavedPlans);
        console.log(`Plans sauvegardés trouvés: ${parsedSavedPlans.length}`);
        
        // Filtrer pour ne garder que les plans de l'utilisateur actuel
        const filteredSavedPlans = parsedSavedPlans.filter((plan: LearningPlan) => 
          !plan.userId || plan.userId === userId
        );
        
        // Ajouter l'userId à tous les plans qui n'en ont pas
        const updatedSavedPlans = filteredSavedPlans.map((plan: LearningPlan) => ({
          ...plan,
          userId: plan.userId || userId
        }));
        
        setSavedPlans(updatedSavedPlans);
        console.log(`Plans sauvegardés chargés: ${updatedSavedPlans.length}`);
        
        // Mettre à jour le stockage avec les plans mis à jour
        localStorage.setItem(`savedPlans_${userId}`, JSON.stringify(updatedSavedPlans));
      } catch (error) {
        console.error("Erreur lors du chargement des plans sauvegardés:", error);
        setSavedPlans([]);
      }
    } else {
      console.log(`Aucun plan sauvegardé trouvé pour l'utilisateur ${userId}`);
      setSavedPlans([]);
    }

    // Vérifier le statut d'abonnement
    const subscriptionStatus = localStorage.getItem(`subscriptionStatus_${userId}`);
    const isSubscribed = subscriptionStatus === 'active';
    setHasSubscription(isSubscribed);
    console.log(`Statut d'abonnement pour ${userId}: ${isSubscribed ? 'actif' : 'inactif'}`);
  };

  // Load user-specific data when user changes
  useEffect(() => {
    if (currentUser) {
      console.log(`Utilisateur connecté: ${currentUser.uid}`);
      const userId = currentUser.uid;
      loadUserData(userId);
    } else {
      console.log("Aucun utilisateur connecté - réinitialisation des données");
      // Reset all data when no user is logged in
      setLearningPlans([]);
      setSavedPlans([]);
      setHasSubscription(false);
    }
  }, [currentUser]);

  // Save learning plans to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && learningPlans.length >= 0) { // Changement: >= 0 au lieu de > 0 pour sauvegarder même les tableaux vides
      const userId = currentUser.uid;
      console.log(`Sauvegarde de ${learningPlans.length} plans pour l'utilisateur ${userId}`);
      localStorage.setItem(`learningPlans_${userId}`, JSON.stringify(learningPlans));
    }
  }, [learningPlans, currentUser]);

  // Save saved plans to localStorage whenever it changes
  useEffect(() => {
    if (currentUser && savedPlans.length >= 0) { // Changement: >= 0 au lieu de > 0
      const userId = currentUser.uid;
      console.log(`Sauvegarde de ${savedPlans.length} plans sauvegardés pour l'utilisateur ${userId}`);
      localStorage.setItem(`savedPlans_${userId}`, JSON.stringify(savedPlans));
    }
  }, [savedPlans, currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Changement d'état d'authentification:", user ? `Utilisateur ${user.uid}` : "Déconnecté");
      setCurrentUser(user);
      setLoading(false);
      
      // Charger les données de l'utilisateur s'il est connecté
      if (user) {
        loadUserData(user.uid);
      }
    });

    return unsubscribe;
  }, []);

  // Function to save a new learning plan
  const saveLearningPlan = (planData: Omit<LearningPlan, 'id' | 'createdAt' | 'userId'>) => {
    if (!currentUser) {
      console.error("Tentative de sauvegarde d'un plan sans utilisateur connecté");
      return;
    }
    
    const userId = currentUser.uid;
    const newPlan: LearningPlan = {
      ...planData,
      id: `plan_${Date.now()}`,
      createdAt: Date.now(),
      userId: userId,
    };
    
    console.log(`Création d'un nouveau plan pour l'utilisateur ${userId}:`, newPlan.id);
    
    setLearningPlans(prevPlans => {
      const updatedPlans = [newPlan, ...prevPlans];
      console.log(`Total de plans après ajout: ${updatedPlans.length}`);
      
      // Sauvegarder immédiatement dans localStorage
      localStorage.setItem(`learningPlans_${userId}`, JSON.stringify(updatedPlans));
      
      return updatedPlans;
    });
  };

  // Get the most recent learning plan for the current user
  const getCurrentPlan = () => {
    if (learningPlans.length === 0) return undefined;
    
    // Ensure we only return a plan belonging to the current user
    if (currentUser) {
      const userPlan = learningPlans.find(plan => 
        !plan.userId || plan.userId === currentUser.uid
      );
      return userPlan || learningPlans[0]; // Fallback to first plan if no match (should not happen with proper filtering)
    }
    
    return learningPlans[0];
  };

  // Save the current plan to saved plans
  const saveCurrentPlan = () => {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    const currentPlan = getCurrentPlan();
    
    if (currentPlan) {
      // Vérifier si le plan n'est pas déjà sauvegardé
      const alreadySaved = savedPlans.some(plan => plan.id === currentPlan.id);
      if (!alreadySaved) {
        const planToSave = {
          ...currentPlan,
          isSaved: true,
          userId: userId // Assurer que l'ID de l'utilisateur est associé au plan sauvegardé
        };
        
        setSavedPlans(prev => {
          const updatedSavedPlans = [planToSave, ...prev];
          
          // Sauvegarder immédiatement dans localStorage
          localStorage.setItem(`savedPlans_${userId}`, JSON.stringify(updatedSavedPlans));
          
          return updatedSavedPlans;
        });
      }
    }
  };

  // Get all saved plans for the current user
  const getSavedPlans = () => {
    if (!currentUser) return [];
    
    // Filtrer les plans sauvegardés pour ne renvoyer que ceux appartenant à l'utilisateur actuel
    return savedPlans.filter(plan => 
      !plan.userId || plan.userId === currentUser.uid
    );
  };

  // Obtenir le nombre total de plans créés par l'utilisateur actuel
  const getPlansCount = () => {
    if (!currentUser) return 0;
    
    const userPlansCount = learningPlans.filter(plan => 
      !plan.userId || plan.userId === currentUser.uid
    ).length;
    
    console.log(`Nombre de plans pour l'utilisateur ${currentUser.uid}: ${userPlansCount}`);
    return userPlansCount;
  };

  // Obtenir le nombre de plans gratuits restants pour l'utilisateur actuel
  const getRemainingFreePlans = () => {
    if (hasSubscription) {
      console.log("Utilisateur avec abonnement - plans illimités");
      return Infinity; // Illimité pour les abonnés
    }
    const remaining = Math.max(0, MAX_FREE_PLANS - getPlansCount());
    console.log(`Plans gratuits restants: ${remaining}`);
    return remaining;
  };

  // Vérifier si l'utilisateur a atteint la limite gratuite
  const hasReachedFreeLimit = () => {
    if (hasSubscription) {
      console.log("Utilisateur avec abonnement - pas de limite");
      return false; // Les abonnés n'ont pas de limite
    }
    const limitReached = getPlansCount() >= MAX_FREE_PLANS;
    console.log(`Limite gratuite atteinte: ${limitReached} (${getPlansCount()}/${MAX_FREE_PLANS})`);
    return limitReached;
  };

  // Fonction pour supprimer un plan sauvegardé
  const deleteSavedPlan = (planId: string) => {
    if (!currentUser) return;
    
    const userId = currentUser.uid;
    
    setSavedPlans(prev => {
      const updatedSavedPlans = prev.filter(plan => plan.id !== planId);
      
      // Sauvegarder immédiatement dans localStorage
      localStorage.setItem(`savedPlans_${userId}`, JSON.stringify(updatedSavedPlans));
      
      return updatedSavedPlans;
    });
  };

  // Update localStorage when subscription changes
  useEffect(() => {
    if (currentUser) {
      const userId = currentUser.uid;
      const statusToStore = hasSubscription ? 'active' : 'inactive';
      console.log(`Mise à jour du statut d'abonnement pour ${userId}: ${statusToStore}`);
      localStorage.setItem(`subscriptionStatus_${userId}`, statusToStore);
    }
  }, [hasSubscription, currentUser]);

  const value = {
    currentUser,
    loading,
    hasSubscription,
    learningPlans,
    savedPlans,
    setHasSubscription,
    saveLearningPlan,
    getCurrentPlan,
    saveCurrentPlan,
    getSavedPlans,
    getPlansCount,
    getRemainingFreePlans,
    hasReachedFreeLimit,
    deleteSavedPlan,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
