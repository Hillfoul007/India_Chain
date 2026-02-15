import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const benefits = [
    { icon: '🆔', title: 'Get DID Address', description: 'Your unique blockchain identity' },
    { icon: '🔐', title: 'Private KYC', description: 'Zero-knowledge verification' },
    { icon: '📦', title: 'Track Shipments', description: 'Build delivery reputation' },
    { icon: '📊', title: 'AI Credit Score', description: 'Fair, transparent scoring' },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!email || !password || !displayName) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-5xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Benefits Section - Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden md:block"
          >
            <Link to="/">
              <button className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </Link>

            <h2 className="text-4xl font-bold font-display text-white mb-4">
              Join <span className="text-gradient">IndiaChain</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Get instant access to decentralized trade finance with transparent credit scoring
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
                  className="glass-card p-4 rounded-lg flex items-start gap-4"
                >
                  <div className="text-3xl flex-shrink-0">{benefit.icon}</div>
                  <div>
                    <h3 className="font-bold text-white">{benefit.title}</h3>
                    <p className="text-gray-400 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Signup Form - Right */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto md:mx-0"
          >
            {/* Mobile back button */}
            <Link to="/" className="md:hidden">
              <button className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </button>
            </Link>

            <div className="glass-card p-8 rounded-2xl">
              <h1 className="text-3xl font-bold font-display text-white mb-2">Create Account</h1>
              <p className="text-gray-400 mb-8">Join IndiaChain and access trade finance</p>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                >
                  {error}
                </motion.div>
              )}

              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400"
                >
                  {success}
                </motion.div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                      disabled={loading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300 mt-6"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <p className="text-center text-gray-400 mt-6">
                Already have an account?{' '}
                <Link to="/auth/login" className="text-orange-400 hover:text-orange-300 transition">
                  Sign In
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
