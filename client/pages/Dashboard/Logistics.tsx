import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Truck, Plus, MapPin, Package, Calendar } from 'lucide-react';

interface Shipment {
  id: string;
  tracking_number: string;
  origin: string;
  destination: string;
  status: string;
  weight_kg: number;
  description: string;
  estimated_delivery: string;
  delivered_at?: string;
  created_at: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  in_transit: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  delivered: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/30' },
  failed: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function Logistics() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    weight_kg: '',
    description: '',
    estimated_delivery: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchShipments = async () => {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        setUser(authData.session.user);

        const { data: shipmentData } = await supabase
          .from('shipments')
          .select('*')
          .eq('user_id', authData.session.user.id)
          .order('created_at', { ascending: false });

        if (shipmentData) setShipments(shipmentData);
      }
    };

    fetchShipments();
  }, []);

  const generateTrackingNumber = () => {
    return `TC${Date.now().toString().slice(-10)}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  };

  const handleCreateShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.origin || !formData.destination) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const trackingNumber = generateTrackingNumber();

      const { data, error } = await supabase
        .from('shipments')
        .insert({
          user_id: user.id,
          tracking_number: trackingNumber,
          origin: formData.origin,
          destination: formData.destination,
          status: 'pending',
          weight_kg: parseFloat(formData.weight_kg) || 0,
          description: formData.description,
          estimated_delivery: formData.estimated_delivery,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setShipments([data, ...shipments]);
        setFormData({
          origin: '',
          destination: '',
          weight_kg: '',
          description: '',
          estimated_delivery: '',
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      alert('Failed to create shipment');
    } finally {
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold font-display text-white mb-2">Smart Logistics</h1>
            <p className="text-gray-400">Create and track your shipments</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Shipment
          </button>
        </div>

        {/* Create Shipment Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-8 rounded-xl mb-8"
          >
            <h2 className="text-xl font-bold font-display text-white mb-6">Create New Shipment</h2>
            <form onSubmit={handleCreateShipment} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Origin *</label>
                  <input
                    type="text"
                    required
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Starting location"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    placeholder="Delivery location"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weight_kg}
                    onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                    placeholder="0.00"
                    step="0.01"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Estimated Delivery
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.estimated_delivery}
                    onChange={(e) =>
                      setFormData({ ...formData, estimated_delivery: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Shipment contents and details"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition resize-none"
                  disabled={loading}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  {loading ? 'Creating...' : 'Create Shipment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 glass-card hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Shipments List */}
        <div className="space-y-4">
          {shipments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-12 rounded-xl text-center"
            >
              <Truck className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No shipments yet</h3>
              <p className="text-gray-500 mb-6">Create your first shipment to get started</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Shipment
              </button>
            </motion.div>
          ) : (
            shipments.map((shipment, index) => {
              const color = statusColors[shipment.status] || statusColors.pending;
              return (
                <motion.div
                  key={shipment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="glass-card p-6 rounded-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                          <Truck className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold font-display text-white">
                            {shipment.tracking_number}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(shipment.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 mt-4">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">From</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300">{shipment.origin}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">To</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-300">{shipment.destination}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-gray-400 mb-1">Details</p>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                              <Package className="w-4 h-4 text-blue-400" />
                              <span className="text-sm text-gray-300">{shipment.weight_kg} kg</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-purple-400" />
                              <span className="text-sm text-gray-300">
                                {new Date(shipment.estimated_delivery).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {shipment.description && (
                        <p className="text-sm text-gray-400 mt-4">{shipment.description}</p>
                      )}
                    </div>

                    <div className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap ${color.bg} ${color.text} border ${color.border}`}>
                      {shipment.status.replace('_', ' ').charAt(0).toUpperCase() +
                        shipment.status.replace('_', ' ').slice(1)}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
