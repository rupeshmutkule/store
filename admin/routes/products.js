/**
 * admin/routes/products.js
 * Product API for the frontend e-commerce store
 * Mounted in app.js as: app.use('/api', require('./routes/products'))
 *
 * Endpoints:
 *   GET /api/health
 *   GET /api/products
 *   GET /api/products/:id
 *   GET /api/products/:id/variants
 *   GET /api/products/:id/price?color=blue&size=l
 */

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── Helper: promisify your existing db connection ─────────
// Works with mysql / mysql2 pool or connection object
async function query(sql, params = []) {
  // Use query() to avoid prepared statement issues with some MySQL configs
  const [rows] = await db.query(sql, params);
  return rows;
}

// ── Parse PHP serialized _default_attributes ──────────────
// e.g. 'a:2:{s:8:"pa_color";s:15:"blue-ocean-camo";s:7:"pa_size";s:1:"l";}'
// → { color: "blue-ocean-camo", size: "l" }
function parsePhpAttributes(str) {
  const result = {};
  if (!str) return result;
  const re = /s:\d+:"([^"]+)";s:\d+:"([^"]+)"/g;
  let m;
  while ((m = re.exec(str)) !== null) {
    // strip "pa_" prefix so "pa_color" → "color", "pa_size" → "size"
    result[m[1].replace(/^pa_/, '')] = m[2];
  }
  return result;
}

// ══════════════════════════════════════════════════════════
//  CORE FUNCTION: Build full variant map for a parent product
// ══════════════════════════════════════════════════════════
//
//  HOW THE MAPPING WORKS:
//  ─────────────────────
//  tbl_products (parent_id=0, product_type='product')
//    └── tbl_products (parent_id=6684, product_type='product_variation')
//          Each variation = one specific color+size combo (e.g. Blue+L)
//
//  tbl_productmeta per variation:
//    attribute_pa_color = 'blue'
//    attribute_pa_size  = 'l'
//    _price             = '49.00' 
//    _stock_status      = 'instock' | 'outofstock'
//    _sku               = 'OCHOODIE-BL-L'
//    _thumbnail_id      = 6703
//    woo_variation_gallery_images = serialized array of image IDs
//
//  tbl_attributes_lookup:
//    product_or_parent_id = 6684  (parent)
//    taxonomy = 'pa_color' | 'pa_size'
//    attr_id  → maps to tbl_attributes.attr_id
//
//  tbl_attributes:
//    attr_id | attr_name | attr_slug
//    e.g. 116 = 'Blue' / 'blue'
//
// ══════════════════════════════════════════════════════════
async function buildProductVariants(parentId) {

  // 1. Get parent product row
  const parentRows = await query(
    `SELECT ID, product_title, product_content, product_short_desc, product_status
     FROM tbl_products
     WHERE ID = ? AND product_type = 'product'`,
    [parentId]
  );
  if (!parentRows.length) return null;
  const parent = parentRows[0];

  // 2. Get parent-level meta (_sku, _thumbnail_id, _price, _default_attributes)
  const parentMeta = await query(
    `SELECT meta_key, meta_value FROM tbl_productmeta
     WHERE product_id = ?
       AND meta_key IN ('_sku','_thumbnail_id','_price','_regular_price','_default_attributes')`,
    [parentId]
  );
  const pm = {};
  for (const r of parentMeta) pm[r.meta_key] = r.meta_value;

  // Parse default color + size from PHP serialized string
  const defaults = parsePhpAttributes(pm['_default_attributes']);

  // 3. Get all child variation IDs for this parent
  const variationRows = await query(
    `SELECT ID FROM tbl_products
     WHERE parent_id = ? AND product_type = 'product_variation' AND product_status = 'publish'
     ORDER BY menu_order ASC`,
    [parentId]
  );
  const variationIds = variationRows.map(r => r.ID);

  if (!variationIds.length) {
    return {
      product_id: parent.ID, product_name: parent.product_title,
      description: parent.product_content, short_desc: parent.product_short_desc,
      sku: pm['_sku'] || '', thumbnail_id: pm['_thumbnail_id'] ? parseInt(pm['_thumbnail_id']) : null,
      price_range: { min: 0, max: 0 }, default_color: '', default_size: '',
      colors: [], sizes: [], variants: [],
    };
  }

  const idPH = variationIds.map(() => '?').join(',');

  // 4. Fetch ALL variation meta in one query (no N+1)
  const varMeta = await query(
    `SELECT product_id, meta_key, meta_value FROM tbl_productmeta
     WHERE product_id IN (${idPH})
       AND meta_key IN (
         'attribute_pa_color', 'attribute_pa_size',
         '_price', '_regular_price', '_stock_status',
         '_thumbnail_id', '_sku', 'woo_variation_gallery_images'
       )`,
    variationIds
  );

  // Group meta by variation product_id
  const varMetaMap = {};
  for (const r of varMeta) {
    if (!varMetaMap[r.product_id]) varMetaMap[r.product_id] = {};
    varMetaMap[r.product_id][r.meta_key] = r.meta_value;
  }

  // 5. Get distinct attr_ids from lookup for this parent product
  const lookupRows = await query(
    `SELECT DISTINCT taxonomy, attr_id
     FROM tbl_attributes_lookup
     WHERE product_or_parent_id = ?`,
    [parentId]
  );
  const colorAttrIds = lookupRows.filter(r => r.taxonomy === 'pa_color').map(r => r.attr_id);
  const sizeAttrIds  = lookupRows.filter(r => r.taxonomy === 'pa_size').map(r => r.attr_id);

  // 6. Fetch attribute names for all involved attr_ids
  const allAttrIds = [...colorAttrIds, ...sizeAttrIds];
  const attrNameMap = {};
  if (allAttrIds.length) {
    const aPH = allAttrIds.map(() => '?').join(',');
    const attrRows = await query(
      `SELECT attr_id, attr_name, attr_slug FROM tbl_attributes WHERE attr_id IN (${aPH})`,
      allAttrIds
    );
    for (const a of attrRows) attrNameMap[a.attr_id] = { name: a.attr_name, slug: a.attr_slug };
  }

  // 7. Build flat variant list from all variation children
  const colorSlugToName    = {};
  const sizeSlugToName     = {};
  const colorSlugToImageId = {};
  const variantList        = [];
  let priceMin = Infinity, priceMax = -Infinity;

  for (const vid of variationIds) {
    const meta      = varMetaMap[vid] || {};
    const colorSlug = meta['attribute_pa_color'];
    const sizeSlug  = meta['attribute_pa_size'];
    const price     = parseFloat(meta['_price'] || meta['_regular_price'] || '0');
    const inStock   = meta['_stock_status'] === 'instock';
    const thumbId   = meta['_thumbnail_id'] ? parseInt(meta['_thumbnail_id']) : null;
    const sku       = meta['_sku'] || '';

    // Parse gallery IDs from PHP serialized: a:2:{i:0;i:6701;i:1;i:6702;}
    let galleryIds = [];
    const gr = meta['woo_variation_gallery_images'];
    if (gr) {
      const gm = gr.match(/i:\d+;i:(\d+)/g);
      if (gm) galleryIds = gm.map(m => parseInt(m.split(';i:')[1]));
    }

    if (!colorSlug || !sizeSlug) continue;

    // Resolve display name from tbl_attributes via attr_id+slug matching
    if (!colorSlugToName[colorSlug]) {
      const matched = colorAttrIds.find(id => attrNameMap[id]?.slug === colorSlug);
      colorSlugToName[colorSlug] = matched ? attrNameMap[matched].name : colorSlug;
    }
    if (!sizeSlugToName[sizeSlug]) {
      const matched = sizeAttrIds.find(id => attrNameMap[id]?.slug === sizeSlug);
      sizeSlugToName[sizeSlug] = matched ? attrNameMap[matched].name : sizeSlug.toUpperCase();
    }
    // Track first thumbnail per color (used for color swatch image)
    if (thumbId && !colorSlugToImageId[colorSlug]) colorSlugToImageId[colorSlug] = thumbId;

    if (price > 0) {
      if (price < priceMin) priceMin = price;
      if (price > priceMax) priceMax = price;
    }

    variantList.push({ variation_id: vid, colorSlug, sizeSlug, price, inStock, sku, thumbId, galleryIds });
  }

  // 8. Sort sizes in correct garment order
  const sizeOrder = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl'];
  const sortSize  = s => { const i = sizeOrder.indexOf(s.toLowerCase()); return i === -1 ? 99 : i; };

  // 9. Group variants by color → sizes
  const colorMap = {};
  for (const v of variantList) {
    if (!colorMap[v.colorSlug]) colorMap[v.colorSlug] = [];
    colorMap[v.colorSlug].push({
      size        : v.sizeSlug,
      size_name   : sizeSlugToName[v.sizeSlug] || v.sizeSlug.toUpperCase(),
      variation_id: v.variation_id,
      price       : v.price,
      in_stock    : v.inStock,
      sku         : v.sku,
      thumbnail_id: v.thumbId,
      gallery_ids : v.galleryIds,
    });
  }
  // Sort sizes within each color group
  for (const slug of Object.keys(colorMap)) {
    colorMap[slug].sort((a, b) => sortSize(a.size) - sortSize(b.size));
  }

  // 10. Build final variants array (unique colors in the order they first appear)
  const seenColors = [];
  const variants   = [];
  for (const v of variantList) {
    if (!seenColors.includes(v.colorSlug)) {
      seenColors.push(v.colorSlug);
      variants.push({
        color     : v.colorSlug,
        color_name: colorSlugToName[v.colorSlug] || v.colorSlug,
        image_id  : colorSlugToImageId[v.colorSlug] || null,
        sizes     : colorMap[v.colorSlug],
      });
    }
  }

  // 11. Flat color + size lists for the frontend dropdowns/swatches
  const colors = variants.map(v => ({ slug: v.color, name: v.color_name, image_id: v.image_id }));

  const allSizeSlugs = [...new Set(variantList.map(v => v.sizeSlug))];
  allSizeSlugs.sort((a, b) => sortSize(a) - sortSize(b));
  const sizes = allSizeSlugs.map(s => ({ slug: s, name: sizeSlugToName[s] || s.toUpperCase() }));

  return {
    product_id   : parent.ID,
    product_name : parent.product_title,
    description  : parent.product_content,
    short_desc   : parent.product_short_desc,
    sku          : pm['_sku'] || '',
    thumbnail_id : pm['_thumbnail_id'] ? parseInt(pm['_thumbnail_id']) : null,
    price_range  : {
      min: priceMin === Infinity  ? 0 : priceMin,
      max: priceMax === -Infinity ? 0 : priceMax,
    },
    default_color: defaults.color || (colors[0]?.slug ?? ''),
    default_size : defaults.size  || (sizes[0]?.slug  ?? ''),
    colors,
    sizes,
    variants,
  };
}

// ════════════════════════════════════════════════════════════
//  ROUTE HANDLERS
// ════════════════════════════════════════════════════════════

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/products  — paginated list of parent products
router.get('/products', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page)  || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 12);
    const offset = (page - 1) * limit;

    const countRows = await query(
      `SELECT COUNT(*) AS total FROM tbl_products
       WHERE product_type = 'product' AND product_status = 'publish'`
    );
    const total = countRows[0].total;

    const products = await query(
      `SELECT p.ID, p.product_title, p.product_short_desc, p.product_url,
              pm_price.meta_value AS price,
              pm_thumb.meta_value AS thumbnail_id,
              pm_sku.meta_value   AS sku
       FROM tbl_products p
       LEFT JOIN tbl_productmeta pm_price ON pm_price.product_id = p.ID AND pm_price.meta_key = '_price'
       LEFT JOIN tbl_productmeta pm_thumb ON pm_thumb.product_id = p.ID AND pm_thumb.meta_key = '_thumbnail_id'
       LEFT JOIN tbl_productmeta pm_sku   ON pm_sku.product_id   = p.ID AND pm_sku.meta_key   = '_sku'
       WHERE p.product_type = 'product' AND p.product_status = 'publish'
       ORDER BY p.ID DESC
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.json({
      success   : true,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      data      : products,
    });
  } catch (err) {
    console.error('[GET /api/products]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id  — full product detail with all variants
router.get('/products/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid product ID' });

    const data = await buildProductVariants(id);
    if (!data) return res.status(404).json({ success: false, error: 'Product not found' });

    res.json({ success: true, data });
  } catch (err) {
    console.error('[GET /api/products/:id]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id/variants
// Lighter call — only colors, sizes, variants + price_range
// This is what the product-details.tsx page calls on load
router.get('/products/:id/variants', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ success: false, error: 'Invalid product ID' });

    const data = await buildProductVariants(id);
    if (!data) return res.status(404).json({ success: false, error: 'Product not found' });

    res.json({
      success      : true,
      product_id   : data.product_id,
      product_name : data.product_name,
      short_desc   : data.short_desc,
      description  : data.description,
      price_range  : data.price_range,
      default_color: data.default_color,
      default_size : data.default_size,
      colors       : data.colors,
      sizes        : data.sizes,
      variants     : data.variants,
    });
  } catch (err) {
    console.error('[GET /api/products/:id/variants]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/:id/price?color=blue&size=l
// Called every time user selects a color+size combo on product page
// Returns exact price + stock status for that specific variation
router.get('/products/:id/price', async (req, res) => {
  try {
    const parentId = parseInt(req.params.id);
    const color    = (req.query.color || '').toLowerCase().trim();
    const size     = (req.query.size  || '').toLowerCase().trim();

    if (isNaN(parentId)) return res.status(400).json({ success: false, error: 'Invalid product ID' });
    if (!color || !size)  return res.status(400).json({ success: false, error: 'color and size query params required' });

    // Get all variation IDs belonging to this parent
    const variationRows = await query(
      `SELECT ID FROM tbl_products
       WHERE parent_id = ? AND product_type = 'product_variation' AND product_status = 'publish'`,
      [parentId]
    );
    const variationIds = variationRows.map(r => r.ID);
    if (!variationIds.length) return res.status(404).json({ success: false, error: 'No variations found' });

    const idPH = variationIds.map(() => '?').join(',');

    // Step 1: find variations matching the selected color
    const colorMatches = await query(
      `SELECT product_id FROM tbl_productmeta
       WHERE product_id IN (${idPH})
         AND meta_key = 'attribute_pa_color'
         AND meta_value = ?`,
      [...variationIds, color]
    );
    const colorIds = colorMatches.map(r => r.product_id);
    if (!colorIds.length) return res.status(404).json({ success: false, error: `Color '${color}' not found` });

    const cPH = colorIds.map(() => '?').join(',');

    // Step 2: among those, find the one also matching size
    const sizeMatches = await query(
      `SELECT product_id FROM tbl_productmeta
       WHERE product_id IN (${cPH})
         AND meta_key = 'attribute_pa_size'
         AND meta_value = ?`,
      [...colorIds, size]
    );
    if (!sizeMatches.length) {
      return res.status(404).json({ success: false, error: `Size '${size}' not available for color '${color}'` });
    }

    const variationId = sizeMatches[0].product_id;

    // Step 3: fetch price, stock, sku, images for that variation
    const metaRows = await query(
      `SELECT meta_key, meta_value FROM tbl_productmeta
       WHERE product_id = ?
         AND meta_key IN (
           '_price', '_regular_price', '_stock_status',
           '_thumbnail_id', '_sku', 'woo_variation_gallery_images'
         )`,
      [variationId]
    );
    const meta = {};
    for (const m of metaRows) meta[m.meta_key] = m.meta_value;

    // Parse gallery image IDs
    let galleryIds = [];
    const gr = meta['woo_variation_gallery_images'];
    if (gr) {
      const gm = gr.match(/i:\d+;i:(\d+)/g);
      if (gm) galleryIds = gm.map(m => parseInt(m.split(';i:')[1]));
    }

    res.json({
      success     : true,
      variation_id: variationId,
      color,
      size,
      price       : meta['_price'] || meta['_regular_price'] || null,
      in_stock    : meta['_stock_status'] === 'instock',
      sku         : meta['_sku'] || '',
      thumbnail_id: meta['_thumbnail_id'] ? parseInt(meta['_thumbnail_id']) : null,
      gallery_ids : galleryIds,
    });
  } catch (err) {
    console.error('[GET /api/products/:id/price]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
