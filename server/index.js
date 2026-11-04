import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

// Ensure upload directory exists in public/uploads
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve public uploads statically
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `img_${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// ==========================================================
// MEDIA UPLOAD API PIPELINE
// ==========================================================

app.post('/api/upload', upload.any(), (req, res) => {
  try {
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files were uploaded.' });
    }

    const uploadedFiles = files.map((file) => ({
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      size: file.size,
      mimetype: file.mimetype,
    }));

    const urls = uploadedFiles.map((f) => f.url);

    return res.status(200).json({
      success: true,
      message: `${uploadedFiles.length} image(s) uploaded successfully.`,
      files: uploadedFiles,
      urls,
      url: uploadedFiles[0].url,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    return res.status(500).json({ error: error.message || 'File upload failed.' });
  }
});

// ==========================================================
// CATEGORIES API
// ==========================================================

app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Category name is required.' });

  const id = `cat-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  db.run('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Category already exists.' });
      }
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id, name });
  });
});

// ==========================================================
// PUBLIC STOREFRONT ENDPOINTS (Active collections & published products)
// ==========================================================

app.get('/api/public/collections', (req, res) => {
  db.all('SELECT * FROM collections WHERE is_active = 1', [], (err, collections) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(collections);
  });
});

function normalizeProduct(p) {
  if (!p) return p;
  let images = p.images;
  if (typeof images === 'string') {
    try { images = JSON.parse(images); } catch { images = [images]; }
  }
  if (!Array.isArray(images)) {
    images = p.image_url ? [p.image_url] : [];
  }
  return {
    ...p,
    images,
    image_url: images[0] || p.image_url || '',
  };
}

app.get('/api/public/products', (req, res) => {
  db.all('SELECT * FROM products WHERE is_published = 1', [], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json((products || []).map(normalizeProduct));
  });
});

// ==========================================================
// COLLECTIONS API (Admin Management)
// ==========================================================

app.get('/api/collections', (req, res) => {
  db.all('SELECT * FROM collections ORDER BY sort_order ASC, created_at DESC', [], (err, collections) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!collections || collections.length === 0) return res.json([]);

    const collectionIds = collections.map((col) => col.id);

    db.all('SELECT * FROM products', [], (prodErr, products) => {
      if (prodErr) return res.status(500).json({ error: prodErr.message });

      const normalizedProducts = (products || []).map(normalizeProduct);

      const statsMap = {};
      normalizedProducts.forEach((p) => {
        if (collectionIds.includes(p.collection_id)) {
          if (!statsMap[p.collection_id]) statsMap[p.collection_id] = {};
          const catName = p.category_name || 'Uncategorized';
          statsMap[p.collection_id][catName] = (statsMap[p.collection_id][catName] || 0) + 1;
        }
      });

      const result = collections.map((col) => {
        const countsObj = statsMap[col.id] || {};
        const categoryCounts = Object.entries(countsObj).map(([categoryName, count]) => ({
          categoryName,
          count,
        }));
        const colProducts = normalizedProducts.filter((p) => p.collection_id === col.id);
        return {
          ...col,
          categoryCounts,
          products: colProducts,
          total_products: colProducts.length,
        };
      });

      res.json(result);
    });
  });
});

app.get('/api/brands/:brandId/collections', (req, res) => {
  const { brandId } = req.params;

  db.all('SELECT * FROM collections WHERE brand_id = ?', [brandId], (err, collections) => {
    if (err) return res.status(500).json({ error: err.message });

    if (collections.length === 0) {
      return res.json([]);
    }

    const collectionIds = collections.map((col) => col.id);

    db.all('SELECT * FROM products', [], (prodErr, products) => {
      if (prodErr) return res.status(500).json({ error: prodErr.message });

      const normalizedProducts = (products || []).map(normalizeProduct);

      const statsMap = {};
      normalizedProducts.forEach((p) => {
        if (collectionIds.includes(p.collection_id)) {
          if (!statsMap[p.collection_id]) statsMap[p.collection_id] = {};
          const catName = p.category_name || 'Uncategorized';
          statsMap[p.collection_id][catName] = (statsMap[p.collection_id][catName] || 0) + 1;
        }
      });

      const result = collections.map((col) => {
        const countsObj = statsMap[col.id] || {};
        const categoryCounts = Object.entries(countsObj).map(([categoryName, count]) => ({
          categoryName,
          count,
        }));
        const colProducts = normalizedProducts.filter((p) => p.collection_id === col.id);
        return {
          ...col,
          categoryCounts,
          products: colProducts,
          total_products: colProducts.length,
        };
      });

      res.json(result);
    });
  });
});

app.get('/api/collections/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM collections WHERE id = ?', [id], (err, collection) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });

    db.all('SELECT * FROM products WHERE collection_id = ?', [id], (prodErr, products) => {
      if (prodErr) return res.status(500).json({ error: prodErr.message });

      const normalizedProducts = (products || []).map(normalizeProduct);

      const countsMap = {};
      normalizedProducts.forEach((p) => {
        countsMap[p.category_name] = (countsMap[p.category_name] || 0) + 1;
      });

      const categoryCounts = Object.entries(countsMap).map(([categoryName, count]) => ({
        categoryName,
        count,
      }));

      res.json({
        ...collection,
        products: normalizedProducts,
        categoryCounts,
        totalItems: normalizedProducts.length,
      });
    });
  });
});

app.post('/api/collections', (req, res) => {
  const { brand_id, name, slug, description, banner_image, is_active, sort_order } = req.body;
  if (!brand_id || !name) {
    return res.status(400).json({ error: 'brand_id and name are required.' });
  }

  const id = `col-${Date.now()}`;
  const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const banner = banner_image || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200';
  const activeStatus = is_active !== undefined ? is_active : true;

  db.run(
    'INSERT INTO collections (id, brand_id, name, slug, description, banner_image, is_active, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, brand_id, name, generatedSlug, description || '', banner, activeStatus ? 1 : 0, sort_order || 1],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({
        id,
        brand_id,
        name,
        slug: generatedSlug,
        description: description || '',
        banner_image: banner,
        is_active: activeStatus,
        sort_order: sort_order || 1,
        created_at: new Date().toISOString(),
        categoryCounts: [],
        total_products: 0,
        products: [],
      });
    }
  );
});

app.put('/api/collections/:id', (req, res) => {
  const { id } = req.params;
  const { name, slug, description, banner_image, is_active, sort_order } = req.body;

  db.run(
    'UPDATE collections SET name = ?, slug = ?, description = ?, banner_image = ?, is_active = ?, sort_order = ? WHERE id = ?',
    [name, slug, description, banner_image, is_active ? 1 : 0, sort_order || 1, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id, name, slug, description, banner_image, is_active, sort_order });
    }
  );
});

app.patch('/api/collections/:id/toggle-active', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM collections WHERE id = ?', [id], (err, collection) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!collection) return res.status(404).json({ error: 'Collection not found' });

    const newActiveState = collection.is_active ? 0 : 1;
    db.run('UPDATE collections SET is_active = ? WHERE id = ?', [newActiveState, id], function (updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ success: true, id, is_active: Boolean(newActiveState) });
    });
  });
});

app.delete('/api/collections/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM collections WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Collection deleted successfully.' });
  });
});

// ==========================================================
// APPAREL PRODUCTS (DESIGN SHOWCASE & SHIRT DROPS) API
// ==========================================================

app.post('/api/products', (req, res) => {
  const { collection_id, category_id, title, slug, description, images, image_url, sizes, price, stock_quantity, is_published } = req.body;

  let imageList = [];
  if (Array.isArray(images) && images.length > 0) imageList = images;
  else if (image_url) imageList = [image_url];

  if (!collection_id || !category_id || !title || imageList.length === 0) {
    return res.status(400).json({ error: 'collection_id, category_id, title, and at least one image are required.' });
  }

  const id = `prod-${Date.now()}`;
  const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const sizeList = Array.isArray(sizes) ? sizes : [];
  const pubStatus = is_published !== undefined ? is_published : true;

  db.run(
    `INSERT INTO products (id, collection_id, category_id, title, slug, description, images, sizes, price, stock_quantity, is_published) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, collection_id, category_id, title, generatedSlug, description || '', JSON.stringify(imageList), JSON.stringify(sizeList), price || null, stock_quantity || null, pubStatus ? 1 : 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        `SELECT p.*, cat.name AS category_name 
         FROM products p 
         JOIN categories cat ON p.category_id = cat.id 
         WHERE p.id = ?`,
        [id],
        (fetchErr, product) => {
          if (fetchErr) return res.status(500).json({ error: fetchErr.message });
          res.status(201).json(normalizeProduct(product));
        }
      );
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const { category_id, title, slug, description, images, image_url, sizes, price, stock_quantity, is_published } = req.body;

  let imageList = null;
  if (Array.isArray(images) && images.length > 0) imageList = images;
  else if (image_url) imageList = [image_url];

  db.run(
    `UPDATE products 
     SET category_id = COALESCE(?, category_id),
         title = COALESCE(?, title),
         slug = COALESCE(?, slug),
         description = COALESCE(?, description),
         images = COALESCE(?, images),
         sizes = COALESCE(?, sizes),
         price = COALESCE(?, price),
         stock_quantity = COALESCE(?, stock_quantity),
         is_published = COALESCE(?, is_published),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      category_id,
      title,
      slug,
      description,
      imageList ? JSON.stringify(imageList) : null,
      sizes ? JSON.stringify(sizes) : null,
      price,
      stock_quantity,
      is_published !== undefined ? (is_published ? 1 : 0) : null,
      id,
    ],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      db.get(
        `SELECT p.*, cat.name AS category_name 
         FROM products p 
         JOIN categories cat ON p.category_id = cat.id 
         WHERE p.id = ?`,
        [id],
        (fetchErr, product) => {
          if (fetchErr) return res.status(500).json({ error: fetchErr.message });
          res.json(normalizeProduct(product));
        }
      );
    }
  );
});

app.patch('/api/products/:id/toggle-published', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, prod) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!prod) return res.status(404).json({ error: 'Product not found' });

    const newPubState = prod.is_published ? 0 : 1;
    db.run('UPDATE products SET is_published = ? WHERE id = ?', [newPubState, id], function (updateErr) {
      if (updateErr) return res.status(500).json({ error: updateErr.message });
      res.json({ success: true, id, is_published: Boolean(newPubState) });
    });
  });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id });
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`Backend API Server running on port ${PORT}`);
});
