"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ─────────────────────────────────────────────────────────────
//  THUMBNAIL MAP  (thumbnail_id → real WordPress image URL)
//  Source: tbl_productmeta  meta_key = '_thumbnail_id'
//  Images hosted on oceancowboy.com CDN
// ─────────────────────────────────────────────────────────────
const THUMBNAIL_MAP: Record<number, string> = {
  // Koozies (ID 15) → thumbnail_id 8568
  8568: "https://www.oceancowboy.com/wp-content/uploads/2023/06/Koozie-featured.jpg",
  // Coasters (ID 24) → thumbnail_id 6638
  6638: "https://www.oceancowboy.com/wp-content/uploads/2023/06/Coasters-featured.jpg",
  // Coffee Mug (ID 6429) → thumbnail_id 6627
  6627: "https://www.oceancowboy.com/wp-content/uploads/2023/06/CoffeeMug-featured.jpg",
  // Hoodies (ID 6684) → thumbnail_id 6712 (blue-ocean-camo front)
  6712: "https://www.oceancowboy.com/wp-content/uploads/2020/09/Hoodies-Camo-Front.jpg",
  // Decals (ID 7060) → thumbnail_id 7122
  7122: "https://www.oceancowboy.com/wp-content/uploads/2023/03/Decals-featured.jpg",
  // 26oz Flex Bottle (ID 7192) → thumbnail_id 7226
  7226: "https://www.oceancowboy.com/wp-content/uploads/2023/06/26oz-FlexBottle-featured.jpg",
  // 20oz Skinny Tumbler (ID 7197) → thumbnail_id 9198
  9198: "https://www.oceancowboy.com/wp-content/uploads/2023/06/20oz-Tumbler-featured.jpg",
  // Hoodie color variants (used in product details)
  6703: "https://www.oceancowboy.com/wp-content/uploads/2020/09/Hoodies-Blue-Front.jpg",
  6706: "https://www.oceancowboy.com/wp-content/uploads/2020/09/Hoodies-White-Front.jpg",
  6717: "https://www.oceancowboy.com/wp-content/uploads/2020/09/Hoodies-BlueCamo-Front.jpg",
  7225: "https://www.oceancowboy.com/wp-content/uploads/2023/11/26oz-Flex-Bottle-Black.jpg",
  8664: "https://www.oceancowboy.com/wp-content/uploads/2023/11/20oz-Tumbler-Navy.jpg",
};

// ─────────────────────────────────────────────────────────────
//  HIGH-QUALITY FALLBACK IMAGES (used when thumbnail_id is
//  unknown or image fails to load). Mapped by product category.
// ─────────────────────────────────────────────────────────────
const CATEGORY_FALLBACKS: Record<string, string> = {
  hoodies:
    "https://www.oceancowboy.com/wp-content/uploads/2020/09/Hoodies-Blue-Front.jpg",
  koozies:
    "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&h=720&fit=crop",
  coasters:
    "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=720&fit=crop",
  "coffee-mug":
    "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&h=720&fit=crop",
  decals:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=720&fit=crop",
  "26oz-flex-bottle-with-lid":
    "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=720&fit=crop",
  "20oz-skinny-tumbler":
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=720&fit=crop",
  default:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=720&fit=crop",
};

// ─────────────────────────────────────────────────────────────
//  PRODUCT PRICE RANGE MAP  (from tbl_productmeta _price data)
//  Used to display accurate price ranges for variable products
// ─────────────────────────────────────────────────────────────
const PRODUCT_PRICE_RANGES: Record<number, { min: number; max: number }> = {
  15:   { min: 6.00,  max: 6.00 },   // Koozies
  24:   { min: 40.00, max: 40.00 },  // Coasters
  6429: { min: 12.00, max: 12.00 },  // Coffee Mug
  6684: { min: 49.00, max: 55.00 },  // Hoodies (S–3XL range)
  7060: { min: 6.00,  max: 6.00 },   // Decals
  7192: { min: 44.99, max: 44.99 },  // 26oz Flex Bottle
  7197: { min: 34.99, max: 34.99 },  // 20oz Skinny Tumbler
};

// ─────────────────────────────────────────────────────────────
//  SALE PRODUCTS (from tbl_productmeta _sale_price data)
// ─────────────────────────────────────────────────────────────
const SALE_PRODUCTS = new Set<number>([]);  // No active sales in current DB

interface ShopProduct {
  ID: number;
  product_title: string;
  product_short_desc: string;
  product_url: string;
  price: string | null;
  thumbnail_id: string | null;
  sku: string | null;
  // resolved fields
  resolvedImg: string;
  priceRange: { min: number; max: number } | null;
  isSale: boolean;
  rating: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function resolveImage(thumbnailId: string | null, productUrl: string | null): string {
  // 1. Try exact thumbnail_id match
  if (thumbnailId) {
    const tid = parseInt(thumbnailId);
    if (THUMBNAIL_MAP[tid]) return THUMBNAIL_MAP[tid];
  }
  // 2. Try category/url-based fallback
  const url = productUrl || "";
  for (const key of Object.keys(CATEGORY_FALLBACKS)) {
    if (url.includes(key)) return CATEGORY_FALLBACKS[key];
  }
  return CATEGORY_FALLBACKS.default;
}

const StarRating = ({ rating, size = 14 }: { rating: number; size?: number }) => (
  <div style={{ display: "flex", gap: "3px", alignItems: "center" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <svg key={s} width={size} height={size} viewBox="0 0 24 24"
        fill={s <= Math.round(rating) ? "#3dbda7" : "#e0e0e0"}>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ))}
    <span style={{ fontSize: 11, color: "#aaa", marginLeft: 2 }}>{rating.toFixed(1)}</span>
  </div>
);

const overlayIcons = [
  {
    title: "Quick View",
    icon: (c: string) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    title: "Add to Cart",
    icon: (c: string) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
  },
  {
    title: "Wishlist",
    icon: (c: string, filled?: boolean) => (
      <svg width="17" height="17" viewBox="0 0 24 24"
        fill={filled ? "#e74c3c" : "none"} stroke={c} strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    title: "Share",
    icon: (c: string) => (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
];

// Stable mock ratings seeded by product ID (so they don't change on re-render)
function seedRating(id: number): number {
  const ratings: Record<number, number> = {
    15: 4.8, 24: 4.6, 6429: 4.7, 6684: 4.9,
    7060: 4.3, 7192: 4.5, 7197: 4.4,
  };
  return ratings[id] ?? 4.2;
}

export default function OkabShop() {
  const [view, setView]           = useState<"grid" | "list">("grid");
  const [sort, setSort]           = useState("menu_order");
  const [wishlist, setWishlist]   = useState<number[]>([]);
  const [page, setPage]           = useState(1);
  const [products, setProducts]   = useState<ShopProduct[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading]     = useState(true);
  const [apiError, setApiError]   = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setApiError(null);
      try {
        const res = await fetch(`${API_BASE}/api/products?page=${page}&limit=12`);
        if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "API error");

        const decorated: ShopProduct[] = json.data.map((p: any) => ({
          ...p,
          resolvedImg: resolveImage(p.thumbnail_id, p.product_url),
          priceRange: PRODUCT_PRICE_RANGES[p.ID] ?? null,
          isSale: SALE_PRODUCTS.has(p.ID),
          rating: seedRating(p.ID),
        }));

        setProducts(decorated);
        setPagination(json.pagination);
      } catch (err: any) {
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [page]);

  const toggle = (id: number) =>
    setWishlist((w) => w.includes(id) ? w.filter((x) => x !== id) : [...w, id]);

  const sorted = [...products].sort((a, b) => {
    const pa = parseFloat(a.price || "0");
    const pb = parseFloat(b.price || "0");
    if (sort === "price")      return pa - pb;
    if (sort === "price-desc") return pb - pa;
    if (sort === "popularity") return b.rating - a.rating;
    if (sort === "rating")     return b.rating - a.rating;
    return 0;
  });

  const totalPages = pagination?.pages ?? 1;

  // Format price display for a product card
  function formatPrice(p: ShopProduct): string {
    if (p.priceRange) {
      if (p.priceRange.min === p.priceRange.max) return `$${p.priceRange.min.toFixed(2)}`;
      return `$${p.priceRange.min.toFixed(2)} – $${p.priceRange.max.toFixed(2)}`;
    }
    if (p.price) return `$${parseFloat(p.price).toFixed(2)}`;
    return "—";
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700&family=Lato:ital,wght@0,300;0,400;1,300;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── Product card ── */
        .pc {
          background: #fff;
          border: 1px solid #e8e8e8;
          transition: box-shadow 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }
        .pc:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.13);
          transform: translateY(-3px);
        }
        .pc-img {
          position: relative;
          overflow: hidden;
          background: #f5f5f5;
          flex-shrink: 0;
        }
        .pc-img img {
          display: block;
          width: 100%;
          height: 280px;
          object-fit: cover;
          transition: transform 0.55s ease;
        }
        .pc:hover .pc-img img { transform: scale(1.06); }

        /* SALE ribbon */
        .sale-ribbon {
          position: absolute;
          top: 22px;
          right: -30px;
          background: #e74c3c;
          color: #fff;
          font-family: 'Open Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          padding: 6px 44px;
          transform: rotate(45deg);
          z-index: 4;
          pointer-events: none;
        }

        /* Stock badge */
        .stock-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-family: 'Open Sans', sans-serif;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.5px;
          padding: 3px 8px;
          border-radius: 2px;
          z-index: 4;
          pointer-events: none;
        }
        .stock-badge.in  { background: #3dbda7; color: #fff; }
        .stock-badge.out { background: #e74c3c; color: #fff; }

        /* Hover overlay icons */
        .pc-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.26);
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          z-index: 3;
          padding: 12px;
          flex-wrap: wrap;
        }
        .pc:hover .pc-overlay { opacity: 1; }
        .ov-btn {
          width: 40px; height: 40px;
          background: #fff;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 3px 10px rgba(0,0,0,0.18);
          transition: background 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .ov-btn:hover { background: #3dbda7; transform: scale(1.1); }
        .ov-btn:hover svg { stroke: #fff !important; }

        /* Card body */
        .pc-body {
          padding: 16px 14px 20px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 7px;
          flex: 1;
        }
        .pc-sku {
          font-family: 'Open Sans', sans-serif;
          font-size: 10px;
          color: #ccc;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .pc-name {
          font-family: 'Open Sans', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #333;
          line-height: 1.4;
          text-decoration: none;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .pc-name:hover { color: #3dbda7; }
        .pc-review {
          font-family: 'Open Sans', sans-serif;
          font-size: 11px;
          color: #bbb;
          text-decoration: none;
        }
        .pc-price {
          font-family: 'Open Sans', sans-serif;
          font-size: 17px;
          font-weight: 700;
          color: #222;
          margin-top: 2px;
        }
        .pc-price-range {
          font-size: 13px;
          color: #3dbda7;
          font-weight: 600;
        }

        /* Skeleton */
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 3px;
        }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

        /* Toolbar */
        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          gap: 12px;
          flex-wrap: wrap;
        }
        .toolbar-left  { display: flex; align-items: center; gap: 0; flex-shrink: 0; }
        .toolbar-right { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-left: auto; }

        .vbtn {
          width: 44px; height: 44px;
          border: 1px solid #ddd;
          background: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .vbtn + .vbtn { border-left: none; }
        .vbtn.on { background: #3dbda7; border-color: #3dbda7; }
        .vbtn:hover:not(.on) { border-color: #3dbda7; }

        .sort-sel {
          appearance: none;
          background: #fff;
          border: 1px solid #ddd;
          padding: 10px 40px 10px 14px;
          font-family: 'Open Sans', sans-serif;
          font-size: 13px;
          color: #555;
          cursor: pointer;
          outline: none;
          min-width: 210px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23555' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
        }
        .sort-sel:focus { border-color: #3dbda7; }

        .results-count {
          font-family: 'Open Sans', sans-serif;
          font-size: 13px;
          color: #999;
          white-space: nowrap;
        }

        .s-hr { border: none; border-top: 1px solid #e8e8e8; margin: 14px 0 32px; }

        /* Grid */
        .grid-products {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 18px;
        }
        @media (max-width: 1100px) { .grid-products { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 820px)  { .grid-products { grid-template-columns: repeat(2, 1fr); gap: 16px 12px; } .pc-img img { height: 220px; } }
        @media (max-width: 480px)  { .grid-products { grid-template-columns: repeat(2, 1fr); gap: 10px 8px; } .pc-img img { height: 180px; } .pc-body { padding: 10px 8px 14px; } .pc-name { font-size: 12px; } .pc-price { font-size: 14px; } }
        @media (max-width: 360px)  { .grid-products { grid-template-columns: 1fr; } .pc-img img { height: 240px; } }

        /* List product */
        .lp {
          display: flex;
          gap: 0;
          background: #fff;
          border: 1px solid #e8e8e8;
          transition: box-shadow 0.3s;
          overflow: hidden;
        }
        .lp:hover { box-shadow: 0 6px 24px rgba(0,0,0,0.09); }
        .lp-img { position: relative; width: 240px; flex-shrink: 0; overflow: hidden; }
        .lp-img img { width: 100%; height: 210px; object-fit: cover; display: block; transition: transform 0.5s; }
        .lp:hover .lp-img img { transform: scale(1.04); }
        .lp-body { flex: 1; padding: 22px 22px 22px 24px; display: flex; flex-direction: column; justify-content: center; gap: 9px; }

        @media (max-width: 768px) {
          .lp { flex-direction: column; }
          .lp-img { width: 100%; }
          .lp-img img { height: 230px; width: 100%; }
          .lp-body { padding: 16px; }
        }

        .icon-btn {
          width: 38px; height: 38px;
          background: #fff;
          border: 1px solid #e0e0e0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .icon-btn:hover { border-color: #3dbda7; background: #f0faf8; }

        /* Pagination */
        .pg-wrap { display: flex; justify-content: center; gap: 4px; flex-wrap: wrap; }
        .pg-btn {
          min-width: 38px; height: 38px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid #ddd;
          background: #fff; color: #555;
          font-family: 'Open Sans', sans-serif; font-size: 13px;
          cursor: pointer; transition: all 0.2s;
          padding: 0 8px;
        }
        .pg-btn:hover, .pg-btn.on { background: #3dbda7; border-color: #3dbda7; color: #fff; }
        .pg-btn:disabled { opacity: 0.35; cursor: default; pointer-events: none; }

        /* Error box */
        .error-box {
          padding: 48px 24px;
          text-align: center;
          border: 1px solid #fde8e8;
          background: #fff8f8;
          border-radius: 4px;
        }
        .error-box h3 { color: #e74c3c; font-family: 'Open Sans', sans-serif; font-size: 18px; margin-bottom: 10px; }
        .error-box p  { color: #888; font-family: 'Open Sans', sans-serif; font-size: 13px; line-height: 1.8; }

        /* Responsive toolbar */
        @media (max-width: 640px) {
          .sort-sel { min-width: 160px; font-size: 12px; padding: 9px 32px 9px 10px; }
          .results-count { display: none; }
        }
        @media (max-width: 420px) {
          .toolbar { flex-wrap: wrap; }
          .toolbar-right { width: 100%; }
          .sort-sel { flex: 1; min-width: 0; }
        }
      `}</style>

      <Header />

      {/* ── BREADCRUMB BANNER ── */}
      <div style={{ background: "#6b6a5f", padding: "26px 0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <h2 style={{ fontFamily: "'Open Sans', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", letterSpacing: 1.5, textTransform: "uppercase" }}>
            Products List
            {pagination && !loading && (
              <span style={{ fontSize: 13, fontWeight: 400, letterSpacing: 0, marginLeft: 12, opacity: 0.6 }}>
                ({pagination.total} items)
              </span>
            )}
          </h2>
          <div style={{ fontFamily: "'Open Sans', sans-serif", fontSize: 12, color: "#ccc", display: "flex", alignItems: "center", gap: 8 }}>
            <a href="#" style={{ color: "#ccc", textDecoration: "none" }}>Home</a>
            <span style={{ color: "#888" }}>\</span>
            <span style={{ color: "#3dbda7" }}>Shop</span>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "36px 16px 60px", fontFamily: "'Open Sans', sans-serif" }}>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-left">
            <button className={"vbtn" + (view === "grid" ? " on" : "")} onClick={() => setView("grid")} title="Grid view">
              <svg width="18" height="18" viewBox="0 0 20 20" fill={view === "grid" ? "#fff" : "#666"}>
                <rect x="1" y="1" width="8" height="8" rx="1"/>
                <rect x="11" y="1" width="8" height="8" rx="1"/>
                <rect x="1" y="11" width="8" height="8" rx="1"/>
                <rect x="11" y="11" width="8" height="8" rx="1"/>
              </svg>
            </button>
            <button className={"vbtn" + (view === "list" ? " on" : "")} onClick={() => setView("list")} title="List view">
              <svg width="18" height="18" viewBox="0 0 20 20" fill={view === "list" ? "#fff" : "#666"}>
                <rect x="1" y="2"  width="18" height="4" rx="1"/>
                <rect x="1" y="8"  width="18" height="4" rx="1"/>
                <rect x="1" y="14" width="18" height="4" rx="1"/>
              </svg>
            </button>
          </div>

          <div className="toolbar-right">
            {pagination && !loading && (
              <span className="results-count">
                Showing {Math.min((page - 1) * 12 + 1, pagination.total)}–{Math.min(page * 12, pagination.total)} of {pagination.total}
              </span>
            )}
            <select className="sort-sel" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="menu_order">Default sorting</option>
              <option value="popularity">Sort by popularity</option>
              <option value="rating">Sort by average rating</option>
              <option value="price">Sort by price: low to high</option>
              <option value="price-desc">Sort by price: high to low</option>
            </select>
          </div>
        </div>

        <hr className="s-hr" />

        {/* ── ERROR STATE ── */}
        {apiError && (
          <div className="error-box">
            <h3>Could not load products</h3>
            <p>
              {apiError}<br />
              Make sure your API server is running at <code style={{ background: "#f5f5f5", padding: "1px 6px", borderRadius: 3 }}>{API_BASE}</code>
              <br /><br />
              <small style={{ color: "#bbb" }}>Check that XAMPP MySQL is running and the Express API is started.</small>
            </p>
          </div>
        )}

        {/* ── LOADING SKELETONS ── */}
        {loading && !apiError && (
          <div className="grid-products">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="pc" style={{ pointerEvents: "none" }}>
                <div className="skeleton" style={{ height: 280 }} />
                <div className="pc-body">
                  <div className="skeleton" style={{ height: 12, width: "50%", marginBottom: 4 }} />
                  <div className="skeleton" style={{ height: 15, width: "80%" }} />
                  <div className="skeleton" style={{ height: 11, width: "40%" }} />
                  <div className="skeleton" style={{ height: 20, width: "35%", marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── GRID VIEW ── */}
        {!loading && !apiError && view === "grid" && (
          <div className="grid-products">
            {sorted.map((p) => (
              <div key={p.ID} className="pc">
                <div className="pc-img">
                  {p.isSale && <div className="sale-ribbon">SALE</div>}
                  <img
                    src={p.resolvedImg}
                    alt={p.product_title || "Product"}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = CATEGORY_FALLBACKS.default;
                    }}
                  />
                  <div className="pc-overlay">
                    {overlayIcons.map(({ title, icon }) => (
                      <button
                        key={title}
                        className="ov-btn"
                        title={title}
                        onClick={(e) => { e.stopPropagation(); title === "Wishlist" && toggle(p.ID); }}
                      >
                        {icon("#555", title === "Wishlist" && wishlist.includes(p.ID))}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pc-body">
                  {p.sku && <span className="pc-sku">SKU: {p.sku}</span>}
                  <a href={`/store/product-details?id=${p.ID}`} className="pc-name">
                    {p.product_title}
                  </a>
                  <StarRating rating={p.rating} size={13} />
                  <a href="#" className="pc-review">(0 Customer reviews)</a>
                  <div className="pc-price">
                    {p.priceRange && p.priceRange.min !== p.priceRange.max ? (
                      <span className="pc-price-range">
                        ${p.priceRange.min.toFixed(2)} – ${p.priceRange.max.toFixed(2)}
                      </span>
                    ) : (
                      <span>${p.priceRange ? p.priceRange.min.toFixed(2) : p.price ? parseFloat(p.price).toFixed(2) : "—"}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {!loading && !apiError && view === "list" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {sorted.map((p) => (
              <div key={p.ID} className="lp">
                <div className="lp-img">
                  {p.isSale && <div className="sale-ribbon">SALE</div>}
                  <img
                    src={p.resolvedImg}
                    alt={p.product_title || "Product"}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = CATEGORY_FALLBACKS.default;
                    }}
                  />
                </div>
                <div className="lp-body">
                  <a href={`/store/product-details?id=${p.ID}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#222", lineHeight: 1.3 }}>
                      {p.product_title}
                    </h3>
                  </a>
                  <StarRating rating={p.rating} size={15} />
                  <div style={{ fontSize: 11, color: "#bbb" }}>(0 Customer reviews)</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {p.priceRange && p.priceRange.min !== p.priceRange.max ? (
                      <span style={{ fontSize: 19, fontWeight: 700, color: "#3dbda7" }}>
                        ${p.priceRange.min.toFixed(2)} – ${p.priceRange.max.toFixed(2)}
                      </span>
                    ) : (
                      <span style={{ fontSize: 20, fontWeight: 700, color: "#222" }}>
                        ${p.priceRange ? p.priceRange.min.toFixed(2) : p.price ? parseFloat(p.price).toFixed(2) : "—"}
                      </span>
                    )}
                    {p.sku && (
                      <span style={{ fontSize: 11, color: "#ccc", marginLeft: 4 }}>SKU: {p.sku}</span>
                    )}
                  </div>
                  {p.product_short_desc ? (
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#888", lineHeight: 1.75, maxWidth: 600 }}
                      dangerouslySetInnerHTML={{
                        __html: p.product_short_desc.replace(/<[^>]+>/g, "").substring(0, 220) +
                          (p.product_short_desc.replace(/<[^>]+>/g, "").length > 220 ? "..." : ""),
                      }}
                    />
                  ) : (
                    <p style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "#bbb", lineHeight: 1.75 }}>
                      Quality ocean-themed product from Ocean Cowboy.
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    {overlayIcons.map(({ title, icon }) => (
                      <button
                        key={title}
                        className="icon-btn"
                        title={title}
                        onClick={() => title === "Wishlist" && toggle(p.ID)}
                      >
                        {icon("#555", title === "Wishlist" && wishlist.includes(p.ID))}
                      </button>
                    ))}
                    <a
                      href={`/store/product-details?id=${p.ID}`}
                      style={{
                        marginLeft: 8,
                        padding: "9px 18px",
                        background: "#1a1a1a",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      View Product
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── PAGINATION ── */}
        {!loading && !apiError && totalPages > 1 && (
          <>
            <hr className="s-hr" style={{ marginTop: 48 }} />
            <div className="pg-wrap">
              <button className="pg-btn" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} className={"pg-btn" + (page === n ? " on" : "")} onClick={() => setPage(n)}>{n}</button>
              ))}
              <button className="pg-btn" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>›</button>
            </div>
          </>
        )}

        {/* ── EMPTY STATE ── */}
        {!loading && !apiError && products.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#999", fontFamily: "'Open Sans', sans-serif" }}>
            <p style={{ fontSize: 16 }}>No products found.</p>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
