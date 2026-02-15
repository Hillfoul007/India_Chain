import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';

interface PlaceholderProps {
  title: string;
}

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Zap className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <h1 className="text-4xl font-bold font-display text-white mb-4">
          {title}
        </h1>

        <p className="text-gray-400 mb-8">
          This page is coming soon! Tell us what you'd like to see here, and we'll build it for you.
        </p>

        <div className="space-y-3">
          <p className="text-sm text-gray-500">
            Continue prompting to fill in this page's contents
          </p>
          <Link to="/">
            <button className="w-full px-6 py-3 glass-card hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
