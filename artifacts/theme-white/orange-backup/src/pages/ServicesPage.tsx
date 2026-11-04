import React from 'react';
import { CheckCircle2, ArrowUpRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

interface ServicesPageProps {
  navigate: (path: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate }) => {
  const { services } = useCMS();

  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="border-b border-[#D1C7BB]/15 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92] block mb-2">
              Capabilities & Offerings
            </span>
            <h1 className="text-4xl sm:text-6xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight">
              Apparel Design Services
            </h1>
          </div>

          <p className="text-xs text-[#A99E92] max-w-sm">
            11 specialized apparel design services crafted for fashion founders, boutique streetwear labels, and global clothing brands.
          </p>
        </div>

        <div className="space-y-12">
          {services.map((srv, idx) => (
            <div
              key={srv.id}
              className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-8 md:p-10 rounded-2xl space-y-6 hover:border-[#D1C7BB]/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#D1C7BB]/10 pb-4">
                <div className="flex min-w-0 flex-col sm:flex-row sm:items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#D1C7BB] bg-[#201C18] px-2.5 py-1 border border-[#D1C7BB]/20 rounded">
                    0{idx + 1}
                  </span>
                  <h2 className="font-editorial-heading font-black text-2xl md:text-3xl text-[#F2EDE4]">
                    {srv.title}
                  </h2>
                </div>

                <button
                  onClick={() => navigate('/contact')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-wider rounded hover:bg-[#E98156] transition-colors"
                >
                  Start Project <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-sm text-[#D1C7BB]/90 font-light leading-relaxed">
                {srv.fullDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
                <div className="space-y-2">
                  <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                    What Is Included
                  </span>
                  <ul className="space-y-1.5 text-[#A99E92]">
                    {srv.whatIsIncluded.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#D1C7BB] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                    Suitable For
                  </span>
                  <p className="text-[#A99E92] leading-relaxed">{srv.suitableFor}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-[#F2EDE4] uppercase tracking-wider block">
                    Deliverables
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {srv.deliverables.map((del, i) => (
                      <span
                        key={i}
                        className="text-[10px] uppercase font-bold text-[#D1C7BB] bg-[#101010] px-2 py-0.5 rounded border border-[#D1C7BB]/20"
                      >
                        {del}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};



