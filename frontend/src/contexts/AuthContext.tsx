import { createContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  nome: string;
  email: string;
  tipo: 'CLIENTE' | 'TRABALHADOR';
  foto_url?: string;
  telefone?: string;
}

interface AuthContextData {
  user: User | null;
  signIn: (data: any) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const token = localStorage.getItem('@HubLocal:token');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.data);
        } catch (error) {
          console.error("Token inválido", error);
          localStorage.removeItem('@HubLocal:token');
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn({ email, senha }: any) {
    const response = await api.post('/auth/login', { email, senha });
    const { token, user } = response.data.data;
    
    localStorage.setItem('@HubLocal:token', token);
    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('@HubLocal:token');
    setUser(null);
  }

  function updateUser(updatedUser: User) {
    setUser(updatedUser);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
