import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Loader } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth()

  console.log('ProtectedRoute: State check', { user: !!user, loading });

  // Add effect to handle auth state changes
  React.useEffect(() => {
    if (!loading && !user) {
      console.log('ProtectedRoute: No user detected, redirecting to home');
    }
  }, [user, loading]);
  if (loading) {
    console.log('ProtectedRoute: Showing loading state');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Loading...
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to home');
    return <Navigate to="/" replace />
  }

  console.log('ProtectedRoute: User authenticated, rendering children');
  return <>{children}</>
}

export default ProtectedRoute