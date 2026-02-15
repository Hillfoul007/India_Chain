import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Auth/Signup";
import Login from "./pages/Auth/Login";
import Overview from "./pages/Dashboard/Overview";
import Wallet from "./pages/Dashboard/Wallet";
import Logistics from "./pages/Dashboard/Logistics";
import CreditScore from "./pages/Dashboard/CreditScore";
import Chat from "./pages/Dashboard/Chat";

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
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<Overview />} />
          <Route path="/dashboard/wallet" element={<Wallet />} />
          <Route path="/dashboard/logistics" element={<Logistics />} />
          <Route path="/dashboard/credit" element={<CreditScore />} />
          <Route path="/dashboard/chat" element={<Chat />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
