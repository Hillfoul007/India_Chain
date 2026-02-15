import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Wallet, Ship, Shield, TrendingUp, Copy, Check } from 'lucide-react';

interface Stats {
  walletBalance: number;
  shipmentCount: number;
  kycStatus: string;
  creditScore: number;
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="glass-card p-6 rounded-xl"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-gray-300">
        Today
      </span>
    </div>
    <p className="text-gray-400 text-sm mb-2">{label}</p>
    <h3 className="text-3xl font-bold font-display text-white">{value}</h3>
  </motion.div>
);

export default function Overview() {
  const [stats, setStats] = useState<Stats>({
    walletBalance: 0,
    shipmentCount: 0,
    kycStatus: 'pending',
    creditScore: 0,
  });
  const [user, setUser] = useState<any>(null);
  const [didAddress, setDidAddress] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);

        try {
          // Fetch wallet data
          const { data: wallet } = await supabase
            .from('wallets')
            .select('*')
            .eq('user_id', data.session.user.id)
            .maybeSingle();

          // Fetch shipments count
          const { data: shipments, count } = await supabase
            .from('shipments')
            .select('*', { count: 'exact' })
            .eq('user_id', data.session.user.id);

          // Fetch credit score
          const { data: creditData } = await supabase
            .from('credit_scores')
            .select('*')
            .eq('user_id', data.session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          setStats({
            walletBalance: wallet ? parseFloat(wallet.wallet_balance) : 0,
            shipmentCount: count || 0,
            kycStatus: wallet?.kyc_status || 'pending',
            creditScore: creditData?.score || 0,
          });

          if (wallet?.did_address) {
            setDidAddress(wallet.did_address);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(didAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-white mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-400">Here's your IndiaChain overview</p>
        </div>

        {/* DID Address Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-6 rounded-xl mb-8"
        >
          <h2 className="text-lg font-semibold font-display text-white mb-4">Your DID Address</h2>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <code className="flex-1 text-orange-400 font-mono text-sm break-all">{didAddress}</code>
            <button
              onClick={copyToClipboard}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-orange-400"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Wallet}
            label="Wallet Balance"
            value={`₹${stats.walletBalance.toFixed(2)}`}
            color="from-orange-500 to-amber-500"
          />
          <StatCard
            icon={Ship}
            label="Total Shipments"
            value={stats.shipmentCount}
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            icon={Shield}
            label="KYC Status"
            value={stats.kycStatus.charAt(0).toUpperCase() + stats.kycStatus.slice(1)}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={TrendingUp}
            label="Credit Score"
            value={stats.creditScore > 0 ? stats.creditScore : '—'}
            color="from-purple-500 to-pink-500"
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 glass-card p-8 rounded-xl"
        >
          <h2 className="text-2xl font-bold font-display text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/wallet">
              <button className="w-full p-4 glass-card hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 border border-white/10 hover:border-orange-500/30">
                Verify KYC
              </button>
            </a>
            <a href="/dashboard/logistics">
              <button className="w-full p-4 glass-card hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 border border-white/10 hover:border-green-500/30">
                Create Shipment
              </button>
            </a>
            <a href="/dashboard/credit">
              <button className="w-full p-4 glass-card hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 border border-white/10 hover:border-purple-500/30">
                Check Credit Score
              </button>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
