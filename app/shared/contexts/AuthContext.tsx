import { createContext, useContext, useEffect, useState, useRef } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

type UserType = 'patient' | 'nutritionist';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userType: UserType | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_TYPE_CACHE_KEY = 'nutricao:userType';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userType, setUserType] = useState<UserType | null>(() => {
    // Inicializar com cache do localStorage se existir
    const cached = localStorage.getItem(USER_TYPE_CACHE_KEY);
    return cached ? (JSON.parse(cached) as UserType) : null;
  });
  const [loading, setLoading] = useState(true);
  
  // Ref para evitar chamadas duplicadas simultâneas
  const fetchingUserType = useRef(false);
  const lastFetchedUserId = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Verificar sessão inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserType(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Só buscar se for um novo usuário ou evento de SIGNED_IN
          if (event === 'SIGNED_IN' || lastFetchedUserId.current !== session.user.id) {
            await fetchUserType(session.user.id);
          } else {
            setLoading(false);
          }
        } else {
          // Usuário deslogou - limpar cache
          setUserType(null);
          localStorage.removeItem(USER_TYPE_CACHE_KEY);
          lastFetchedUserId.current = null;
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserType = async (userId: string) => {
    // Evitar chamadas duplicadas para o mesmo usuário
    if (fetchingUserType.current && lastFetchedUserId.current === userId) {
      return;
    }

    // Se já temos o userType em cache para este usuário, usar ele
    if (lastFetchedUserId.current === userId && userType !== null) {
      setLoading(false);
      return;
    }

    fetchingUserType.current = true;
    lastFetchedUserId.current = userId;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('user_type')
        .eq('id', userId)
        .single();

      if (error) {
        // Usuário não existe na tabela users (primeiro acesso)
        console.log('User not found in database, first access');
        setUserType(null);
        localStorage.removeItem(USER_TYPE_CACHE_KEY);
      } else if (data && 'user_type' in data) {
        const type = data.user_type as UserType;
        setUserType(type);
        // Cachear no localStorage
        localStorage.setItem(USER_TYPE_CACHE_KEY, JSON.stringify(type));
      }
    } catch (error) {
      console.error('Error fetching user type:', error);
      setUserType(null);
      localStorage.removeItem(USER_TYPE_CACHE_KEY);
    } finally {
      setLoading(false);
      fetchingUserType.current = false;
    }
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userType,
      loading,
      signInWithGoogle,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
