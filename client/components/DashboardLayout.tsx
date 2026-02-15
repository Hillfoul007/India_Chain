import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Wallet,
  Truck,
  TrendingUp,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { icon: BarChart3, label: 'Overview', path: '/dashboard' },
  { icon: Wallet, label: 'DID Wallet', path: '/dashboard/wallet' },
  { icon: Truck, label: 'Smart Logistics', path: '/dashboard/logistics' },
  { icon: TrendingUp, label: 'AI Credit Score', path: '/dashboard/credit' },
  { icon: MessageSquare, label: 'AI Chat', path: '/dashboard/chat' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate('/auth/login');
        return;
      }
      setUser(data.session.user);
      setLoading(false);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session && event === 'SIGNED_OUT') {
        navigate('/auth/login');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-white/10 z-40">
        <div className="h-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">IC</span>
              </div>
              <h1 className="text-xl font-bold font-display text-white hidden sm:block">IndiaChain</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">
                  {user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-gray-400">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 250 : 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-16 bottom-0 bg-background border-r border-white/10 overflow-hidden z-30 md:relative md:width-auto"
          style={{
            width: sidebarOpen ? 250 : 0,
          }}
        >
          <div className="w-250 h-full flex flex-col p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <motion.button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false); // Close sidebar on mobile after click
                  }}
                  whileHover={{ x: 4 }}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-3 text-left ${
                    isActive
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 w-full md:w-auto overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
