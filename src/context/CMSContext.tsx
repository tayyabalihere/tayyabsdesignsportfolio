import { withOriginalArtwork } from '../data/projectArtwork';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Project,
  Brand,
  Category,
  Service,
  Testimonial,
  SiteSettings,
  ApparelCategory,
  CollectionWithStats,
  ApparelProduct,
} from '../types';
import {
  initialProjects,
  initialBrands,
  initialCategories,
  initialServices,
  initialTestimonials,
  initialSiteSettings,
} from '../data/initialData';

interface CMSContextType {
  projects: Project[];
  brands: Brand[];
  categories: Category[];
  services: Service[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  isAdmin: boolean;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;

  // Projects CRUD
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectBySlug: (slug: string) => Project | undefined;

  // Brands CRUD
  addBrand: (brand: Omit<Brand, 'id'>) => Brand;
  updateBrand: (id: string, brand: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  getBrandBySlug: (slug: string) => Brand | undefined;

  // Categories CRUD
  addCategory: (category: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Testimonials CRUD
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => Testimonial;
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Settings
  updateSettings: (newSettings: Partial<SiteSettings>) => void;

  // Reset
  resetToDemoData: () => void;

  // ==========================================================
  // BRAND COLLECTIONS & APPAREL INVENTORY EXTENSIONS
  // ==========================================================
  apparelCategories: ApparelCategory[];
  collections: CollectionWithStats[];
  activeBrandId: string;
  setActiveBrandId: (brandId: string) => void;
  fetchCollections: () => Promise<void>;
  fetchCollectionsForBrand: (brandId: string) => Promise<void>;
  addCollection: (brandId: string, name: string, bannerImage: string, slug?: string, description?: string) => Promise<void>;
  updateCollection: (id: string, collectionData: Partial<CollectionWithStats>) => Promise<void>;
  toggleCollectionActive: (id: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  addApparelProduct: (productData: Omit<ApparelProduct, 'id'>) => Promise<void>;
  updateApparelProduct: (id: string, productData: Partial<ApparelProduct>) => Promise<void>;
  toggleProductPublished: (id: string) => Promise<void>;
  deleteApparelProduct: (id: string) => Promise<void>;
  addApparelCategory: (name: string) => Promise<ApparelCategory>;

  // Public Storefront Dynamic Queries
  getPublicCollections: (brandId?: string) => CollectionWithStats[];
  getPublicProducts: (collectionId?: string) => ApparelProduct[];
}

const STORAGE_KEYS = {
  PROJECTS: 'tayyabs_projects_v8',
  BRANDS: 'tayyabs_brands_v9',
  CATEGORIES: 'tayyabs_categories_v8',
  SERVICES: 'tayyabs_services_v8',
  TESTIMONIALS: 'tayyabs_testimonials_v8',
  SETTINGS: 'tayyabs_settings_v8',
  ADMIN_AUTH: 'tayyabs_admin_auth_v8',
  APPAREL_CATEGORIES: 'tayyabs_apparel_cats_v1',
};

const DEFAULT_APPAREL_CATEGORIES: ApparelCategory[] = [
  { id: 'cat-jerseys', name: 'Jerseys' },
  { id: 'cat-tshirts', name: 'T-Shirts' },
  { id: 'cat-fullsleeves', name: 'Full Sleeves' },
  { id: 'cat-hoodies', name: 'Hoodies' },
  { id: 'cat-trousers', name: 'Trousers' },
  { id: 'cat-jackets', name: 'Jackets' },
];

const CMSContext = createContext<CMSContextType | undefined>(undefined);

export const CMSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return (saved ? JSON.parse(saved) as Project[] : initialProjects).map(withOriginalArtwork);
  });

  const [brands, setBrands] = useState<Brand[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRANDS);
    return saved ? JSON.parse(saved) : initialBrands;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [services] = useState<Service[]>(initialServices);

  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    const storedSettings: SiteSettings = saved ? JSON.parse(saved) : initialSiteSettings;
    // Apply the requested contact update to browsers with existing saved settings.
    if (localStorage.getItem('tayyabs_whatsapp_revision') !== '923372993445') {
      return { ...storedSettings, whatsappNumber: initialSiteSettings.whatsappNumber };
    }
    return storedSettings;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [apparelCategories, setApparelCategories] = useState<ApparelCategory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPAREL_CATEGORIES);
    return saved ? JSON.parse(saved) : DEFAULT_APPAREL_CATEGORIES;
  });

  const [activeBrandId, setActiveBrandId] = useState<string>('brand-1');
  const [collections, setCollections] = useState<CollectionWithStats[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(brands));
  }, [brands]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    localStorage.setItem('tayyabs_whatsapp_revision', '923372993445');
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdmin ? 'true' : 'false');
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPAREL_CATEGORIES, JSON.stringify(apparelCategories));
  }, [apparelCategories]);

  // Fetch Categories from API Server on Mount
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setApparelCategories(data);
        }
      })
      .catch((err) => console.log('Using local apparel categories:', err));
  }, []);

  // Fetch All Collections across all brands
  const fetchCollections = useCallback(async () => {
    try {
      const response = await fetch('/api/collections');
      if (response.ok) {
        const collectionsData = await response.json();
        setCollections(Array.isArray(collectionsData) ? collectionsData : []);
      }
    } catch (err) {
      console.warn('API error fetching all collections:', err);
    }
  }, []);

  const fetchCollectionsForBrand = useCallback(async (_brandId: string) => {
    await fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const loginAdmin = (pass: string) => {
    if (pass === 'admin123' || pass === 'tayyab2026') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  // Projects CRUD
  const addProject = (projectData: Omit<Project, 'id' | 'createdAt'>): Project => {
    const id = `proj-${Date.now()}`;
    const newProject: Project = {
      ...projectData,
      id,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p)));
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getProjectBySlug = (slug: string) => {
    return projects.find((p) => p.slug === slug);
  };

  // Brands CRUD
  const addBrand = (brandData: Omit<Brand, 'id'>): Brand => {
    const id = `brand-${Date.now()}`;
    const newBrand: Brand = { ...brandData, id };
    setBrands((prev) => [...prev, newBrand]);
    return newBrand;
  };

  const updateBrand = (id: string, updatedFields: Partial<Brand>) => {
    setBrands((prev) => prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b)));
  };

  const deleteBrand = (id: string) => {
    setBrands((prev) => prev.filter((b) => b.id !== id));
  };

  const getBrandBySlug = (slug: string) => {
    return brands.find((b) => b.slug === slug);
  };

  // Categories CRUD
  const addCategory = (categoryData: Omit<Category, 'id'>): Category => {
    const id = `cat-${Date.now()}`;
    const newCategory: Category = { ...categoryData, id };
    setCategories((prev) => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c)));
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Testimonials CRUD
  const addTestimonial = (testimonialData: Omit<Testimonial, 'id'>): Testimonial => {
    const id = `test-${Date.now()}`;
    const newTestimonial: Testimonial = { ...testimonialData, id };
    setTestimonials((prev) => [...prev, newTestimonial]);
    return newTestimonial;
  };

  const updateTestimonial = (id: string, updatedFields: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDemoData = () => {
    setProjects(initialProjects);
    setBrands(initialBrands);
    setCategories(initialCategories);
    setTestimonials(initialTestimonials);
    setSettings(initialSiteSettings);
    localStorage.clear();
  };

  // ==========================================================
  // BRAND COLLECTIONS & APPAREL INVENTORY HANDLERS
  // ==========================================================

  const addCollection = async (brandId: string, name: string, bannerImage: string, slug?: string, description?: string) => {
    try {
      const response = await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brand_id: brandId, name, banner_image: bannerImage, slug, description, is_active: true }),
      });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error adding collection:', err);
    }
  };

  const updateCollection = async (id: string, collectionData: Partial<CollectionWithStats>) => {
    try {
      const response = await fetch(`/api/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(collectionData),
      });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error updating collection:', err);
    }
  };

  const toggleCollectionActive = async (id: string) => {
    try {
      const response = await fetch(`/api/collections/${id}/toggle-active`, { method: 'PATCH' });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error toggling collection active:', err);
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const response = await fetch(`/api/collections/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error deleting collection:', err);
    }
  };

  const addApparelProduct = async (productData: Omit<ApparelProduct, 'id'>) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...productData, is_published: true }),
      });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateApparelProduct = async (id: string, productData: Partial<ApparelProduct>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const toggleProductPublished = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}/toggle-published`, { method: 'PATCH' });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error toggling product published:', err);
    }
  };

  const deleteApparelProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchCollections();
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  const addApparelCategory = async (name: string): Promise<ApparelCategory> => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        const cat = await response.json();
        setApparelCategories((prev) => [...prev, cat]);
        return cat;
      }
    } catch (err) {
      console.error('Error adding apparel category:', err);
    }
    const fallback: ApparelCategory = {
      id: `cat-${Date.now()}`,
      name,
    };
    setApparelCategories((prev) => [...prev, fallback]);
    return fallback;
  };

  // Public Storefront Query Helpers
  const getPublicCollections = (brandId?: string) => {
    return collections.filter((c) => c.is_active && (!brandId || c.brand_id === brandId));
  };

  const getPublicProducts = (collectionId?: string) => {
    const allProducts = collections.flatMap((c) => c.products || []);
    return allProducts.filter((p) => p.is_published && (!collectionId || p.collection_id === collectionId));
  };

  return (
    <CMSContext.Provider
      value={{
        projects,
        brands,
        categories,
        services,
        testimonials,
        settings,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        addProject,
        updateProject,
        deleteProject,
        getProjectBySlug,
        addBrand,
        updateBrand,
        deleteBrand,
        getBrandBySlug,
        addCategory,
        updateCategory,
        deleteCategory,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        updateSettings,
        resetToDemoData,
        // Extended Collections & Inventory Props
        apparelCategories,
        collections,
        activeBrandId,
        setActiveBrandId,
        fetchCollections,
        fetchCollectionsForBrand,
        addCollection,
        updateCollection,
        toggleCollectionActive,
        deleteCollection,
        addApparelProduct,
        updateApparelProduct,
        toggleProductPublished,
        deleteApparelProduct,
        addApparelCategory,
        getPublicCollections,
        getPublicProducts,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
};

export const useCMS = () => {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
};

