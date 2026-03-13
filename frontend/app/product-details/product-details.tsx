'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import './product-details.css';

interface SizeVariant {
  size: string; size_name: string; variation_id: number; price: number;
  in_stock: boolean; sku: string; thumbnail_id: number | null; gallery_ids: number[];
}
interface ColorVariant { color: string; color_name: string; image_id: number | null; sizes: SizeVariant[]; }
interface ColorOption   { slug: string; name: string; image_id: number | null; }
interface SizeOption    { slug: string; name: string; }
interface ProductData {
  product_id: number; product_name: string; description: string; short_desc: string;
  sku: string; thumbnail_id: number | null; price_range: { min: number; max: number };
  default_color: string; default_size: string; colors: ColorOption[]; sizes: SizeOption[]; variants: ColorVariant[];
}

const COLOR_HEX: Record<string, string> = {
  'white':'#ffffff','blue':'#5dade2','blue-ocean-camo':'#4a90a4','navy':'#34495e',
  'white-ocean-camo':'#dde4e6','mint':'#98d4c4','mint-ocean-camo':'#7bc4b0','black':'#1a1a1a',
  'gray':'#9b9b9b','grey':'#9b9b9b','red':'#e74c3c','orange':'#e67e22','light-pink':'#f1a7c0',
  'heather-grey':'#b0b0b0','heather-gray':'#b0b0b0','light-blue-heather':'#a8d4f5',
  'light-blue-aqua':'#56c8d8','blue-water':'#2980b9','water-blue':'#3498db','smoke':'#bdc3c7',
  'navy-tumbler':'#1f3a5f','natural':'#f5e6c8','striper':'#4a90d9','ice':'#d6eaf8',
  'royal-blue':'#1a5276','ice-blue':'#aed6f1','pale-yellow':'#fef9e7','pink-blossom':'#f8b4c8','citrus':'#f4d03f',
};

const API_BASE   = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const PRODUCT_ID = 6684;

// ── Color-specific images (slot 0 of gallery, changes when color swatch is clicked)
// These are real URLs verified from the live oceancowboy.com product page
const THUMBNAIL_URL: Record<number, string> = {
  6703: 'https://www.oceancowboy.com/wp-content/uploads/2023/11/Hoodies-Blue-Front-600x600.jpg',
  6706: 'https://www.oceancowboy.com/wp-content/uploads/2023/03/Main-5-600x600.jpg',
  6712: 'https://www.oceancowboy.com/wp-content/uploads/2023/11/4-lifestyle-3-1-600x600.jpg',
  6717: 'https://www.oceancowboy.com/wp-content/uploads/2023/11/Hoodies-BlueCamo-Front-600x600.jpg',
};

// ── 4 distinct gallery thumbnails — verified from live oceancowboy.com
const GALLERY_IMAGES = [
  'https://www.oceancowboy.com/wp-content/uploads/2023/03/Main-4-600x600.jpg',       // [0] White Ocean Camo main — overridden by color
  'https://www.oceancowboy.com/wp-content/uploads/2023/03/Main-5-600x600.jpg',       // [1] White front
  'https://www.oceancowboy.com/wp-content/uploads/2023/03/Front-5-600x600.jpg',      // [2] Front view
  'https://www.oceancowboy.com/wp-content/uploads/2023/11/4-lifestyle-3-1-600x600.jpg', // [3] Lifestyle
];

function StarRating({ rating = 4.5 }: { rating?: number }) {
  return (
    <div style={{ display:'flex', gap:2 }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="16" height="16" viewBox="0 0 24 24"
          fill={s <= Math.round(rating) ? '#e74c3c' : '#ddd'}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  );
}

export default function ProductDetailsPage() {
  const [product,       setProduct]       = useState<ProductData | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [apiError,      setApiError]      = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize,  setSelectedSize]  = useState('');
  const [currentPrice,  setCurrentPrice]  = useState<number | null>(null);
  const [inStock,       setInStock]       = useState(true);
  const [variationId,   setVariationId]   = useState<number | null>(null);
  const [priceLoading,  setPriceLoading]  = useState(false);
  const [quantity,      setQuantity]      = useState(1);
  const [activeTab,     setActiveTab]     = useState('description');
  const [mainImage,     setMainImage]     = useState(0);
  const [showFull,      setShowFull]      = useState(false);
  const [zoomPos,       setZoomPos]       = useState({ x: 0, y: 0 });
  const [isZooming,     setIsZooming]     = useState(false);
  const [imgErrors,     setImgErrors]     = useState<Record<number, boolean>>({});

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res  = await fetch(`${API_BASE}/api/products/${PRODUCT_ID}/variants`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        setProduct(json);
        setSelectedColor(json.default_color || json.colors[0]?.slug || '');
        setSelectedSize(json.default_size   || json.sizes[0]?.slug  || '');
      } catch (err: any) { setApiError(err.message); }
      finally { setLoading(false); }
    }
    fetchProduct();
  }, []);

  useEffect(() => {
    if (!selectedColor || !selectedSize) { setCurrentPrice(null); setVariationId(null); return; }
    async function fetchPrice() {
      setPriceLoading(true);
      try {
        const res  = await fetch(`${API_BASE}/api/products/${PRODUCT_ID}/price?color=${encodeURIComponent(selectedColor)}&size=${encodeURIComponent(selectedSize)}`);
        const json = await res.json();
        if (json.success) { setCurrentPrice(parseFloat(json.price)); setInStock(json.in_stock); setVariationId(json.variation_id); }
        else { setCurrentPrice(null); setInStock(false); }
      } catch { setCurrentPrice(null); }
      finally { setPriceLoading(false); }
    }
    fetchPrice();
  }, [selectedColor, selectedSize]);

  const handleColorChange = (slug: string) => {
    setSelectedColor(slug);
    setSelectedSize('');
    setCurrentPrice(null);
    setMainImage(0);
    setImgErrors({});
  };

  const availableSizes: SizeVariant[] = product
    ? (product.variants.find(v => v.color === selectedColor)?.sizes ?? []) : [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setZoomPos({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  // Slot 0 = color-specific image; slots 1-3 = fixed gallery images
  const colorThumb  = product?.colors.find(c => c.slug === selectedColor);
  const mainThumbId = colorThumb?.image_id ?? null;

  const effectiveGallery = GALLERY_IMAGES.map((img, idx) => {
    if (idx === 0 && mainThumbId && THUMBNAIL_URL[mainThumbId]) {
      return THUMBNAIL_URL[mainThumbId];
    }
    return img;
  });

  const mainImgSrc = imgErrors[mainImage]
    ? effectiveGallery.find((_, i) => !imgErrors[i]) ?? effectiveGallery[0]
    : (effectiveGallery[mainImage] ?? effectiveGallery[0]);

  const priceRangeDisplay = product
    ? `$${product.price_range.min.toFixed(2)} – $${product.price_range.max.toFixed(2)}`
    : '';

  const selectedPriceDisplay = currentPrice != null ? `$${currentPrice.toFixed(2)}` : null;
  const canAddToCart = !!(selectedColor && selectedSize && inStock && !priceLoading);

  const specs: Record<string, string> = {
    'Material':'100% Performance Polyester','Care':'Machine wash cold, tumble dry low',
    'Origin':'Made in USA','UV Protection':'UPF 40+','Fit':'Regular fit',
  };
  const reviews = [
    { id:1, author:'John D.',  rating:5, date:'2026-02-15', verified:true, comment:"Great quality hoodie! The sun protection is excellent and it's very comfortable." },
    { id:2, author:'Sarah M.', rating:4, date:'2026-02-10', verified:true, comment:'Love the design and fit. Runs slightly large but overall very happy with the purchase.' },
  ];

  if (loading) return (
    <>
      <Header />
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh', flexDirection:'column', gap:16 }}>
        <div style={{ width:44, height:44, border:'4px solid #eee', borderTopColor:'#3dbda7', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
        <p style={{ color:'#888', fontFamily:'Open Sans,sans-serif' }}>Loading product...</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
      <Footer />
    </>
  );

  if (apiError || !product) return (
    <>
      <Header />
      <div style={{ textAlign:'center', padding:'80px 20px', fontFamily:'Open Sans,sans-serif' }}>
        <h2 style={{ color:'#e74c3c' }}>Could not load product</h2>
        <p style={{ color:'#888', marginTop:8 }}>{apiError || 'Product not found.'}<br/>
          <small>Make sure the API is running at <code>{API_BASE}</code></small></p>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="dima-main">

        {/* Breadcrumb */}
        <section className="title_container start-style">
          <div className="page-section-content">
            <div className="container page-section">
              <h2 className="uppercase undertitle text-start">{product.product_name}</h2>
              <div className="dima-breadcrumbs breadcrumbs-end text-end">
                <span><Link href="/" className="trail-begin">Home</Link></span>
                <span className="sep">\</span>
                <span><Link href="#">Shop</Link></span>
                <span className="sep">\</span>
                <span className="trail-end">{product.product_name}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="page-section-content overflow-hidden">
            <div className="container">
              <div className="ok-row">

                {/* LEFT: Images */}
                <div className="ok-md-5 ok-xsd-12">
                  <div className="pd-gallery">

                    {/* Vertical thumbnail strip */}
                    <div className="pd-thumbs">
                      {effectiveGallery.map((img, idx) => (
                        !imgErrors[idx] && (
                          <div
                            key={idx}
                            onClick={() => setMainImage(idx)}
                            className={`pd-thumb${mainImage === idx ? ' active' : ''}`}
                          >
                            <img
                              src={img}
                              alt=""
                              loading="lazy"
                              onError={() => setImgErrors(prev => ({ ...prev, [idx]: true }))}
                            />
                          </div>
                        )
                      ))}
                    </div>

                    {/* Main viewer */}
                    <div
                      className="pd-main-img"
                      onMouseMove={handleMouseMove}
                      onMouseEnter={() => setIsZooming(true)}
                      onMouseLeave={() => setIsZooming(false)}
                    >
                      <img
                        key={mainImgSrc}
                        src={mainImgSrc}
                        alt=""
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.onerror = null;
                          setImgErrors(prev => ({ ...prev, [mainImage]: true }));
                        }}
                      />
                      {isZooming && (
                        <div className="pd-zoom-lens" style={{
                          backgroundImage: `url(${mainImgSrc})`,
                          backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                        }}/>
                      )}
                      <div className="pd-zoom-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                        </svg>
                      </div>
                    </div>

                  </div>
                </div>

                {/* RIGHT: Product Info */}
                <div className="ok-md-7 ok-xsd-12">
                  <div className="pd-summary">

                    <h1 className="pd-title">{product.product_name}</h1>

                    <div className="pd-rating-row">
                      <StarRating rating={4.5} />
                      <a href="#" onClick={e => { e.preventDefault(); setActiveTab('reviews'); }}
                        className="pd-review-link">
                        ({reviews.length} Customer reviews)
                      </a>
                    </div>

                    {/* Price range — always visible */}
                    <div className="pd-price-range-top">
                      <span className="pd-price-range-label">Price: </span>
                      <span className="pd-price-range-value">{priceRangeDisplay}</span>
                    </div>

                    <div className="pd-short-desc">
                      <p>{showFull ? product.short_desc : product.short_desc.substring(0, 200) + (product.short_desc.length > 200 ? '...' : '')}</p>
                      {product.short_desc.length > 200 && (
                        <a href="#" className="pd-read-more"
                          onClick={e => { e.preventDefault(); setShowFull(!showFull); }}>
                          {showFull ? 'READ LESS' : 'READ MORE'}
                        </a>
                      )}
                    </div>

                    <div className="pd-rule"/>

                    {/* COLOR */}
                    <div className="pd-option-group">
                      <div className="pd-option-header">
                        <span className="pd-option-label">Color</span>
                        {selectedColor && (
                          <span className="pd-selected-name">
                            — {product.colors.find(c => c.slug === selectedColor)?.name}
                          </span>
                        )}
                      </div>
                      <div className="pd-color-swatches">
                        {product.colors.map(color => {
                          const hex     = COLOR_HEX[color.slug] || '#ccc';
                          const isLight = ['white','white-ocean-camo','natural','pale-yellow','ice','ice-blue'].includes(color.slug);
                          return (
                            <button key={color.slug} title={color.name}
                              onClick={() => handleColorChange(color.slug)}
                              className={`pd-swatch${selectedColor === color.slug ? ' active' : ''}${isLight ? ' light-swatch' : ''}`}
                              style={{ backgroundColor: hex }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* SIZE */}
                    <div className="pd-option-group">
                      <div className="pd-option-header">
                        <span className="pd-option-label">Size</span>
                        {selectedSize && (
                          <a href="#" className="pd-clear-btn"
                            onClick={e => { e.preventDefault(); setSelectedSize(''); setCurrentPrice(null); }}>
                            Clear
                          </a>
                        )}
                      </div>
                      <div className="pd-size-btns">
                        {product.sizes.map(size => {
                          const v           = availableSizes.find(s => s.size === size.slug);
                          const isAvailable = !!v;
                          const isOOS       = v && !v.in_stock;
                          return (
                            <button key={size.slug}
                              onClick={() => isAvailable && setSelectedSize(size.slug)}
                              disabled={!isAvailable}
                              title={isOOS ? `${size.name} — Out of Stock` : size.name}
                              className={`pd-size${selectedSize === size.slug ? ' active' : ''}${!isAvailable ? ' unavail' : ''}${isOOS ? ' oos' : ''}`}>
                              {size.name}
                              {isOOS && <span className="pd-oos-dot">●</span>}
                            </button>
                          );
                        })}
                      </div>
                      {selectedColor && availableSizes.length === 0 && (
                        <p className="pd-no-size-msg">No sizes available for this color</p>
                      )}
                    </div>

                    {/* Selected price */}
                    <div className="pd-price-row">
                      {priceLoading ? (
                        <span className="pd-price-loading">Updating...</span>
                      ) : selectedPriceDisplay ? (
                        <span className="pd-price">{selectedPriceDisplay}</span>
                      ) : (
                        <span className="pd-price pd-price-placeholder">
                          {selectedColor && !selectedSize ? 'Select a size' : '—'}
                        </span>
                      )}
                      {selectedColor && selectedSize && !inStock && !priceLoading && (
                        <span className="pd-oos-label">Out of Stock</span>
                      )}
                    </div>

                    {/* Quantity + Add to cart */}
                    <div className="pd-cart-row">
                      <div className="pd-qty-wrap">
                        <button className="pd-qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                        <input type="number" value={quantity} className="pd-qty-input"
                          onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}/>
                        <button className="pd-qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                      </div>
                      <button
                        onClick={() => {
                          if (selectedColor && selectedSize && inStock) {
                            alert(`Added ${quantity}x ${product.product_name} (${selectedColor}, ${selectedSize.toUpperCase()}) — $${currentPrice?.toFixed(2)} to cart!`);
                          }
                        }}
                        disabled={!canAddToCart}
                        className={`pd-atc${canAddToCart ? ' pd-atc-ready' : ''}`}>
                        {!selectedColor ? 'SELECT COLOR' : !selectedSize ? 'SELECT SIZE' : !inStock ? 'OUT OF STOCK' : priceLoading ? 'LOADING...' : 'ADD TO CART'}
                      </button>
                    </div>

                    {/* Meta */}
                    <div className="pd-meta">
                      <div className="pd-meta-row">
                        <div className="pd-meta-item">
                          <strong>SKU:</strong>
                          <span>{variationId ? availableSizes.find(s => s.size === selectedSize)?.sku || product.sku : product.sku || '—'}</span>
                        </div>
                        {variationId && (
                          <div className="pd-meta-item pd-meta-variation">
                            <strong>Variation:</strong>
                            <span>#{variationId}</span>
                          </div>
                        )}
                      </div>
                      <div className="pd-meta-item">
                        <strong>Category:</strong>
                        <a href="#" className="pd-cat-link">Hoodies</a>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ clear:'both', marginTop:48 }}/>
              <div className="pd-tabs">
                <nav className="pd-tab-nav">
                  {['description','specifications','reviews'].map(tab => (
                    <a key={tab} href="#"
                      onClick={e => { e.preventDefault(); setActiveTab(tab); }}
                      className={`pd-tab-link${activeTab === tab ? ' active' : ''}`}>
                      {tab === 'reviews' ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </a>
                  ))}
                </nav>

                <div className="pd-tab-body box dima-box">
                  {activeTab === 'description' && (
                    <div>
                      <h3 className="undertitle">Product Description</h3>
                      <div className="clear-section"/>
                      <div className="pd-desc-body"
                        dangerouslySetInnerHTML={{ __html: product.description || product.short_desc }}/>
                    </div>
                  )}
                  {activeTab === 'specifications' && (
                    <div>
                      <h3 className="undertitle">Specifications</h3>
                      <div className="clear-section"/>
                      <table className="order-products-table">
                        <tbody>
                          {Object.entries(specs).map(([k,v]) => (
                            <tr key={k}>
                              <td className="product-name"><strong>{k}</strong></td>
                              <td className="product-total">{v}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {activeTab === 'reviews' && (
                    <div>
                      <h3 className="undertitle">Customer Reviews</h3>
                      <div className="clear-section"/>
                      {reviews.map(r => (
                        <div key={r.id} className="pd-review">
                          <div className="pd-review-top">
                            <div>
                              <span className="pd-review-author">{r.author}</span>
                              {r.verified && <span className="pd-verified">✔ Verified</span>}
                            </div>
                            <span className="pd-review-date">{r.date}</span>
                          </div>
                          <StarRating rating={r.rating}/>
                          <p className="pd-review-text">{r.comment}</p>
                        </div>
                      ))}
                      <div className="clear-section"/>
                      <a href="#" className="button fill uppercase">✏ Write a Review</a>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
