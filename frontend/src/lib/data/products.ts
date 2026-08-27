import { ProductCategory, ProductListItem, Product } from '@/types';

// ─── Helper to build a static Media object ──────────────────────────────────
function makeMedia(id: number, file: string, alt: string) {
  return { id, file, alt_text: alt, title: alt, caption: '', created_at: '2025-01-01T00:00:00Z' };
}

function makeProductImage(id: number, file: string, alt: string, primary = true) {
  return { id, media: makeMedia(id, file, alt), alt_text: alt, caption: '', sort_order: 0, is_primary: primary };
}

// ─── Product Categories ──────────────────────────────────────────────────────
export const STATIC_CATEGORIES: ProductCategory[] = [
  {
    id: 1, name: 'FRP/GRP Products', slug: 'frp-grp-products',
    short_description: 'Corrosion-resistant fiberglass reinforced plastic floor grids and structural products.',
    description: 'Detailed range of premium Arabian Gratings FRP/GRP Products designed for industrial engineering works across Saudi Arabia and GCC region. Engineered with isophthalic polyester or vinyl ester resin matrices for extreme chemical environments.',
    image: makeMedia(1, '/product-frp-grating.jpg', 'FRP GRP Grating Products'),
    is_active: true, sort_order: 0, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 2, name: 'Steel Gratings', slug: 'steel-gratings',
    short_description: 'Heavy-duty electroforge welded carbon steel floor gratings galvanized for extreme load spans.',
    description: 'Detailed range of premium Arabian Gratings Steel Gratings designed for industrial engineering works across Saudi Arabia and GCC region. Fabricated using ASTM A36 carbon steel, hot-dip galvanized to ISO 1461.',
    image: makeMedia(2, '/product-steel-grating.jpg', 'Steel Grating Products'),
    is_active: true, sort_order: 1, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 3, name: 'Stainless Steel Products', slug: 'stainless-steel-products',
    short_description: 'Premium hygiene-safe SS304/SS316 grating panels for food processing and marine decks.',
    description: 'Detailed range of premium Arabian Gratings Stainless Steel Products designed for industrial engineering works across Saudi Arabia and GCC region.',
    image: makeMedia(3, '/product-ss-grating.jpg', 'Stainless Steel Products'),
    is_active: true, sort_order: 2, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 4, name: 'Aluminium', slug: 'aluminium',
    short_description: 'Lightweight, non-sparking walkways, access grates and stair steps.',
    description: 'Detailed range of premium Arabian Gratings Aluminium products designed for industrial engineering works across Saudi Arabia and GCC region.',
    image: makeMedia(4, '/product-aluminium-grating.jpg', 'Aluminium Grating Products'),
    is_active: true, sort_order: 3, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 5, name: 'Manhole', slug: 'manhole',
    short_description: 'Ductile iron and GRP heavy-load manhole access covers for roads and infrastructure.',
    description: 'Detailed range of premium Arabian Gratings Manhole Covers designed for industrial engineering works across Saudi Arabia and GCC region.',
    image: makeMedia(5, '/product-manhole-cover.jpg', 'Manhole Cover Products'),
    is_active: true, sort_order: 4, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 6, name: 'SS/GI Grating Clamps', slug: 'ss-gi-grating-clamps',
    short_description: 'Secure installation fasteners, clamps, and clips for structural mounting.',
    description: 'Detailed range of premium Arabian Gratings SS/GI Grating Clamps designed for industrial engineering works across Saudi Arabia and GCC region.',
    image: makeMedia(6, '/product-grating-clamp.jpg', 'Grating Clamp Products'),
    is_active: true, sort_order: 5, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 7, name: 'Step Iron', slug: 'step-iron',
    short_description: 'Ductile iron and GRP step ladders for safe manhole shaft descents.',
    description: 'Detailed range of premium Arabian Gratings Step Iron products designed for industrial engineering works across Saudi Arabia and GCC region.',
    image: makeMedia(7, '/product-step-iron.jpg', 'Step Iron Products'),
    is_active: true, sort_order: 6, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 8, name: 'Stud Products', slug: 'stud-products',
    short_description: 'Non-slip tactile pavement studs and anti-slip access dots.',
    description: 'Detailed range of premium Arabian Gratings Stud Products designed for industrial engineering works across Saudi Arabia and GCC region.',
    image: makeMedia(8, '/product-tactile-stud.jpg', 'Stud Products'),
    is_active: true, sort_order: 7, product_count: 1,
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
];

// ─── Helper: find category by slug ──────────────────────────────────────────
function cat(slug: string): ProductCategory {
  return STATIC_CATEGORIES.find(c => c.slug === slug)!;
}

// ─── Products (list shape) ───────────────────────────────────────────────────
export const STATIC_PRODUCTS: ProductListItem[] = [
  {
    id: 1, name: 'Moulded GRP Walkway Grating', slug: 'moulded-grp-walkway-grating',
    product_code: 'AG-FRP-001',
    category_name: 'FRP/GRP Products', category_slug: 'frp-grp-products',
    short_description: 'Chemical-safe fiberglass floor grids with slip-resistant grit finishes. Engineered for refinery utility yards.',
    material: 'GRP / Fiberglass', finish: 'Gritted Anti-Slip Surface', standard: 'ISO 14122 / ASTM D7779',
    applications: 'Refineries, Offshore Platforms, Chemical Plants, Desalination Plants',
    primary_image: makeProductImage(1, '/product-frp-grating.jpg', 'Moulded GRP Walkway Grating'),
    is_featured: true, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 2, name: 'Electroforged Welded Steel Grating', slug: 'electroforged-welded-steel-grating',
    product_code: 'AG-STL-001',
    category_name: 'Steel Gratings', category_slug: 'steel-gratings',
    short_description: 'Industrial heavy-duty metal floors galvanized to ISO 1461. Fabricated with high-strength load bearing bars.',
    material: 'ASTM A36 Carbon Steel', finish: 'ISO 1461 Hot-Dip Galvanized', standard: 'BS EN 14122-2 / ASTM A985',
    applications: 'Industrial Platforms, Mezzanine Floors, Walkways, Drainage Covers',
    primary_image: makeProductImage(2, '/product-steel-grating.jpg', 'Electroforged Welded Steel Grating'),
    is_featured: true, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 3, name: 'Stainless Steel SS316 Floor Grating', slug: 'stainless-steel-ss316-floor-grating',
    product_code: 'AG-SS-001',
    category_name: 'Stainless Steel Products', category_slug: 'stainless-steel-products',
    short_description: 'Premium hygiene-safe SS316 grating panels. Engineered for extreme food processing and seawater splash decks.',
    material: 'SS316 / SS304 Stainless Steel', finish: 'Electro-Polished / Pickled', standard: 'ASTM A240 / BS 1554',
    applications: 'Food Processing Plants, Pharmaceutical Facilities, Marine Decks, Coastal Splash Zones',
    primary_image: makeProductImage(3, '/product-ss-grating.jpg', 'Stainless Steel SS316 Floor Grating'),
    is_featured: true, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 4, name: 'Aluminium Access Grating Walkway', slug: 'aluminium-access-grating-walkway',
    product_code: 'AG-ALU-001',
    category_name: 'Aluminium', category_slug: 'aluminium',
    short_description: 'Lightweight, non-sparking walkways and access grates. Ideal for high architectural finishes.',
    material: 'Aluminium Alloy 6063-T6', finish: 'Mill Finish / Anodized', standard: 'EN 1090 / BS 8110',
    applications: 'Architectural Walkways, Volatile Environments, Roof Access, Marine Applications',
    primary_image: makeProductImage(4, '/product-aluminium-grating.jpg', 'Aluminium Access Grating Walkway'),
    is_featured: true, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 5, name: 'Ductile Iron Double Sealed Manhole Cover', slug: 'ductile-iron-double-sealed-manhole-cover',
    product_code: 'AG-MH-001',
    category_name: 'Manhole', category_slug: 'manhole',
    short_description: 'Heavy-duty D400 traffic load rated ductile iron covers with double seal frames to prevent odor escaping.',
    material: 'Ductile Iron GGG-40 / GGG-50', finish: 'Epoxy Coated / Bituminous Paint', standard: 'EN 124 Class D400',
    applications: 'Roads, Highways, Airports, Municipal Infrastructure',
    primary_image: makeProductImage(5, '/product-manhole-cover.jpg', 'Ductile Iron Manhole Cover'),
    is_featured: true, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 6, name: 'M-Clip Grating Fastening Clamp', slug: 'm-clip-grating-fastening-clamp',
    product_code: 'AG-CLM-001',
    category_name: 'SS/GI Grating Clamps', category_slug: 'ss-gi-grating-clamps',
    short_description: 'Structural fastening clips in SS316. Ensures secure anchoring of panels onto structural beams.',
    material: 'SS316 / GI Steel', finish: 'Electropolished / Zinc Plated', standard: 'ISO 4014 / DIN 934',
    applications: 'Steel Grating Installation, Platform Anchoring, Industrial Flooring',
    primary_image: makeProductImage(6, '/product-grating-clamp.jpg', 'M-Clip Grating Fastening Clamp'),
    is_featured: false, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 7, name: 'Ductile Iron Plastic Encapsulated Step Iron', slug: 'ductile-iron-plastic-encapsulated-step-iron',
    product_code: 'AG-STP-001',
    category_name: 'Step Iron', category_slug: 'step-iron',
    short_description: 'High-durability plastic encapsulated ductile iron steps for utility chambers and sewer manholes.',
    material: 'Ductile Iron / Virgin Polypropylene', finish: 'Plastic Encapsulated', standard: 'BS 1247 / EN 13101',
    applications: 'Manhole Shafts, Sewer Chambers, Utility Inspection Pits',
    primary_image: makeProductImage(7, '/product-step-iron.jpg', 'Ductile Iron Step Iron'),
    is_featured: false, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
  {
    id: 8, name: 'Stainless Steel Tactile Stud', slug: 'stainless-steel-tactile-stud',
    product_code: 'AG-STD-001',
    category_name: 'Stud Products', category_slug: 'stud-products',
    short_description: 'Anti-slip tactile pavement warning studs in SS316. Engineered for pedestrian accessibility safety.',
    material: 'SS316 Stainless Steel', finish: 'Polished / Satin', standard: 'BS 8300 / ADA Compliant',
    applications: 'Pedestrian Crossings, Platform Edges, Accessibility Paths, Public Spaces',
    primary_image: makeProductImage(8, '/product-tactile-stud.jpg', 'Stainless Steel Tactile Stud'),
    is_featured: false, is_active: true, sort_order: 0, created_at: '2025-01-01T00:00:00Z',
    no_index: false, seo_title: null, seo_description: null, canonical_url: null, og_title: null, og_description: null, og_image: null,
  },
];

// ─── Full Product Detail shape (for /products/[slug] pages) ─────────────────
export const STATIC_PRODUCTS_DETAIL: Product[] = STATIC_PRODUCTS.map(p => ({
  ...p,
  product_code: p.product_code,
  category: cat(p.category_slug),
  description: (() => {
    const descs: Record<string, string> = {
      'moulded-grp-walkway-grating': 'Arabian Gratings Moulded GRP (Glass Reinforced Plastic) gratings are engineered with isophthalic polyester or chemical-grade vinyl ester resin matrices. Ideal for highly corrosive environments such as desalination plants, chemical facilities, and offshore oil platforms. Our GRP grating systems comply with EN 13706 and offer exceptional corrosion resistance, low weight, and superior anti-slip properties.',
      'electroforged-welded-steel-grating': 'Arabian Gratings Electroforged Steel Grating is fabricated using high-strength carbon steel structural bars. Cross rods are electrically fused into the load-bearing bars under heavy hydraulic pressure to create a single-piece, rigid grid layout suitable for high wheel load spans. All panels are hot-dip galvanized to ISO 1461 for long-term corrosion protection.',
      'stainless-steel-ss316-floor-grating': 'Premium stainless steel gratings engineered to satisfy demanding sanitary and extreme chemical corrosion regulations. Commonly specified in wastewater treatment plants, chemical process vessels, pharmaceutical labs, and coastal splash zones. Available in SS304 and SS316 grades with electro-polished or pickled finishes.',
      'aluminium-access-grating-walkway': 'Lightweight aluminium grating systems engineered for walkways, screen panel systems, and architectural facades where deadweight parameters are restricted. Non-sparking properties make it suitable for volatile environments such as fuel storage facilities and paint booths.',
      'ductile-iron-double-sealed-manhole-cover': 'Premium ductile iron manhole covers featuring double-seal designs and secure locking blocks. Designed to withstand heavy vehicular wheel traffic and comply with regional municipal infrastructure standards. Available in multiple load classes from A15 to F900.',
      'm-clip-grating-fastening-clamp': 'Arabian Gratings M-Clip clamping kits are engineered to anchor grating panels directly to structural steel support members. Ensures high shear resistance under severe vibrations and dynamic loading conditions commonly found on offshore and industrial platforms.',
      'ductile-iron-plastic-encapsulated-step-iron': 'High safety step irons designed for waste utility chambers, inspection pits, and sewer shafts. Features a high-tensile ductile iron core encapsulated in chemical-proof virgin polypropylene plastic for enhanced chemical resistance and anti-corrosion performance.',
      'stainless-steel-tactile-stud': 'High-end stainless steel tactile warning studs designed to assist visually impaired pedestrians at crosswalks, stairs, and platform edges. Meets international accessibility guidelines including BS 8300, ADA, and ISO 21542.',
    };
    return descs[p.slug] || p.short_description;
  })(),
  description_blocks: [],
  features: '',
  specifications: {},
  spec_rows: [],
  faq: [],
  meta_keywords: `${p.name}, ${p.material}, Arabian Gratings, Saudi Arabia`,
  product_images: p.primary_image ? [p.primary_image] : [],
  documents: [],
  related_products: [],
  updated_at: '2025-01-01T00:00:00Z',
}));
