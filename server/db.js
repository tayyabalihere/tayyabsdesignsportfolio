import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.join(__dirname, '..', 'db', 'database.json');
const dbDir = path.dirname(dbFile);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initial Clean Database Structure
const defaultState = {
  categories: [
    { id: 'cat-jerseys', name: 'Jerseys' },
    { id: 'cat-tshirts', name: 'T-Shirts' },
    { id: 'cat-fullsleeves', name: 'Full Sleeves' },
    { id: 'cat-hoodies', name: 'Hoodies' },
    { id: 'cat-trousers', name: 'Trousers' },
    { id: 'cat-jackets', name: 'Jackets' },
  ],
  brands: [
    {
      id: 'brand-1',
      name: 'NOCTURNE ATELIER',
      slug: 'nocturne-atelier',
      logo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      created_at: new Date().toISOString(),
    },
    {
      id: 'brand-2',
      name: 'VELOCITY SPEEDWEAR',
      slug: 'velocity-speedwear',
      logo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      created_at: new Date().toISOString(),
    },
    {
      id: 'brand-3',
      name: 'AURA STREETWEAR',
      slug: 'aura-streetwear',
      logo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      created_at: new Date().toISOString(),
    },
  ],
  collections: [],
  products: [],
};

function loadDatabase() {
  if (fs.existsSync(dbFile)) {
    try {
      const data = fs.readFileSync(dbFile, 'utf8');
      const parsed = JSON.parse(data);
      if (parsed.collections && Array.isArray(parsed.collections)) {
        parsed.collections = parsed.collections.map((c, i) => ({
          ...c,
          slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: c.description || '',
          is_active: c.is_active !== undefined ? (c.is_active ? 1 : 0) : 1,
          sort_order: c.sort_order || i + 1,
        }));
      }
      if (parsed.products && Array.isArray(parsed.products)) {
        parsed.products = parsed.products.map((p) => ({
          ...p,
          slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: p.description || '',
          sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L', 'XL'],
          is_published: p.is_published !== undefined ? (p.is_published ? 1 : 0) : 1,
          images: Array.isArray(p.images) ? p.images : p.image_url ? [p.image_url] : [],
        }));
      }
      return parsed;
    } catch (e) {
      console.error('Error reading database file, resetting to default:', e);
    }
  }
  fs.writeFileSync(dbFile, JSON.stringify(defaultState, null, 2));
  return defaultState;
}

const dataStore = loadDatabase();

function saveDatabase() {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(dataStore, null, 2));
  } catch (e) {
    console.error('Error saving database to file:', e);
  }
}

// Database helper implementing standard API interface
export const db = {
  all(query, params, cb) {
    setTimeout(() => {
      try {
        if (query.includes('FROM categories')) {
          const res = [...dataStore.categories].sort((a, b) => a.name.localeCompare(b.name));
          cb(null, res);
        } else if (query.includes('FROM collections')) {
          const brandId = params ? params[0] : null;
          let collections = dataStore.collections.filter((c) => !brandId || c.brand_id === brandId);
          if (query.includes('is_active = 1')) {
            collections = collections.filter((c) => c.is_active === 1);
          }
          collections.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
          cb(null, collections);
        } else if (query.includes('FROM products')) {
          let products = dataStore.products;
          if (query.includes('is_published = 1')) {
            products = products.filter((p) => p.is_published === 1);
          }

          if (query.includes('IN (')) {
            const ids = params;
            const res = products
              .filter((p) => ids.includes(p.collection_id))
              .map((p) => {
                const cat = dataStore.categories.find((c) => c.id === p.category_id);
                return {
                  ...p,
                  category_name: cat ? cat.name : 'Uncategorized',
                  image_url: p.images && p.images.length > 0 ? p.images[0] : '',
                };
              });
            cb(null, res);
          } else {
            const collectionId = params ? params[0] : null;
            const res = products
              .filter((p) => !collectionId || p.collection_id === collectionId)
              .map((p) => {
                const cat = dataStore.categories.find((c) => c.id === p.category_id);
                return {
                  ...p,
                  category_name: cat ? cat.name : 'Uncategorized',
                  image_url: p.images && p.images.length > 0 ? p.images[0] : '',
                };
              });
            cb(null, res);
          }
        } else {
          cb(null, []);
        }
      } catch (err) {
        cb(err);
      }
    }, 0);
  },

  get(query, params, cb) {
    setTimeout(() => {
      try {
        if (query.includes('FROM collections')) {
          const param = params[0];
          const collection = dataStore.collections.find((c) => c.id === param || c.slug === param);
          cb(null, collection || null);
        } else if (query.includes('FROM products')) {
          const param = params[0];
          const prod = dataStore.products.find((p) => p.id === param || p.slug === param);
          if (prod) {
            const cat = dataStore.categories.find((c) => c.id === prod.category_id);
            cb(null, {
              ...prod,
              category_name: cat ? cat.name : 'Uncategorized',
              image_url: prod.images && prod.images.length > 0 ? prod.images[0] : '',
            });
          } else {
            cb(null, null);
          }
        } else {
          cb(null, null);
        }
      } catch (err) {
        cb(err);
      }
    }, 0);
  },

  run(query, params, cb) {
    setTimeout(() => {
      try {
        if (query.includes('INSERT INTO categories')) {
          const [id, name] = params;
          if (dataStore.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
            return cb(new Error('UNIQUE constraint failed: Category already exists'));
          }
          dataStore.categories.push({ id, name });
          saveDatabase();
          cb.call({ changes: 1 }, null);
        } else if (query.includes('INSERT INTO collections')) {
          const [id, brand_id, name, slug, description, banner_image, is_active, sort_order] = params;
          dataStore.collections.unshift({
            id,
            brand_id,
            name,
            slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: description || '',
            banner_image,
            is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1,
            sort_order: sort_order || dataStore.collections.length + 1,
            created_at: new Date().toISOString(),
          });
          saveDatabase();
          cb.call({ changes: 1 }, null);
        } else if (query.includes('UPDATE collections')) {
          const [name, slug, description, banner_image, is_active, sort_order, id] = params;
          const col = dataStore.collections.find((c) => c.id === id);
          if (col) {
            if (name !== undefined) col.name = name;
            if (slug !== undefined) col.slug = slug;
            if (description !== undefined) col.description = description;
            if (banner_image !== undefined) col.banner_image = banner_image;
            if (is_active !== undefined) col.is_active = is_active ? 1 : 0;
            if (sort_order !== undefined) col.sort_order = sort_order;
            saveDatabase();
            cb.call({ changes: 1 }, null);
          } else {
            cb.call({ changes: 0 }, null);
          }
        } else if (query.includes('DELETE FROM collections')) {
          const [id] = params;
          const initialLen = dataStore.collections.length;
          dataStore.collections = dataStore.collections.filter((c) => c.id !== id);
          dataStore.products = dataStore.products.filter((p) => p.collection_id !== id);
          saveDatabase();
          cb.call({ changes: initialLen - dataStore.collections.length }, null);
        } else if (query.includes('INSERT INTO products')) {
          const [id, collection_id, category_id, title, slug, description, images, sizes, price, stock_quantity, is_published] = params;
          let imgArr = [];
          if (Array.isArray(images)) imgArr = images;
          else if (typeof images === 'string') {
            try { imgArr = JSON.parse(images); } catch (e) { imgArr = [images]; }
          }
          let sizesArr = ['S', 'M', 'L', 'XL'];
          if (Array.isArray(sizes)) sizesArr = sizes;
          else if (typeof sizes === 'string') {
            try { sizesArr = JSON.parse(sizes); } catch (e) { sizesArr = ['S', 'M', 'L', 'XL']; }
          }

          dataStore.products.unshift({
            id,
            collection_id,
            category_id,
            title,
            slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: description || '',
            images: imgArr,
            sizes: sizesArr,
            price: price || null,
            stock_quantity: stock_quantity || null,
            is_published: is_published !== undefined ? (is_published ? 1 : 0) : 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          saveDatabase();
          cb.call({ changes: 1 }, null);
        } else if (query.includes('UPDATE products')) {
          const [category_id, title, slug, description, images, sizes, price, stock_quantity, is_published, id] = params;
          const prod = dataStore.products.find((p) => p.id === id);
          if (prod) {
            if (category_id !== undefined) prod.category_id = category_id;
            if (title !== undefined) prod.title = title;
            if (slug !== undefined) prod.slug = slug;
            if (description !== undefined) prod.description = description;
            if (images !== undefined) {
              if (Array.isArray(images)) prod.images = images;
              else if (typeof images === 'string') {
                try { prod.images = JSON.parse(images); } catch (e) { prod.images = [images]; }
              }
            }
            if (sizes !== undefined) {
              if (Array.isArray(sizes)) prod.sizes = sizes;
              else if (typeof sizes === 'string') {
                try { prod.sizes = JSON.parse(sizes); } catch (e) { prod.sizes = ['S', 'M', 'L', 'XL']; }
              }
            }
            if (price !== undefined) prod.price = price;
            if (stock_quantity !== undefined) prod.stock_quantity = stock_quantity;
            if (is_published !== undefined) prod.is_published = is_published ? 1 : 0;
            prod.updated_at = new Date().toISOString();
            saveDatabase();
            cb.call({ changes: 1 }, null);
          } else {
            cb.call({ changes: 0 }, null);
          }
        } else if (query.includes('DELETE FROM collections')) {
          const [id] = params;
          const initialLen = dataStore.collections.length;
          dataStore.collections = dataStore.collections.filter((c) => c.id !== id);
          dataStore.products = dataStore.products.filter((p) => p.collection_id !== id);
          saveDatabase();
          cb.call({ changes: initialLen - dataStore.collections.length }, null);
        } else if (query.includes('DELETE FROM products')) {
          const [id] = params;
          const initialLen = dataStore.products.length;
          dataStore.products = dataStore.products.filter((p) => p.id !== id);
          saveDatabase();
          cb.call({ changes: initialLen - dataStore.products.length }, null);
        } else {
          cb.call({ changes: 0 }, null);
        }
      } catch (err) {
        cb(err);
      }
    }, 0);
  },

  exec(sql, cb) {
    if (cb) cb(null);
  },
};
