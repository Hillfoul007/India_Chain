import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { TrendingUp, Loader, Zap } from 'lucide-react';

interface CreditScore {
  score: number;
  factors: {
    delivery_reliability: number;
    kyc_trust: number;
    activity_volume: number;
    financial_health: number;
  };
  analysis: string;
}

const ScoreGauge = ({ score }: { score: number }) => {
  const percentage = (score / 1000) * 100;
  const rotation = (percentage / 100) * 180 - 90;

  const getColor = (score: number) => {
    if (score >= 800) return '#10b981'; // green
    if (score >= 600) return '#3b82f6'; // blue
    if (score >= 400) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 mb-8">
        <svg width="256" height="256" viewBox="0 0 256 256" className="transform -rotate-90">
          {/* Background arc */}
          <circle
            cx="128"
            cy="128"
            r="100"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            strokeDasharray="314"
            strokeDashoffset="0"
          />
          {/* Score arc */}
          <motion.circle
            cx="128"
            cy="128"
            r="100"
            fill="none"
            stroke={getColor(score)}
            strokeWidth="12"
            strokeDasharray="314"
            initial={{ strokeDashoffset: 314 }}
            animate={{ strokeDashoffset: 314 - (percentage / 100) * 314 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center"
          >
            <div className="text-5xl font-bold font-display text-white">{score}</div>
            <div className="text-sm text-gray-400 mt-1">out of 1000</div>
          </motion.div>
        </div>
      </div>

      {/* Score label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className={`text-lg font-semibold ${
          score >= 800
            ? 'text-green-400'
            : score >= 600
              ? 'text-blue-400'
              : score >= 400
                ? 'text-amber-400'
                : 'text-red-400'
        }`}
      >
        {score >= 800
          ? 'Excellent'
          : score >= 600
            ? 'Good'
            : score >= 400
              ? 'Fair'
              : 'Poor'}
      </motion.div>
    </div>
  );
};

const FactorBar = ({
  label,
  value,
  index,
}: {
  label: string;
  value: number;
  index: number;
}) => {
  const percentage = (value / 100) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-orange-400">{value}%</span>
      </div>
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
        />
      </div>
    </motion.div>
  );
};

export default function CreditScore() {
  const [creditScore, setCreditScore] = useState<CreditScore | null>(null);
  const [user, setUser] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScore = async () => {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        setUser(authData.session.user);

        try {
          const { data: scoreData } = await supabase
            .from('credit_scores')
            .select('*')
            .eq('user_id', authData.session.user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (scoreData) {
            setCreditScore({
              score: scoreData.score,
              factors: scoreData.factors,
              analysis: scoreData.ai_analysis,
            });
          }
        } catch (error) {
          console.error('Error fetching credit score:', error);
        }
      }
    };

    fetchScore();
  }, []);

  const analyzeCreditScore = async () => {
    if (!user) return;

    setAnalyzing(true);
    setLoading(true);

    try {
      // Fetch user data for analysis
      const { data: wallet } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { count: shipmentCount } = await supabase
        .from('shipments')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);

      const { count: deliveredCount } = await supabase
        .from('shipments')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'delivered');

      // Simulate AI analysis with delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Calculate mock credit score based on on-chain activity
      const deliveryReliability = deliveredCount ? Math.min(100, (deliveredCount / (shipmentCount || 1)) * 100) : 0;
      const kycTrust = wallet?.kyc_status === 'verified' ? 95 : 30;
      const activityVolume = Math.min(100, ((shipmentCount || 0) / 10) * 100);
      const financialHealth = wallet ? Math.min(100, (wallet.wallet_balance / 100000) * 100) : 0;

      const score = Math.round(
        (deliveryReliability * 0.3 +
          kycTrust * 0.3 +
          activityVolume * 0.2 +
          financialHealth * 0.2) *
          10
      );

      const analysis = `Based on your on-chain activity: You have completed ${deliveredCount || 0} deliveries with a ${deliveryReliability.toFixed(1)}% success rate. Your KYC status is ${wallet?.kyc_status || 'pending'} and you have ${shipmentCount || 0} total shipments. Current balance: ₹${wallet?.wallet_balance.toFixed(2) || '0.00'}.`;

      const newScore: CreditScore = {
        score,
        factors: {
          delivery_reliability: Math.round(deliveryReliability),
          kyc_trust: kycTrust,
          activity_volume: Math.round(activityVolume),
          financial_health: Math.round(financialHealth),
        },
        analysis,
      };

      // Save to database
      await supabase.from('credit_scores').insert({
        user_id: user.id,
        score: newScore.score,
        factors: newScore.factors,
        ai_analysis: newScore.analysis,
      });

      setCreditScore(newScore);
    } catch (error) {
      console.error('Error analyzing credit score:', error);
      alert('Failed to analyze credit score');
    } finally {
      setAnalyzing(false);
      setLoading(false);
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
          <h1 className="text-4xl font-bold font-display text-white mb-2">AI Credit Score</h1>
          <p className="text-gray-400">AI-powered analysis of your creditworthiness</p>
        </div>

        {creditScore ? (
          <>
            {/* Score Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="glass-card p-12 rounded-xl mb-8"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
                {/* Gauge */}
                <div className="flex-1">
                  <ScoreGauge score={creditScore.score} />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold font-display text-white mb-6">Your Score</h2>

                  <div className="space-y-4 mb-8">
                    <FactorBar
                      label="Delivery Reliability"
                      value={creditScore.factors.delivery_reliability}
                      index={0}
                    />
                    <FactorBar
                      label="KYC Trust"
                      value={creditScore.factors.kyc_trust}
                      index={1}
                    />
                    <FactorBar
                      label="Activity Volume"
                      value={creditScore.factors.activity_volume}
                      index={2}
                    />
                    <FactorBar
                      label="Financial Health"
                      value={creditScore.factors.financial_health}
                      index={3}
                    />
                  </div>

                  <button
                    onClick={analyzeCreditScore}
                    disabled={analyzing}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {analyzing ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Re-analyze Score
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-card p-8 rounded-xl"
            >
              <h3 className="text-xl font-bold font-display text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-400" />
                AI Analysis
              </h3>
              <p className="text-gray-300 leading-relaxed">{creditScore.analysis}</p>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-12 rounded-xl text-center"
          >
            <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Score Yet</h3>
            <p className="text-gray-500 mb-8">
              Get your first AI-powered credit score based on your on-chain activity
            </p>
            <button
              onClick={analyzeCreditScore}
              disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze My Score
                </>
              )}
            </button>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
