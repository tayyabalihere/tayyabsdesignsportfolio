import { lazy, Suspense, useState } from 'react';
import { useCMS } from '../context/CMSContext';
import { portfolioImage } from '../data/portfolioImages';
import type { ApparelProduct } from '../types';

const ArticleGalleryModal = lazy(() => import('../components/common/ArticleGalleryModal').then(module => ({ default: module.ArticleGalleryModal })));

export function ShopPage({ navigate }: { navigate: (path: string) => void }) {
  const { collections, settings } = useCMS();
  const [collection, setCollection] = useState('all');
  const [selected, setSelected] = useState<ApparelProduct | null>(null);
  const active = collections.filter(item => item.is_active);
  const products = active.flatMap(item => item.products || []).filter(item => item.is_published && (collection === 'all' || item.collection_id === collection));
  return <div className="reference-archive shop-page"><div className="reference-heading"><h1>Collections</h1><span>( Shop )</span></div>
    <div className="archive-categories" aria-label="Filter collections"><button aria-pressed={collection === 'all'} onClick={() => setCollection('all')}>All collections</button>{active.map(item => <button key={item.id} aria-pressed={collection === item.id} onClick={() => setCollection(item.id)}>{item.name}</button>)}</div>
    {products.length ? <div className="reference-work-grid">{products.map(product => <article className="shop-article" key={product.id}>
      <button className="shop-article-image" onClick={() => setSelected(product)} aria-label={`View ${product.title}`}><img src={portfolioImage(product.images?.[0] || product.image_url || '')} alt={product.title} width="800" height="1000" loading="lazy" decoding="async" /></button>
      <h2>{product.title}</h2><p>{product.category_name}</p>
      <a className="outline-link" href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi Tayyab, I'd like to enquire about ${product.title}.`)}`} target="_blank" rel="noopener noreferrer">Enquire about this article</a>
    </article>)}</div> : <div className="archive-empty"><p>Published articles will appear here.</p><button className="outline-link" onClick={() => navigate('/work')}>Explore the design archive</button></div>}
    {selected && <Suspense fallback={<div role="status">Opening gallery…</div>}><ArticleGalleryModal isOpen product={selected} onClose={() => setSelected(null)} /></Suspense>}
  </div>;
}
