import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Wallet, Ship, Shield, TrendingUp, Copy, Check, Truck } from 'lucide-react';

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
  hint,
}: {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  hint?: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="glass-card p-6 rounded-xl hover:bg-white/10 transition-all duration-300"
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {hint && (
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-gray-300">
          {hint}
        </span>
      )}
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

  const creditScoreFactors = [
    { name: 'Delivery Reliability', value: '30%', icon: '📦' },
    { name: 'KYC Trust', value: '30%', icon: '🔐' },
    { name: 'Activity Volume', value: '20%', icon: '📈' },
    { name: 'Financial Health', value: '20%', icon: '💳' },
  ];

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
          <p className="text-gray-400 text-sm mb-4">Your unique Decentralized Identifier on the blockchain</p>
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

        {/* Credit Score Factors Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 rounded-xl mb-8 bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20"
        >
          <h2 className="text-lg font-semibold font-display text-white mb-4">📊 How Your Credit Score is Calculated</h2>
          <p className="text-gray-400 text-sm mb-6">
            Your score (0-1000) is based on 4 transparent factors. No hidden algorithms - you control your score through your actions.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {creditScoreFactors.map((factor, index) => (
              <div key={index} className="text-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition">
                <div className="text-3xl mb-2">{factor.icon}</div>
                <p className="text-gray-400 text-xs font-semibold mb-1">{factor.name}</p>
                <p className="text-orange-400 font-bold text-sm">{factor.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 rounded-lg bg-black/30 border border-white/10">
            <p className="text-gray-400 text-xs font-mono">
              Score = (Reliability×0.3 + KYC×0.3 + Activity×0.2 + Financial×0.2) × 10
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Wallet}
            label="Wallet Balance"
            value={`₹${stats.walletBalance.toFixed(2)}`}
            color="from-orange-500 to-amber-500"
            hint={stats.walletBalance > 0 ? "Active" : "Fund wallet"}
          />
          <StatCard
            icon={Ship}
            label="Total Shipments"
            value={stats.shipmentCount}
            color="from-green-500 to-emerald-500"
            hint={stats.shipmentCount > 0 ? "On track" : "Create first"}
          />
          <StatCard
            icon={Shield}
            label="KYC Status"
            value={stats.kycStatus.charAt(0).toUpperCase() + stats.kycStatus.slice(1)}
            color="from-blue-500 to-cyan-500"
            hint={stats.kycStatus === 'verified' ? "Secure" : "Verify now"}
          />
          <StatCard
            icon={TrendingUp}
            label="Credit Score"
            value={stats.creditScore > 0 ? stats.creditScore : '—'}
            color="from-purple-500 to-pink-500"
            hint={stats.creditScore > 750 ? "Excellent" : stats.creditScore > 500 ? "Good" : "Build it"}
          />
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold font-display text-white mb-6">Next Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/dashboard/wallet">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 glass-card hover:bg-orange-500/10 text-white font-semibold rounded-lg transition-all duration-300 border border-white/10 hover:border-orange-500/50 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Step 1</p>
                    <p className="font-display text-lg">Verify KYC</p>
                  </div>
                  <Shield className={`w-5 h-5 ${stats.kycStatus === 'verified' ? 'text-green-400' : 'text-orange-400'}`} />
                </div>
              </motion.button>
            </a>
            <a href="/dashboard/logistics">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 glass-card hover:bg-green-500/10 text-white font-semibold rounded-lg transition-all duration-300 border border-white/10 hover:border-green-500/50 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Step 2</p>
                    <p className="font-display text-lg">Create Shipment</p>
                  </div>
                  <Truck className={`w-5 h-5 ${stats.shipmentCount > 0 ? 'text-green-400' : 'text-green-400'}`} />
                </div>
              </motion.button>
            </a>
            <a href="/dashboard/credit">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-6 glass-card hover:bg-purple-500/10 text-white font-semibold rounded-lg transition-all duration-300 border border-white/10 hover:border-purple-500/50 text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Step 3</p>
                    <p className="font-display text-lg">Get Credit Score</p>
                  </div>
                  <TrendingUp className={`w-5 h-5 ${stats.creditScore > 0 ? 'text-green-400' : 'text-purple-400'}`} />
                </div>
              </motion.button>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
