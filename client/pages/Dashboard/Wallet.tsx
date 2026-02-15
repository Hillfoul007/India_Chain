import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Copy, Check, Shield, Loader } from 'lucide-react';

interface Wallet {
  id: string;
  did_address: string;
  wallet_balance: number;
  kyc_status: string;
  kyc_verified_at?: string;
}

interface KYCRecord {
  id: string;
  status: string;
  proof_hash?: string;
  verified_at?: string;
  created_at: string;
}

export default function Wallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([]);
  const [copied, setCopied] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        setUser(authData.session.user);

        // Fetch wallet
        const { data: walletData } = await supabase
          .from('wallets')
          .select('*')
          .eq('user_id', authData.session.user.id)
          .single();

        // Fetch KYC records
        const { data: kycData } = await supabase
          .from('kyc_verifications')
          .select('*')
          .eq('user_id', authData.session.user.id)
          .order('created_at', { ascending: false });

        if (walletData) setWallet(walletData);
        if (kycData) setKycRecords(kycData);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.did_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const startKYCVerification = async () => {
    if (!user || !wallet) return;

    setVerifying(true);
    try {
      // Create KYC verification record
      const { data: kycRecord } = await supabase
        .from('kyc_verifications')
        .insert({
          user_id: user.id,
          verification_type: 'zk-kyc',
          status: 'pending',
        })
        .select()
        .single();

      // Simulate ZK-KYC verification process (3 second delay)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Generate proof hash
      const proofHash = `zk:${Math.random().toString(16).substr(2, 32)}`;

      // Update KYC record with verification
      await supabase
        .from('kyc_verifications')
        .update({
          status: 'verified',
          proof_hash: proofHash,
          verified_at: new Date().toISOString(),
        })
        .eq('id', kycRecord.id);

      // Update wallet KYC status
      await supabase
        .from('wallets')
        .update({
          kyc_status: 'verified',
          kyc_verified_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      // Refresh data
      const { data: updatedWallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const { data: updatedKyc } = await supabase
        .from('kyc_verifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (updatedWallet) setWallet(updatedWallet);
      if (updatedKyc) setKycRecords(updatedKyc);
    } catch (error) {
      console.error('KYC verification error:', error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-display text-white mb-2">DID Wallet</h1>
          <p className="text-gray-400">Manage your decentralized identity and wallet</p>
        </div>

        {wallet && (
          <>
            {/* DID Address Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-8 rounded-xl mb-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-400" />
                <h2 className="text-lg font-semibold font-display text-white">DID Address</h2>
              </div>
              <p className="text-gray-400 text-sm mb-4">Your unique decentralized identifier</p>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
                <code className="flex-1 text-orange-400 font-mono text-sm break-all">
                  {wallet.did_address}
                </code>
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

            {/* Wallet Balance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-8 rounded-xl mb-8"
            >
              <h2 className="text-lg font-semibold font-display text-white mb-4">Wallet Balance</h2>
              <div className="text-4xl font-bold text-gradient mb-2">
                ₹{wallet.wallet_balance.toFixed(2)}
              </div>
              <p className="text-gray-400 text-sm">Available for trading and settlements</p>
            </motion.div>

            {/* KYC Verification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 rounded-xl mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold font-display text-white mb-2">
                    KYC Verification
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Status:{' '}
                    <span
                      className={`font-semibold ${
                        wallet.kyc_status === 'verified'
                          ? 'text-green-400'
                          : wallet.kyc_status === 'rejected'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {wallet.kyc_status.charAt(0).toUpperCase() + wallet.kyc_status.slice(1)}
                    </span>
                  </p>
                </div>
              </div>

              {wallet.kyc_status !== 'verified' ? (
                <button
                  onClick={startKYCVerification}
                  disabled={verifying}
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {verifying ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Verifying with Zero-Knowledge Proofs...
                    </>
                  ) : (
                    'Start ZK-KYC Verification'
                  )}
                </button>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <p className="text-green-400 font-semibold">
                    ✓ KYC Verified on {new Date(wallet.kyc_verified_at!).toLocaleDateString()}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Verification History */}
            {kycRecords.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="glass-card p-8 rounded-xl"
              >
                <h2 className="text-lg font-semibold font-display text-white mb-6">
                  Verification History
                </h2>
                <div className="space-y-4">
                  {kycRecords.map((record) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              record.status === 'verified'
                                ? 'bg-green-400'
                                : record.status === 'rejected'
                                  ? 'bg-red-400'
                                  : 'bg-yellow-400'
                            }`}
                          />
                          <span className="text-sm font-medium text-white">
                            ZK-KYC Verification
                          </span>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            record.status === 'verified'
                              ? 'bg-green-500/20 text-green-400'
                              : record.status === 'rejected'
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {new Date(record.created_at).toLocaleString()}
                      </p>
                      {record.proof_hash && (
                        <p className="text-xs text-gray-400 mt-2 font-mono break-all">
                          Proof: {record.proof_hash}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
