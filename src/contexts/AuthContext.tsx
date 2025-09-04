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
  // Auto-logout functionality
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout
    const INACTIVITY_TIME = 10 * 60 * 1000 // 10 minutes in milliseconds

    const resetTimer = () => {
      clearTimeout(inactivityTimer)
      if (user) {
        inactivityTimer = setTimeout(() => {
         
          signOut()
        }, INACTIVITY_TIME)
      }
    }

    const handleActivity = () => {
      resetTimer()
    }

    // Only set up activity listeners if user is logged in
    if (user) {
      // Listen for user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      events.forEach(event => {
        document.addEventListener(event, handleActivity, true)
      })

      // Start the timer
      resetTimer()
    }

    // Cleanup function
    return () => {
      clearTimeout(inactivityTimer)
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [user]) // Re-run when user changes
  // Check for existing session on mount
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
          setUserProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])
    useEffect(()=>{
     fetchUserRetellNumber();
  },[])
  // Fetch user profile by user ID
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()
      if (error) {
        console.error('Error fetching profile:', error)
        return null
      }
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
      const { error } = await supabase.auth.signOut()
      setUser(null)
      setUserProfile(null)
      if (error) throw error
    } catch (error) {
      console.error('Sign out error:', error)
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