import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, RotateCcw, ArrowUpDown } from 'lucide-react';
import { useCMS } from '../context/CMSContext';
import { ProjectCard } from '../components/common/ProjectCard';
import { DimensionalHeading } from '../components/common/DimensionalHeading';

interface WorkPageProps {
  navigate: (path: string) => void;
  queryParams?: Record<string, string>;
}

export const WorkPage: React.FC<WorkPageProps> = ({ navigate, queryParams = {} }) => {
  const { projects: cmsProjects } = useCMS();
  // Fill the nine-piece selection with original detail studies when the archive
  // has fewer projects. These link to their existing parent case study.
  const projects = useMemo(() => {
    const published = cmsProjects.filter(project => !project.isDraft);
    const heritage = published.find(project => project.slug === 'rebel-x-outfits-la-makan');
    if (!heritage || published.length >= 9) return published;
    const studies = [
      { id: 'la-makan-front-study', title: 'La–Makan / Front Graphic Study', image: heritage.mockups.frontMockup },
      { id: 'la-makan-back-study', title: 'La–Makan / Back Graphic Study', image: heritage.mockups.backMockup },
    ].filter(study => study.image).map(study => ({
      ...heritage,
      id: study.id,
      title: study.title,
      mockups: { ...heritage.mockups, heroMockup: study.image! },
    }));
    return [...published, ...studies.slice(0, 9 - published.length)];
  }, [cmsProjects]);

  const [selectedCategory, setSelectedCategory] = useState<string>(queryParams.category || 'all');
  const [selectedGarment, setSelectedGarment] = useState<string>(queryParams.garment || 'all');
  const [selectedYear, setSelectedYear] = useState<string>(queryParams.year || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(queryParams.search || '');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'oldest'>('featured');

  useEffect(() => {
    if (queryParams.category) setSelectedCategory(queryParams.category);
    if (queryParams.search) setSearchQuery(queryParams.search);
  }, [queryParams]);

  const updateUrl = (cat: string, garment: string, year: string, search: string) => {
    const params = new URLSearchParams();
    if (cat !== 'all') params.set('category', cat);
    if (garment !== 'all') params.set('garment', garment);
    if (year !== 'all') params.set('year', year);
    if (search.trim()) params.set('search', search.trim());

    const queryString = params.toString();
    const newPath = queryString ? `/work?${queryString}` : '/work';
    window.history.replaceState(null, '', newPath);
  };

  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      set.add(p.category);
      p.categories.forEach((c) => set.add(c));
    });
    return Array.from(set);
  }, [projects]);

  const availableGarments = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.garmentTypes.forEach((g) => set.add(g));
    });
    return Array.from(set);
  }, [projects]);

  const availableYears = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => set.add(p.year.toString()));
    return Array.from(set).sort((a, b) => b.localeCompare(a));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => !p.isDraft)
      .filter((p) => {
        if (selectedCategory !== 'all') {
          const matchCat =
            p.category.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedCategory ||
            p.categories.some((c) => c.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedCategory);
          if (!matchCat) return false;
        }

        if (selectedGarment !== 'all') {
          const matchGarment = p.garmentTypes.some(
            (g) => g.toLowerCase().replace(/[^a-z0-9]+/g, '-') === selectedGarment
          );
          if (!matchGarment) return false;
        }

        if (selectedYear !== 'all') {
          if (p.year.toString() !== selectedYear) return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchSearch =
            p.title.toLowerCase().includes(q) ||
            p.brandName.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q);
          if (!matchSearch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        }
        if (sortBy === 'newest') return (b.year as number) - (a.year as number);
        if (sortBy === 'oldest') return (a.year as number) - (b.year as number);
        return 0;
      });
  }, [projects, selectedCategory, selectedGarment, selectedYear, searchQuery, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedGarment('all');
    setSelectedYear('all');
    setSearchQuery('');
    setSortBy('featured');
    updateUrl('all', 'all', 'all', '');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedGarment !== 'all' || selectedYear !== 'all' || searchQuery !== '';

  return (
    <div className="portfolio-page pt-28 pb-24 bg-[#101010] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#3A332D] pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <DimensionalHeading
            as="h1"
            eyebrow="APPAREL DESIGN ARCHIVE"
            subtitle="Browse production-ready streetwear graphics, cultural garments, jerseys, line sheets, and tech pack case studies created for 50+ fashion brands."
          >
            Selected Work & Projects
          </DimensionalHeading>
        </div>

        <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-6 rounded-2xl space-y-6 mb-12 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-[#A99E92] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateUrl(selectedCategory, selectedGarment, selectedYear, e.target.value);
                }}
                placeholder="Search brand or project title..."
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 focus:border-[#D1C7BB] text-[#F2EDE4] text-xs pl-9 pr-3 py-2.5 rounded focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    updateUrl(selectedCategory, selectedGarment, selectedYear, '');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A99E92] hover:text-[#F2EDE4]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs uppercase font-mono tracking-widest text-[#D1C7BB]">
                Showing {Math.min(filteredProjects.length, 9)} of {filteredProjects.length} Designs
              </span>

              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#A99E92]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#101010] border border-[#D1C7BB]/20 text-[#F2EDE4] text-xs p-2 rounded focus:outline-none"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="newest">Sort by: Newest Year</option>
                  <option value="oldest">Sort by: Oldest Year</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs uppercase font-bold text-[#F2EDE4] hover:text-[#F2EDE4] border border-[#D1C7BB]/30 rounded bg-[#201C18] hover:bg-[#29231F] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-[#D1C7BB]/10">
            <span className="text-[10px] uppercase tracking-widest font-bold text-[#A99E92] block">
              Design Category Filter
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  updateUrl('all', selectedGarment, selectedYear, searchQuery);
                }}
                className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wider rounded transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#D96A3B] text-[#101010]'
                    : 'bg-[#101010] text-[#A99E92] hover:text-[#D1C7BB] border border-[#D1C7BB]/15'
                }`}
              >
                All Categories
              </button>

              {availableCategories.map((cat) => {
                const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const isSelected = selectedCategory === slug;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(slug);
                      updateUrl(slug, selectedGarment, selectedYear, searchQuery);
                    }}
                    className={`px-3 py-1.5 text-xs uppercase font-bold tracking-wider rounded transition-all ${
                      isSelected
                        ? 'bg-[#D96A3B] text-[#101010]'
                        : 'bg-[#101010] text-[#A99E92] hover:text-[#D1C7BB] border border-[#D1C7BB]/15'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#A99E92] block mb-1.5">
                Garment Type Filter
              </span>
              <select
                value={selectedGarment}
                onChange={(e) => {
                  setSelectedGarment(e.target.value);
                  updateUrl(selectedCategory, e.target.value, selectedYear, searchQuery);
                }}
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 text-[#F2EDE4] text-xs p-2.5 rounded focus:outline-none"
              >
                <option value="all">All Garment Types (Hoodies, Tees, Jerseys...)</option>
                {availableGarments.map((g) => {
                  const slug = g.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                  return (
                    <option key={g} value={slug}>
                      {g}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#A99E92] block mb-1.5">
                Release Year Filter
              </span>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  updateUrl(selectedCategory, selectedGarment, e.target.value, searchQuery);
                }}
                className="w-full bg-[#101010] border border-[#D1C7BB]/20 text-[#F2EDE4] text-xs p-2.5 rounded focus:outline-none"
              >
                <option value="all">All Project Years</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.slice(0, 9).map((project) => (
              <ProjectCard key={project.id} project={project} navigate={navigate} aspectRatio="landscape" compact />
            ))}
          </div>
        ) : (
          <div className="liquid-glass bg-[#171614] border border-[#D1C7BB]/20 p-16 rounded text-center space-y-4 my-12">
            <h3 className="font-editorial-heading font-black text-2xl text-[#F2EDE4]">
              No Projects Match Selected Filters
            </h3>
            <p className="text-xs text-[#A99E92] max-w-md mx-auto">
              We couldn't find any apparel design case studies matching your criteria "{searchQuery || selectedCategory}".
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-[#D96A3B] text-[#101010] font-bold text-xs uppercase tracking-widest rounded transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};



