
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Index from "./pages/Home";
import Conscientizacao from "./pages/Conscientizacao";
import Desafios from "./pages/Desafios";
import Quiz from "./pages/Quiz";
import PontosColeta from "./pages/PontosColeta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/conscientizacao" element={<Conscientizacao />} />
            <Route path="/desafios" element={<Desafios />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/pontos-coleta" element={<PontosColeta />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
