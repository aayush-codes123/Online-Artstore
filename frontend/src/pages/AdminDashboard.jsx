import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

// SVG Icons
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ImageIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PaletteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const UserGroupIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

// Stat Card Component
const StatCard = ({ title, value, change, icon: Icon, badgeStyle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2.5 rounded-xl ${badgeStyle}`}>
            <Icon />
          </div>
        </div>
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <span>{change > 0 ? '↗' : '↘'}</span>
            <span>{Math.abs(change)}%</span>
          </p>
        )}
      </div>
    </div>
  </motion.div>
);

// Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, onLogout, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: ChartIcon },
    { id: 'approvals', label: 'Approvals', icon: CheckIcon },
    { id: 'artworks', label: 'Artworks', icon: PaletteIcon },
    { id: 'users', label: 'Artists', icon: UserGroupIcon },
  ];

  const handleMenuClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileOpen(false); // Close mobile menu after selection
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: slide in */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 h-screen flex flex-col shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-200 flex items-center justify-center text-amber-500 font-bold text-lg shadow-sm">
                A
              </div>
              <div>
                <h3 className="font-bold text-gray-900">MuseMarket Admin</h3>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
            {/* Close button - only on mobile */}
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-50 text-blue-600 font-semibold shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-all font-medium"
          >
            <LogoutIcon />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// Artwork Verification Component
const ArtworkVerification = () => {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/admin/pending-artworks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setPending(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerify = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/verify-artwork/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) fetchPending();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Pending Artwork Verification</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Image</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Title</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Seller</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No pending artworks
                </td>
              </tr>
            ) : (
              pending.map(art => (
                <tr key={art._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={art.imageUrl}
                      className="h-12 w-12 object-cover rounded-lg shadow-sm"
                      alt={art.title}
                    />
                  </td>
                  <td className="p-3 text-gray-900 font-medium">{art.title}</td>
                  <td className="p-3 text-gray-600">{art.seller?.fullName}</td>
                  <td className="p-3">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                      Pending
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerify(art._id, 'Approved')}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleVerify(art._id, 'Rejected')}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Artists Management Component
const ArtistsManagement = () => {
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/admin/sellers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setSellers(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSeller = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete artist "${name}" and all their artworks?`)) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/admin/sellers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchSellers();
        setSelectedSeller(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Registered Artists</h3>
        {sellers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No artists registered yet.</p>
            <p className="text-gray-400 text-sm mt-2">Artists will appear here once they sign up as sellers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sellers.map((seller) => (
            <div
              key={seller._id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition cursor-pointer"
              onClick={() => setSelectedSeller(seller)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-900">{seller.fullName}</h4>
                  <p className="text-sm text-gray-600">@{seller.username}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                  {seller.artworkCount} artworks
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📧 {seller.email}</p>
                <p>📱 {seller.phoneNumber}</p>
                <p>🎨 {seller.artStyle}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSeller(seller._id, seller.fullName);
                }}
                className="mt-3 w-full px-3 py-2 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-lg text-sm font-semibold transition border border-red-200 hover:border-red-600"
              >
                Remove Artist
              </button>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Artist Details Modal */}
      {selectedSeller && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{selectedSeller.fullName}'s Artworks</h3>
              <p className="text-sm text-gray-600">Total: {selectedSeller.artworks.length} artworks</p>
            </div>
            <button
              onClick={() => setSelectedSeller(null)}
              className="text-gray-500 hover:text-gray-900 text-2xl font-bold"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {selectedSeller.artworks.map((art) => (
              <div key={art._id} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
                <img
                  src={art.imageUrl}
                  alt={art.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h4 className="font-bold text-gray-900 text-sm truncate">{art.title}</h4>
                  <p className="text-blue-600 text-sm font-semibold">Rs. {art.price}</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs font-semibold ${
                    art.verificationStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                    art.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {art.verificationStatus || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        const res = await fetch("/api/admin/dashboard-stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setStats(data);
        } else if (res.status === 403) {
          alert("Access denied. Admin privileges required.");
          navigate("/signin");
        } else if (res.status === 401) {
          navigate("/signin");
        } else {
          setError("Failed to load dashboard data");
        }
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signin");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-900 text-2xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-2xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Hamburger Menu */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
            aria-label="Logout"
          >
            <LogoutIcon />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            {/* Header - Hidden on mobile */}
            <div className="mb-6 md:mb-8 hidden lg:flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-1">
                  Welcome back, here is what is happening with your marketplace today.
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white transition font-medium border border-red-200 hover:border-red-600"
              >
                <LogoutIcon />
                <span>Logout</span>
              </button>
            </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="TOTAL REVENUE"
                  value={`Rs. ${stats.totalRevenue.toLocaleString()}`}
                  change={12.5}
                  icon={DollarIcon}
                  badgeStyle="bg-emerald-100 text-emerald-700"
                />
                <StatCard
                  title="TOTAL VISITORS"
                  value={stats.totalVisitors.toLocaleString()}
                  change={5.2}
                  icon={EyeIcon}
                  badgeStyle="bg-blue-100 text-blue-700"
                />
                <StatCard
                  title="TOTAL ARTISTS"
                  value={stats.totalSellers.toLocaleString()}
                  change={8.1}
                  icon={UsersIcon}
                  badgeStyle="bg-zinc-800 text-amber-300"
                />
                <StatCard
                  title="TOTAL ARTWORKS"
                  value={stats.totalArtworks.toLocaleString()}
                  change={15.3}
                  icon={ImageIcon}
                  badgeStyle="bg-amber-100 text-amber-700"
                />
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trends */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Revenue Trends</h3>
                      <p className="text-sm text-gray-600">Yearly Performance</p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={stats.salesByMonth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        name="Revenue (Rs.)"
                        dot={{ fill: '#3b82f6', r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Artwork Categories */}
                <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Artwork Categories</h3>
                    <p className="text-sm text-gray-600">Distribution by type</p>
                  </div>
                  <div className="space-y-4">
                    {stats.artworksByCategory.map((cat, index) => {
                      const total = stats.artworksByCategory.reduce((sum, c) => sum + c.count, 0);
                      const percentage = ((cat.count / total) * 100).toFixed(0);
                      return (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-700 font-medium">{cat.category}</span>
                            <span className="text-gray-500">{percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="h-2.5 rounded-full transition-all"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: COLORS[index % COLORS.length]
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Approvals Tab */}
          {activeTab === 'approvals' && (
            <div>
              <ArtworkVerification />
            </div>
          )}

          {/* Artworks Tab */}
          {activeTab === 'artworks' && (
            <div className="space-y-6">
              {/* Most Viewed Artworks */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Most Viewed / Popular Paintings</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {stats.mostViewedArtworks && stats.mostViewedArtworks.map((art) => (
                    <div key={art._id} className="bg-gray-50 p-4 rounded-xl hover:shadow-md transition border border-gray-200">
                      <img
                        src={art.imageUrl}
                        alt={art.title}
                        className="h-32 w-full object-cover rounded-lg mb-2 shadow-sm"
                      />
                      <h4 className="font-bold text-gray-900 truncate">{art.title}</h4>
                      <p className="text-blue-600 text-sm font-semibold">{art.views} Views</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Selling Artworks */}
              <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Top 5 Selling Artworks</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.topSellingArtworks}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="title" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sales" fill="#10b981" name="Sales Count" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Users/Artists Tab */}
          {activeTab === 'users' && (
            <div>
              <ArtistsManagement />
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
