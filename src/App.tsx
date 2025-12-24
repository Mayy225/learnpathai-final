
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatBot from "./components/ChatBot";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/Pricing";
import LearningPlanCreation from "./pages/LearningPlanCreation";
import LoadingPlan from "./pages/LoadingPlan";
import GeneratedPlan from "./pages/GeneratedPlan"; 
import SavedPlans from "./pages/SavedPlans"; // Nouvelle page
import PlanDetails from "./pages/PlanDetails"; // Nouvelle page

import FocusMode from "./pages/FocusMode";
import Resources from "./pages/Resources";
import PaymentSuccess from "./pages/PaymentSuccess";
import Settings from "./pages/Settings";
import About from "./pages/About";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/learning-plan" element={<LearningPlanCreation />} />
            <Route path="/generated-plan" element={<GeneratedPlan />} />
            <Route path="/saved-plans" element={<SavedPlans />} />
            <Route path="/plan/:id" element={<PlanDetails />} />
            
            <Route path="/focus" element={<FocusMode />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/loading-plan" element={<LoadingPlan />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatBot />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
