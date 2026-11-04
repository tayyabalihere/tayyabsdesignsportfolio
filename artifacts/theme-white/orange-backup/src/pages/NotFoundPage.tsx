import React from 'react';
import { ArrowLeft, Home } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
  message?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate, message }) => {
  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center space-y-6">
        <span className="font-editorial-heading font-black text-7xl md:text-9xl text-[#D1C7BB]/20 block">
          404
        </span>

        <h1 className="text-2xl md:text-3xl font-editorial-heading font-black text-[#F2EDE4]">
          Page or Resource Not Found
        </h1>

        <p className="text-xs text-[#A99E92] leading-relaxed">
          {message || 'The apparel case study, brand page, or section you requested does not exist or has been moved.'}
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-widest rounded hover:bg-[#E98156] transition-colors inline-flex items-center gap-2"
          >
            <Home className="w-4 h-4" /> Go to Homepage
          </button>

          <button
            onClick={() => navigate('/work')}
            className="px-6 py-3 liquid-glass bg-[#171614] border border-[#D1C7BB]/30 text-[#D1C7BB] font-bold text-xs uppercase tracking-widest rounded hover:border-[#F2EDE4] transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> View Selected Work
          </button>
        </div>
      </div>
    </div>
  );
};



