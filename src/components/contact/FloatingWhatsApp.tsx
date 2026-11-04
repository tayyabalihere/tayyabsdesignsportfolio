import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useCMS } from '../../context/CMSContext';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useCMS();
  const cleanNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');

  return (
    <a
      href={`https://wa.me/${cleanNumber}?text=${encodeURIComponent(settings.whatsappMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp with Tayyabs.Designs"
      id="floating-whatsapp-btn"
      className="fixed bottom-6 right-6 z-40 p-3.5 bg-[#101010] border border-[#F2EDE4]/40 hover:border-[#F2EDE4] text-[#F2EDE4] hover:text-[#F2EDE4] rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2 metallic-glass group"
    >
      <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform text-[#F2EDE4]" />
      <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider pr-1">
        WhatsApp Us
      </span>
    </a>
  );
};




