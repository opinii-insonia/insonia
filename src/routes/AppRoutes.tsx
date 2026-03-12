import React from 'react';
import { Routes, Route } from "react-router-dom";

// Client Pages
import Home from "@/pages/Home";
import EpworthTest from "@/pages/EpworthTest";
import InsomniaTest from "@/pages/InsomniaTest";
import LeadCapture from "@/pages/LeadCapture";
import ResultPage from "@/pages/ResultPage";
import NotFound from "@/pages/NotFound";

// Admin Pages
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLeads from "@/pages/AdminLeads";
import AdminReports from "@/pages/AdminReports";
import AdminSettings from "@/pages/AdminSettings";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Fluxo do Paciente */}
      <Route path="/" element={<Home />} />
      <Route path="/epworth" element={<EpworthTest />} />
      <Route path="/insomnia" element={<InsomniaTest />} />
      <Route path="/lead-capture" element={<LeadCapture />} />
      <Route path="/resultado" element={<ResultPage />} />
      
      {/* Painel Administrativo */}
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/leads" element={<AdminLeads />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/settings" element={<AdminSettings />} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};