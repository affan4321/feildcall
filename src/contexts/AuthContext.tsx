import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: any | null
  userProfile: any | null
  loading: boolean
  retell: string | null
  hasAgentNumber: boolean
  fetchContactByEmail: (string)=> Promise<any>
  fetchUserRetellNumber: () => Promise<void>
  signUp: (email: string, password: string, profileData: any) => Promise<{ error: any }>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (profileData: any) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [retell, setRetell] = useState(null)
  const [hasAgentNumber, setHasAgentNumber] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        console.log('AuthContext: Getting session...');
        const { data: { session } } = await supabase.auth.getSession()
        console.log('AuthContext: Session data:', session);
        if (session?.user) {
          console.log('AuthContext: User found, fetching profile...');
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          console.log('AuthContext: No session found');
          // Ensure clean state when no session
          setUser(null)
          setUserProfile(null)
          setRetell(null)
          setHasAgentNumber(false)
        }
      } catch (error) {
        console.error('Error getting session:', error)
        // Clear state on error
        setUser(null)
        setUserProfile(null)
        setRetell(null)
        setHasAgentNumber(false)
      } finally {
        console.log('AuthContext: Setting loading to false');
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Auth state changed:', event, session);
        
        if (event === 'SIGNED_OUT' || !session?.user) {
          // Immediate cleanup on sign out
          setUser(null)
          setUserProfile(null)
          setRetell(null)
          setHasAgentNumber(false)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
          setRetell(null)
          setHasAgentNumber(false)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Fetch retell number when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      fetchUserRetellNumber();
    }
  }, [userProfile])

  // Fetch user profile by user ID
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('AuthContext: Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
      console.log('AuthContext: Profile fetched:', data);
      setUserProfile(data)
      setHasAgentNumber(data?.has_agent_number || false)
      if (data?.agent_number) {
        setRetell(data.agent_number)
      }
      return data
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  }

  // Fetch user profile by email (for login/signup)
  const fetchUserProfileByEmail = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('email', email)
        .single()
      if (error) {
        console.error('Error fetching profile by email:', error)
        return null
      }
      setUserProfile(data)
      setHasAgentNumber(data?.has_agent_number || false)
      if (data?.agent_number) {
        setRetell(data.agent_number)
      }
      return data
    } catch (error) {
      console.error('Error fetching user profile by email:', error)
      return null
    }
  }

  // SIGN UP: create user, save profile, auto-login, fetch profile
  const signUp = async (email: string, password: string, profileData: any) => {
    setLoading(true)
    try {
      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (authError) {
        return { error: authError }
      }
      if (!authData.user) {
        return { error: new Error('Failed to create user account') }
      }
      // 2. Save profile to user_profiles
      const profile = { ...profileData, id: authData.user.id, email }
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([profile])
      if (profileError) {
        return { error: profileError }
      }
      // 3. Auto-login (Supabase should already have session)
      setUser(authData.user)
      await fetchUserProfile(authData.user.id)
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // SIGN IN: login, fetch profile by email
  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        return { error }
      }
      if (data.user) {
        setUser(data.user)
        await fetchUserProfileByEmail(email)
      }
      return { error: null }
    } catch (error) {
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // SIGN OUT: clear state
  const signOut = async () => {
    setLoading(true)
    try {
      // Clear local state first to provide immediate feedback
      setUser(null)
      setUserProfile(null)
      setRetell(null)
      setHasAgentNumber(false)
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Supabase sign out error:', error)
        // Even if Supabase signout fails, we've cleared local state
        // This ensures the user appears logged out in the UI
      }
      
      // Clear any cached data
      localStorage.clear()
      sessionStorage.clear()
      
    } catch (error) {
      console.error('Sign out error:', error)
      // Ensure state is cleared even if there's an error
      setUser(null)
      setUserProfile(null)
      setRetell(null)
      setHasAgentNumber(false)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: any) => {
    try {
      if (!user) {
        throw new Error('No user logged in')
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        throw error
      }

      // Refresh the profile data
      await fetchUserProfile(user.id)
      
      return { error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { error }
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

const fetchUserRetellNumber = async () => {
  // First check if user has agent number in Supabase
  if (userProfile?.has_agent_number && userProfile?.agent_number) {
    setRetell(userProfile.agent_number);
    setHasAgentNumber(true);
    return;
  }

  if (!userProfile?.email) return;

  const url = 'https://services.leadconnectorhq.com/contacts/?locationId=yyTbibKYQhtCYuKKsjbN';
  const options = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer pit-5b102959-5a03-45c0-b831-b601c619a1b1',
      Version: '2021-07-28',
      Accept: 'application/json'
    }
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    const user = data.contacts.find((u) => u.email === userProfile.email);
    const field = user?.customFields?.find((f) => f.id === 'Znuo3CRbsgviZTDokZyH');
    const retell_number = field?.value || 'Not assigned yet';
    setRetell(retell_number);
    
    // If we found a number from GoHighLevel, update Supabase
    if (retell_number && retell_number !== 'Not assigned yet') {
      setHasAgentNumber(true);
      // Optionally update Supabase with this number if not already set
      if (!userProfile?.has_agent_number) {
        updateProfile({
          agent_number: retell_number,
          has_agent_number: true
        });
      }
    }
  } catch (error) {
    console.error('Failed to fetch retell number:', error);
  }
};

  const fetchContactByEmail = async(email:string) =>{
try {
    const url = 'https://services.leadconnectorhq.com/contacts/?locationId=yyTbibKYQhtCYuKKsjbN';
const options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer pit-5b102959-5a03-45c0-b831-b601c619a1b1',
    Version: '2021-07-28',
    Accept: 'application/json'
  }
};
  const response = await fetch(url, options);
  const data = await response.json();
   const user = data.contacts.filter((u)=>u.email === email);
  return user[0];
} catch (error) {
  console.error(error);
}
  }
  
  const value = {
    user,
    userProfile,
    loading,
    hasAgentNumber,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
    fetchUserRetellNumber,
    retell,
    fetchContactByEmail
  }
  



  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 