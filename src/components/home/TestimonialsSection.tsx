import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { TestimonialCard } from '../common/TestimonialCard';
import { DimensionalHeading } from '../common/DimensionalHeading';

interface TestimonialsSectionProps {
  navigate: (path: string) => void;
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ navigate }) => {
  const { testimonials } = useCMS();
  const verifiedTestimonials = testimonials.filter((t) => t.verified);

  if (verifiedTestimonials.length === 0) return null;

  return (
    <section className="py-24 bg-[#101010] border-b border-[#3A332D] relative overflow-hidden">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#F2EDE4_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <DimensionalHeading
            eyebrow="05 // CLIENT TRUST"
            subtitle="Real feedback from brand founders and creative directors who collaborated with Tayyabs.Designs."
          >
            Verified Client Feedback
          </DimensionalHeading>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {verifiedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
};



