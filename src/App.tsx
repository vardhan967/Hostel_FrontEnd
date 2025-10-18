// src/App.jsx

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "./pages/Home";
import HostelList from "./pages/HostelList";
import HostelDetail from "./pages/HostelDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CustomerDashboard from "./pages/CustomerDashboard";
import WardenDashboard from "./pages/WardenDashboard";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>  {/* <-- The router is now at the top */}
        <AuthProvider> {/* <-- AuthProvider is now inside the router */}
          <Toaster />
          <Sonner />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hostels" element={<HostelList />} />
                <Route path="/hostels/:id" element={<HostelDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<CustomerDashboard />} />
                <Route path="/warden-dashboard" element={<WardenDashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;