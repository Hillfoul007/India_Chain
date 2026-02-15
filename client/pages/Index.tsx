import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Wallet, Truck, TrendingUp, Database } from 'lucide-react';

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-orange-500/5 via-transparent to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <span className="text-gradient">IndiaChain</span>
            <br />
            <span className="text-white">Decentralized Trade Finance</span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Empowering MSMEs, Drivers, and Lenders with blockchain-backed trade finance
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link to="/auth/signup">
              <button className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/auth/login">
              <button className="px-8 py-4 glass-card hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300">
                Sign In
              </button>
            </Link>
          </motion.div>

          {/* Indian flag colors accent */}
          <div className="h-1 w-48 mx-auto rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600" />
        </motion.div>
      </div>
    </section>
  );
};

const WhyIndiaChain = () => {
  const benefits = [
    {
      title: 'Decentralized Trust',
      description: 'No intermediaries needed. Trade on a transparent, immutable blockchain system.',
      icon: '🔐'
    },
    {
      title: 'Instant Settlement',
      description: 'Get paid instantly with DID-based wallets. No waiting for bank transfers.',
      icon: '⚡'
    },
    {
      title: 'Transparent Verification',
      description: 'Zero-knowledge proofs verify identity and creditworthiness without revealing data.',
      icon: '✓'
    },
    {
      title: 'Fair Credit Access',
      description: 'AI-powered credit scores give everyone access to fair financing options.',
      icon: '📊'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 text-white">
            Why <span className="text-gradient">IndiaChain</span>?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Traditional trade finance is broken. We're rebuilding it with blockchain, AI, and zero-knowledge proofs.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card-hover p-8"
            >
              <div className="text-4xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold font-display text-white mb-3">{benefit.title}</h3>
              <p className="text-gray-400">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pillars = () => {
  const pillars = [
    {
      icon: Wallet,
      title: 'DID Wallet',
      description: 'Self-sovereign digital identity with secure wallet management and transaction history',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: Truck,
      title: 'Smart Logistics',
      description: 'Real-time shipment tracking with IPFS proof storage and automated status updates',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      title: 'AI Credit Score',
      description: 'Fair credit assessment based on on-chain activity, KYC, and trade history',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Database,
      title: 'IPFS Storage',
      description: 'Decentralized document storage for proofs, certificates, and shipping records',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 text-white">
            Four Pillars of <span className="text-gradient">IndiaChain</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {pillars.map((pillar, index) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ translateY: -5 }}
                className="glass-card-hover p-8 group"
              >
                <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${pillar.color} mb-6`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold font-display text-white mb-3">{pillar.title}</h3>
                <p className="text-gray-400">{pillar.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const Beneficiaries = () => {
  const groups = [
    {
      title: 'MSMEs',
      description: 'Access low-cost trade financing and fair credit scoring for working capital',
      benefits: ['Quick funding', 'Fair rates', 'Transparent terms']
    },
    {
      title: 'Drivers',
      description: 'Get paid instantly for deliveries with DID-based identity and rating',
      benefits: ['Instant payments', 'Reputation building', 'Fair tracking']
    },
    {
      title: 'Lenders',
      description: 'Deploy capital efficiently with AI-verified borrowers and risk assessment',
      benefits: ['Better returns', 'Low risk', 'Transparent defaults']
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 text-white">
            For Everyone in the Ecosystem
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {groups.map((group, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="glass-card-hover p-8"
            >
              <h3 className="text-2xl font-bold font-display text-orange-400 mb-3">{group.title}</h3>
              <p className="text-gray-400 mb-6">{group.description}</p>
              <ul className="space-y-2">
                {group.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-6 text-white">
            Ready to Join the Revolution?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Start your journey with IndiaChain today. Get verified, access fair credit, and trade with confidence.
          </p>
          <Link to="/auth/signup">
            <button className="px-10 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 group mx-auto">
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">IndiaChain</h3>
            <p className="text-gray-400">Decentralized trade finance for India's future</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Features</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">About</a></li>
              <li><a href="#" className="hover:text-white transition">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">&copy; 2024 IndiaChain. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Discord</a>
            <a href="#" className="text-gray-400 hover:text-white transition">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function Index() {
  return (
    <div className="bg-background min-h-screen overflow-hidden">
      <Hero />
      <WhyIndiaChain />
      <Pillars />
      <Beneficiaries />
      <CTA />
      <Footer />
    </div>
  );
}
