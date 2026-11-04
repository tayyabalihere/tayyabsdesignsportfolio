-- ==========================================================
-- Database Migration: Relational Model for Collections & Products
-- File: db/migrations/001_init_brand_collections_apparel.sql
-- ==========================================================

-- Enable Foreign Key Support (for SQLite engines)
PRAGMA foreign_keys = ON;

-- 1. Brands Table
CREATE TABLE IF NOT EXISTS brands (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    logo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Collections Table
CREATE TABLE IF NOT EXISTS collections (
    id VARCHAR(64) PRIMARY KEY,
    brand_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    banner_image TEXT,
    is_active INTEGER NOT NULL DEFAULT 1,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_collections_brand 
        FOREIGN KEY (brand_id) 
        REFERENCES brands(id) 
        ON DELETE CASCADE
);

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- 4. Products (Apparel Showcase & Shirt Drops) Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    collection_id VARCHAR(64) NOT NULL,
    category_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    images TEXT NOT NULL, -- JSON array of image URLs
    sizes TEXT NOT NULL DEFAULT '["S","M","L","XL"]', -- JSON array of available sizes
    price REAL DEFAULT NULL,
    stock_quantity INTEGER DEFAULT NULL,
    is_published INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_collection 
        FOREIGN KEY (collection_id) 
        REFERENCES collections(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_products_category 
        FOREIGN KEY (category_id) 
        REFERENCES categories(id) 
        ON DELETE RESTRICT
);

-- Indexes for performant lookups and foreign key joins
CREATE INDEX IF NOT EXISTS idx_collections_brand_id ON collections(brand_id);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- ==========================================================
-- Pre-Seed Predefined Categories
-- ==========================================================
INSERT OR IGNORE INTO categories (id, name) VALUES
    ('cat-jerseys', 'Jerseys'),
    ('cat-tshirts', 'T-Shirts'),
    ('cat-fullsleeves', 'Full Sleeves'),
    ('cat-hoodies', 'Hoodies'),
    ('cat-trousers', 'Trousers'),
    ('cat-jackets', 'Jackets');

-- Pre-seed Initial Brands if empty
INSERT OR IGNORE INTO brands (id, name, slug, logo_url) VALUES
    ('brand-1', 'NOCTURNE ATELIER', 'nocturne-atelier', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
    ('brand-2', 'VELOCITY SPEEDWEAR', 'velocity-speedwear', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
    ('brand-3', 'AURA STREETWEAR', 'aura-streetwear', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200');

-- Pre-seed Sample Collections
INSERT OR IGNORE INTO collections (id, brand_id, name, slug, description, banner_image, is_active, sort_order) VALUES
    ('col-1', 'brand-1', 'Drop 1: Cyber Darkware', 'drop-1-cyber-darkware', 'Tactical cybernetic streetwear capsule featuring heavyweight cottons and tech pack artwork.', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=1200', 1, 1),
    ('col-2', 'brand-1', 'Drop 2: Summer 24 Oasis', 'drop-2-summer-24-oasis', 'Lightweight sun-bleached cultural resortwear and acid wash t-shirts.', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1200', 1, 2),
    ('col-3', 'brand-2', 'Velocity Grand Prix 2026', 'velocity-grand-prix-2026', 'Motorsport aesthetic apparel collection with sublimated team racing jerseys.', 'https://images.unsplash.com/photo-1511746315387-c4a76990fdce?auto=format&fit=crop&q=80&w=1200', 1, 3);

-- Pre-seed Sample Apparel Products
INSERT OR IGNORE INTO products (id, collection_id, category_id, title, slug, description, images, sizes, is_published) VALUES
    ('prod-1', 'col-1', 'cat-jerseys', 'Pro Racing Cyber Jersey', 'pro-racing-cyber-jersey', 'High-performance sublimated racing jersey with cyber artwork.', '["https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600", "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"]', '["S","M","L","XL","2XL"]', 1),
    ('prod-2', 'col-1', 'cat-jerseys', 'Tactical Mesh Jersey', 'tactical-mesh-jersey', 'Breathable mesh panel streetwear jersey.', '["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600"]', '["S","M","L","XL"]', 1),
    ('prod-3', 'col-1', 'cat-tshirts', 'Oversized Dark Heavyweight Tee', 'oversized-dark-heavyweight-tee', '460GSM heavyweight organic cotton t-shirt.', '["https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=600"]', '["S","M","L","XL","2XL"]', 1),
    ('prod-4', 'col-1', 'cat-hoodies', 'Acid Wash Boxy Hoodie', 'acid-wash-boxy-hoodie', 'French terry fleece boxy drop-shoulder hoodie.', '["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600"]', '["M","L","XL"]', 1);
