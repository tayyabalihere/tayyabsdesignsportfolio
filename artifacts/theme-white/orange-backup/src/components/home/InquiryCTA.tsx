import React from 'react';
import { gmailInquiryUrl } from '../../data/contactLinks';
import { MessageSquare, Mail, Calendar, FileText } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';
import { DimensionalHeading } from '../common/DimensionalHeading';

interface InquiryCTAProps {
  navigate: (path: string) => void;
}

export const InquiryCTA: React.FC<InquiryCTAProps> = ({ navigate }) => {
  const { settings } = useCMS();

  return (
    <section className="py-24 bg-[#101010] relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#F2EDE4]/[0.02] blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(#F2EDE4_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div
          style={{ transform: 'perspective(1000px) translateZ(10px)' }}
          className="max-w-4xl mx-auto space-y-8 liquid-glass bg-[#171614] border border-[#3A332D] hover:border-[#F2EDE4]/40 p-10 md:p-16 rounded-xl shadow-2xl transition-all"
        >
          <DimensionalHeading
            eyebrow="START YOUR NEXT CLOTHING DROP"
            subtitle="Whether you need a standalone hero streetwear graphic, full seasonal collection creative direction, or production-ready tech packs, select your preferred way to connect."
          >
            Have a collection or brand idea in mind? Let's build it.
          </DimensionalHeading>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            <button
              type="button"
              data-cursor="contact"
              onClick={() => navigate('/contact')}
              id="cta-start-brief-btn"
              className="flex flex-col items-center justify-center p-6 bg-[#D96A3B] text-[#101010] hover:bg-[#D1C7BB] transition-all rounded-xl font-bold group shadow-xl hover:-translate-y-1 cursor-pointer"
            >
              <FileText className="w-6 h-6 mb-2 text-[#101010]" />
              <span className="text-xs uppercase tracking-wider">Start Project Brief</span>
              <span className="text-[10px] font-normal opacity-80 mt-1">Detailed Requirements</span>
            </button>

            <a
              data-cursor="contact"
              href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-whatsapp-btn"
              className="flex flex-col items-center justify-center p-6 bg-[#101010] border border-[#3A332D] text-[#F2EDE4] hover:border-[#F2EDE4] transition-all rounded-xl group shadow-lg hover:-translate-y-1"
            >
              <MessageSquare className="w-6 h-6 mb-2 text-[#F2EDE4]" />
              <span className="text-xs uppercase tracking-wider font-bold">WhatsApp Chat</span>
              <span className="text-[10px] text-[#A99E92] mt-1">Instant Direct Chat</span>
            </a>

            <a
              data-cursor="contact"
              href={settings.consultationLink}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-consultation-btn"
              className="flex flex-col items-center justify-center p-6 bg-[#101010] border border-[#3A332D] text-[#F2EDE4] hover:border-[#F2EDE4] transition-all rounded-xl group shadow-lg hover:-translate-y-1"
            >
              <Calendar className="w-6 h-6 mb-2 text-[#F2EDE4]" />
              <span className="text-xs uppercase tracking-wider font-bold">Book Call</span>
              <span className="text-[10px] text-[#A99E92] mt-1">Video Strategy</span>
            </a>

            <a
              data-cursor="contact"
              href={gmailInquiryUrl(settings.emailAddress)}
              target="_blank"
              rel="noopener noreferrer"
              id="cta-email-btn"
              className="flex flex-col items-center justify-center p-6 bg-[#101010] border border-[#3A332D] text-[#F2EDE4] hover:border-[#F2EDE4] transition-all rounded-xl group shadow-lg hover:-translate-y-1"
            >
              <Mail className="w-6 h-6 mb-2 text-[#F2EDE4]" />
              <span className="text-xs uppercase tracking-wider font-bold">Direct Email</span>
              <span className="text-[10px] text-[#A99E92] mt-1">{settings.emailAddress}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};



