
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, FileText, Play, BookOpen } from 'lucide-react';

// Define the allowed resource types for strong typing
type ResourceType = "link" | "video" | "pdf" | "exercise";

interface Resource {
  id: number;
  title: string;
  description: string;
  type: ResourceType;
  url: string;
}

const Resources = () => {
  const { currentUser, hasSubscription, getCurrentPlan } = useAuth();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!hasSubscription) {
      navigate('/pricing');
      return;
    }

    const currentPlan = getCurrentPlan();
    if (!currentPlan) {
      navigate('/create-learning-plan');
      return;
    }

    // Generate resources based on the user's learning plan
    const generateResources = () => {
      // In a real app, this would be fetched from an API
      const demoResources: Resource[] = [
        {
          id: 1,
          title: `Introduction à ${currentPlan.subject}`,
          description: `Ressource adaptée pour les élèves de ${currentPlan.schoolLevel} avec ${currentPlan.averageGrade}.`,
          type: "link" as ResourceType,
          url: "https://example.com/intro"
        },
        {
          id: 2,
          title: `Vidéo explicative: ${currentPlan.subject}`,
          description: "Vidéo pédagogique adaptée à votre niveau.",
          type: "video" as ResourceType,
          url: "https://example.com/video"
        },
        {
          id: 3,
          title: "Fiche de révision",
          description: `Document PDF adapté pour les ${currentPlan.schoolLevel}.`,
          type: "pdf" as ResourceType,
          url: "https://example.com/pdf"
        },
        {
          id: 4,
          title: "Exercices pratiques",
          description: `Exercices de difficulté adaptée pour ${currentPlan.averageGrade}.`,
          type: "exercise" as ResourceType,
          url: "https://example.com/exercises"
        }
      ];
      setResources(demoResources);
      setLoading(false);
    };

    generateResources();
  }, [currentUser, hasSubscription, navigate, getCurrentPlan]);

  const getResourceIcon = (type: ResourceType) => {
    switch (type) {
      case "link":
        return <ExternalLink className="h-5 w-5" />;
      case "video":
        return <Play className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "exercise":
        return <BookOpen className="h-5 w-5" />;
      default:
        return <ExternalLink className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-warm-orange rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-16 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Ressources d'apprentissage personnalisées</h1>
          <p className="text-lg text-text-medium mb-8">
            Voici des ressources adaptées à votre plan d'apprentissage. Ces ressources ont été sélectionnées pour vous aider à progresser efficacement.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getResourceIcon(resource.type)}
                    {resource.title}
                  </CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-text-medium">
                    Type: {resource.type === "link" ? "Lien externe" : 
                          resource.type === "video" ? "Vidéo" : 
                          resource.type === "pdf" ? "Document PDF" : 
                          "Exercice interactif"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={() => window.open(resource.url, '_blank')}
                  >
                    Accéder à la ressource
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={() => navigate('/create-learning-plan')}
              className="bg-gradient-to-r from-[#FEC6A1] to-[#FFDEE2] text-text-dark"
            >
              Créer un nouveau plan d'apprentissage
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
