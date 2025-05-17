// hooks/useSession.ts
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

const useSession = () => {
  const [session, setSession] = useState<any | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Error fetching session:', sessionError);
        setSession(null);
      } else {
        setSession(sessionData?.session || null);
      }
    };

    fetchSession();

    // Optional: Listen for auth state changes if needed for real-time updates
    // const { data: authListener } = supabase.auth.onAuthStateChange(
    //   (event, currentSession) => {
    //     setSession(currentSession);
    //   }
    // );

    // Clean up listener if you implement it
    // return () => {
    //   authListener?.subscription.unsubscribe();
    // };
  }, [supabase]);

  return session;
};

export default useSession;
