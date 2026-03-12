import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";

// Client Pages
import Home from "@/pages/Home";
import EpworthTest from "@/pages/EpworthTest";
import EpworthResult from "@/pages/EpworthResult";
import InsomniaTest from "@/pages/InsomniaTest";
import InsomniaResult from "@/pages/InsomniaResult";
import LeadCapture from "@/pages/LeadCapture";
import ResultPage from "@/pages/ResultPage";
import NotFound from "@/pages/NotFound";

// Admin Pages & Components
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLeads from "@/pages/AdminLeads";
import AdminLeadDetails from "@/pages/AdminLeadDetails";
import AdminReports from "@/pages/AdminReports";
import AdminSettings from "@/pages/AdminSettings";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Fluxo Público (Paciente) */}
      <Route path="/" element={<Home />} />
      <Route path="/epworth" element={<EpworthTest />} />
      <Route path="/epworth-result" element={<EpworthResult />} />
      <Route path="/insomnia" element={<InsomniaTest />} />
      <Route path="/insomnia-result" element={<InsomniaResult />} />
      <Route path="/lead-capture" element={<LeadCapture />} />
      <Route path="/resultado" element={<ResultPage />} />
      
      {/* Fluxo Administrativo (Público) */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Fluxo Administrativo (Protegido) */}
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
      <Route path="/admin/leads/:id" element={<ProtectedRoute><AdminLeadDetails /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute><AdminReports /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};