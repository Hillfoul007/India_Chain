import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Auth Routes */}
          <Route path="/auth/signup" element={<Placeholder title="Sign Up" />} />
          <Route path="/auth/login" element={<Placeholder title="Sign In" />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Placeholder title="Dashboard" />} />
          <Route path="/dashboard/wallet" element={<Placeholder title="DID Wallet" />} />
          <Route path="/dashboard/logistics" element={<Placeholder title="Smart Logistics" />} />
          <Route path="/dashboard/credit" element={<Placeholder title="AI Credit Score" />} />
          <Route path="/dashboard/chat" element={<Placeholder title="AI Chat" />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
