
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Conscientizacao from "./pages/Conscientizacao";
import Desafios from "./pages/Desafios";
import Quiz from "./pages/Quiz";
import PontosColeta from "./pages/PontosColeta";
import NotFound from "./pages/NotFound";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="min-h-screen bg-background">
          <Header />
          <Switch>
            <Route path="/auth">
              <Auth />
            </Route>
            <Route path="/">
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </Route>
            <Route path="/conscientizacao">
              <ProtectedRoute>
                <Conscientizacao />
              </ProtectedRoute>
            </Route>
            <Route path="/desafios">
              <ProtectedRoute>
                <Desafios />
              </ProtectedRoute>
            </Route>
            <Route path="/quiz">
              <ProtectedRoute>
                <Quiz />
              </ProtectedRoute>
            </Route>
            <Route path="/pontos-coleta">
              <ProtectedRoute>
                <PontosColeta />
              </ProtectedRoute>
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
