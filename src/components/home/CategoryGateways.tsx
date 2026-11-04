import React from 'react';
import { useCMS } from '../../context/CMSContext';
import { CategoryCard } from '../common/CategoryCard';

interface CategoryGatewaysProps {
  navigate: (path: string) => void;
}

export const CategoryGateways: React.FC<CategoryGatewaysProps> = ({ navigate }) => {
  const { categories } = useCMS();

  return (
    <section className="py-24 bg-[#171614] border-b border-[#3A332D] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#3A332D] pb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#B6AB9F] block mb-2">
              02 // Expertise & Specializations
            </span>
            <h2 className="text-3xl sm:text-5xl font-editorial-heading font-black text-[#F2EDE4] tracking-tight">
              Design Category Gateways
            </h2>
          </div>

          <p className="text-xs text-[#B6AB9F] max-w-md">
            Every apparel discipline is executed with technical precision, custom vector typography, and production-ready artwork specifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} navigate={navigate} />
          ))}
        </div>
      </div>
    </section>
  );
};


