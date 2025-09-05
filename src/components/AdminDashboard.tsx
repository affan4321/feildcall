import React, { useState, useEffect } from 'react';
import { Users, Phone, Building, Settings, LogOut, Search, Filter, Download, Eye, Edit, Trash2, Shield, Crown, User as UserIcon, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  company: string;
  phone: string;
  business_type: string;
  role: string;
  has_agent_number: boolean;
  agent_number: string;
  created_at: string;
  selected_plan: string;
}

const AdminDashboard = () => {
  const { user, userProfile, signOut, isAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    usersWithAgents: 0,
    recentSignups: 0
  });

  // Redirect if not admin
  useEffect(() => {
    if (!loading && (!isAdmin && !isSuperAdmin)) {
      navigate('/dashboard');
    }
  }, [isAdmin, isSuperAdmin, loading, navigate]);

  // Fetch all users
  useEffect(() => {
    if (isAdmin || isSuperAdmin) {
      fetchUsers();
    }
  }, [isAdmin, isSuperAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        return;
      }

      setUsers(data || []);
      
      // Calculate stats
      const totalUsers = data?.length || 0;
      const adminUsers = data?.filter(u => u.role === 'admin' || u.role === 'super_admin').length || 0;
      const usersWithAgents = data?.filter(u => u.has_agent_number).length || 0;
      const recentSignups = data?.filter(u => {
        const createdAt = new Date(u.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdAt > weekAgo;
      }).length || 0;

      setStats({
        totalUsers,
        adminUsers,
        usersWithAgents,
        recentSignups
      });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut();
    window.location.href = '/';
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user role:', error);
        return;
      }

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'admin':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <UserIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-accent-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
            Loading admin dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin && !isSuperAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-soft border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src="/LogoFieldCall.png"
                alt="FieldCall™"
                className="h-8 w-auto"
              />
              <div className="hidden sm:block">
                <h1
                  className="text-xl font-bold text-primary-900 flex items-center space-x-2"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <Shield className="w-5 h-5 text-accent-500" />
                  <span>Admin Dashboard</span>
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-accent-50 px-3 py-1 rounded-lg">
                {getRoleIcon(userProfile?.role)}
                <span className="text-sm font-medium text-accent-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {userProfile?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-primary-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="User Dashboard"
              >
                <UserIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {isLoggingOut ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="hidden sm:inline">Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2
            className="text-2xl sm:text-3xl font-bold text-primary-900 mb-2"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Welcome, {userProfile?.first_name}!
          </h2>
          <p
            className="text-gray-600 font-medium"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Manage users and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Total Users
                </p>
                <p className="text-2xl font-bold text-primary-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {stats.totalUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-accent-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Admin Users
                </p>
                <p className="text-2xl font-bold text-primary-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {stats.adminUsers}
                </p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Active Agents
                </p>
                <p className="text-2xl font-bold text-primary-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {stats.usersWithAgents}
                </p>
              </div>
              <Phone className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-medium border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Recent Signups
                </p>
                <p className="text-2xl font-bold text-primary-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  {stats.recentSignups}
                </p>
              </div>
              <UserIcon className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Users Management */}
        <div className="bg-white rounded-2xl shadow-medium border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3
                className="text-lg font-bold text-primary-900"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                User Management
              </h3>
              
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 transition-all duration-200"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <option value="all">All Roles</option>
                  <option value="user">Users</option>
                  <option value="admin">Admins</option>
                  <option value="super_admin">Super Admins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  {isSuperAdmin && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {user.company}
                      </div>
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {user.business_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span>{user.role === 'super_admin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'User'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.has_agent_number ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                          <CheckCircle className="w-3 h-3" />
                          <span>Active</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <AlertCircle className="w-3 h-3" />
                          <span>Pending</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {user.selected_plan || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    {isSuperAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                No users found matching your criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;