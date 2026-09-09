import type { ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MainLayout } from '../layouts/MainLayout';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Cadastro } from '../pages/Cadastro';
import { BuscaServicos } from '../pages/cliente/BuscaServicos';
import { MinhasPropostas } from '../pages/cliente/MinhasPropostas';
import { MeusServicos } from '../pages/trabalhador/MeusServicos';
import { PropostasRecebidas } from '../pages/trabalhador/PropostasRecebidas';
import { Perfil } from '../pages/Perfil';

const PrivateRoute = ({ children, role }: { children: ReactNode, role?: 'CLIENTE' | 'TRABALHADOR' }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.tipo !== role) return <Navigate to="/" replace />;
  
  return children;
};

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      <Route path="/cadastro" element={<MainLayout><Cadastro /></MainLayout>} />
      
      <Route path="/cliente/busca" element={
        <PrivateRoute role="CLIENTE"><MainLayout><BuscaServicos /></MainLayout></PrivateRoute>
      } />
      <Route path="/cliente/propostas" element={
        <PrivateRoute role="CLIENTE"><MainLayout><MinhasPropostas /></MainLayout></PrivateRoute>
      } />

      <Route path="/trabalhador/servicos" element={
        <PrivateRoute role="TRABALHADOR"><MainLayout><MeusServicos /></MainLayout></PrivateRoute>
      } />
      <Route path="/trabalhador/propostas" element={
        <PrivateRoute role="TRABALHADOR"><MainLayout><PropostasRecebidas /></MainLayout></PrivateRoute>
      } />

      <Route path="/perfil" element={
        <PrivateRoute><MainLayout><Perfil /></MainLayout></PrivateRoute>
      } />
    </Routes>
  );
};
