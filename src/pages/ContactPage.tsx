import React from 'react';
import { gmailInquiryUrl } from '../data/contactLinks';
import { MessageSquare, Mail, Calendar, ArrowUpRight } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ProjectBriefForm } from '../components/contact/ProjectBriefForm';

export const ContactPage: React.FC = () => {
  const { settings } = useCMS();

  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="border-b border-[#D1C7BB]/15 pb-8 max-w-3xl">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#A99E92] block mb-2">
            Inquiry & Consultation
          </span>
          <h1 className="text-4xl sm:text-6xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight">
            Start a Clothing Project
          </h1>
          <p className="text-sm text-[#D1C7BB]/90 font-light mt-3 leading-relaxed">
            Have a collection drop, streetwear graphic concept, or tech pack requirement in mind? Fill out the project brief below or select a direct communication channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(settings.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 hover:border-[#D1C7BB] p-6 rounded-2xl transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <MessageSquare className="w-6 h-6 text-[#D1C7BB]" />
              <ArrowUpRight className="w-4 h-4 text-[#A99E92] group-hover:text-[#F2EDE4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-bold text-[#F2EDE4] text-base">WhatsApp Direct</h3>
            <p className="text-xs text-[#A99E92]">Instant messaging & fast project discussion.</p>
            <span className="block text-xs font-mono font-bold text-[#D1C7BB] pt-2">
              {settings.whatsappNumber}
            </span>
          </a>

          <a
            href={gmailInquiryUrl(settings.emailAddress)}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 hover:border-[#D1C7BB] p-6 rounded-2xl transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <Mail className="w-6 h-6 text-[#D1C7BB]" />
              <ArrowUpRight className="w-4 h-4 text-[#A99E92] group-hover:text-[#F2EDE4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-bold text-[#F2EDE4] text-base">Direct Email</h3>
            <p className="text-xs text-[#A99E92]">Send line sheets, proposals & attachments.</p>
            <span className="block text-xs font-mono font-bold text-[#D1C7BB] pt-2">
              {settings.emailAddress}
            </span>
          </a>

          <a
            href={settings.consultationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 hover:border-[#D1C7BB] p-6 rounded-2xl transition-all space-y-3 group"
          >
            <div className="flex items-center justify-between">
              <Calendar className="w-6 h-6 text-[#D1C7BB]" />
              <ArrowUpRight className="w-4 h-4 text-[#A99E92] group-hover:text-[#F2EDE4] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <h3 className="font-bold text-[#F2EDE4] text-base">Book 1-on-1 Consultation</h3>
            <p className="text-xs text-[#A99E92]">Schedule a video strategy call for full drops.</p>
            <span className="block text-xs font-mono font-bold text-[#D1C7BB] pt-2">
              Reserve Time Slot →
            </span>
          </a>
        </div>

        <div className="space-y-6">
          <div className="border-b border-[#D1C7BB]/10 pb-4">
            <h2 className="text-2xl font-editorial-heading font-black text-[#F2EDE4]">
              Detailed Project Brief Form
            </h2>
            <p className="text-xs text-[#A99E92] mt-1">
              Provides all necessary parameters to generate an accurate quote and production timeline.
            </p>
          </div>

          <ProjectBriefForm />
        </div>
      </div>
    </div>
  );
};



