import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { Send, Loader } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

const systemPrompt = `You are IndiaChain's AI assistant, an expert in decentralized trade finance. You help users understand and use IndiaChain's features:

- DID Wallet: Decentralized identity management with self-sovereign control
- Smart Logistics: Real-time shipment tracking with IPFS proof storage
- AI Credit Score: Fair credit assessment based on on-chain activity, KYC verification, and trading history
- IPFS Storage: Decentralized storage for documents, certificates, and shipping records
- ZK-KYC: Zero-knowledge proof verification for privacy-preserving identity verification

Always be helpful, professional, and focused on helping MSMEs, drivers, and lenders access fair trade finance. Explain blockchain concepts in simple terms when needed.`;

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: authData } = await supabase.auth.getSession();
      if (authData?.session?.user) {
        setUser(authData.session.user);

        // Fetch chat history
        const { data: chatData } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('user_id', authData.session.user.id)
          .order('created_at', { ascending: true });

        if (chatData) {
          setMessages(chatData);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage = input;
    setInput('');
    setLoading(true);
    setStreamingText('');

    try {
      // Save user message
      const { data: savedMessage } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          role: 'user',
          content: userMessage,
        })
        .select()
        .single();

      if (savedMessage) {
        setMessages([...messages, savedMessage]);
      }

      // Call the edge function for streaming
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: userMessage,
          systemPrompt,
        }),
      });

      if (!response.ok) {
        // Fallback: Mock response if edge function doesn't exist
        const mockResponse = `I understand you asked: "${userMessage}". 

IndiaChain is a decentralized trade finance platform designed for India's MSMEs, drivers, and lenders. Here are some key features:

1. **DID Wallet**: Your self-sovereign digital identity for secure transactions
2. **Smart Logistics**: Real-time shipment tracking with blockchain verification
3. **AI Credit Score**: Fair credit assessment based on your on-chain activity
4. **IPFS Storage**: Decentralized storage for your important documents

How can I help you learn more about these features?`;

        setStreamingText(mockResponse);

        // Save assistant message
        await supabase.from('chat_messages').insert({
          user_id: user.id,
          role: 'assistant',
          content: mockResponse,
        });

        setMessages([
          ...messages,
          {
            id: Math.random().toString(),
            role: 'assistant',
            content: mockResponse,
            created_at: new Date().toISOString(),
          },
        ]);
        setStreamingText('');
      } else {
        // Handle streaming response
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = '';

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            fullText += chunk;
            setStreamingText(fullText);
          }
        }

        // Save assistant message
        if (fullText) {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            role: 'assistant',
            content: fullText,
          });

          setMessages([
            ...messages,
            {
              id: Math.random().toString(),
              role: 'assistant',
              content: fullText,
              created_at: new Date().toISOString(),
            },
          ]);
        }
        setStreamingText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
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
        className="h-screen flex flex-col max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold font-display text-white mb-2">AI Chat Assistant</h1>
          <p className="text-gray-400">Ask me anything about IndiaChain</p>
        </div>

        {/* Messages Container */}
        <div className="flex-1 glass-card rounded-xl p-6 mb-6 overflow-y-auto flex flex-col">
          {messages.length === 0 && !streamingText ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Start a Conversation</h3>
                <p className="text-gray-500 max-w-sm">
                  Ask me about DID wallets, smart logistics, AI credit scoring, or anything else about
                  IndiaChain
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-orange-500/20 text-orange-100 border border-orange-500/30'
                        : 'bg-white/10 text-gray-100 border border-white/20'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}

              {streamingText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start mb-4"
                >
                  <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-white/10 text-gray-100 border border-white/20">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingText}</p>
                    <p className="text-xs mt-1 opacity-70">Just now</p>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-all duration-300 flex items-center gap-2"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </motion.div>
    </DashboardLayout>
  );
}
