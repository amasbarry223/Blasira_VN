import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AdminProfile {
  id: string;
  name: string;
  phone: string;
  avatar_url: string | null;
  role: 'admin';
  university: string | null;
  verification_status: 'pending' | 'verified' | 'rejected';
  rating: number;
  total_trips: number;
}

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  profile: AdminProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (phone: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const phoneToEmail = (phone: string) => {
  const cleaned = phone.replace(/\D/g, '');
  return `${cleaned}@blasira.app`;
};

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
};

// Mode développement : permet l'accès sans authentification
const DEV_MODE = true; // Mettre à false en production

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(!DEV_MODE); // Pas de loading en dev mode

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .eq('role', 'admin')
      .single();
    
    if (data) {
      setProfile(data as AdminProfile);
    } else {
      setProfile(null);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  useEffect(() => {
    // Mode développement : simuler un profil admin
    if (DEV_MODE) {
      setProfile({
        id: 'dev-admin-id',
        name: 'Admin Développement',
        phone: '12345678',
        avatar_url: null,
        role: 'admin',
        university: null,
        verification_status: 'verified',
        rating: 5,
        total_trips: 0,
      });
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchProfile(session.user.id), 0);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (phone: string, password: string) => {
    const email = phoneToEmail(phone);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!error) {
      // Vérifier que l'utilisateur est bien admin
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .eq('role', 'admin')
          .single();
        
        if (!profileData) {
          await supabase.auth.signOut();
          return { error: new Error('Accès refusé. Vous devez être administrateur.') };
        }
      }
    }
    
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const isAdmin = DEV_MODE ? true : profile?.role === 'admin';

  return (
    <AdminAuthContext.Provider value={{ user, session, profile, loading, isAdmin, signIn, signOut, refreshProfile }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

