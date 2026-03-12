import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TestProvider } from "./context/TestContext";

import Home from "./pages/Home";
import EpworthTest from "./pages/EpworthTest";
import InsomniaTest from "./pages/InsomniaTest";
import LeadCapture from "./pages/LeadCapture";
import ResultPage from "./pages/ResultPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <TestProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/epworth" element={<EpworthTest />} />
            <Route path="/insomnia" element={<InsomniaTest />} />
            <Route path="/lead-capture" element={<LeadCapture />} />
            <Route path="/resultado" element={<ResultPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TestProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;