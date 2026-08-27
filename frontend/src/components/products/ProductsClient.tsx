'use client';
// Force reload client cache
import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { ProductListItem, ProductCategory } from '@/types';
import { getImageUrl } from '@/lib/api/client';

interface ProductsClientProps {
  initialProducts: ProductListItem[];
  categories: ProductCategory[];
}

// ─── Product Card ────────────────────────────────────────────────────────────

function ProductCard({ product, index }: { product: ProductListItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' });
  const [hovered, setHovered] = useState(false);

  const imageUrl = getImageUrl(product.primary_image?.media?.file);
  const imageAlt =
    product.primary_image?.alt_text ||
    product.primary_image?.media?.alt_text ||
    `${product.name} — Arabian Gratings Saudi Arabia`;

  const productIndex = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="flex flex-col bg-white border border-[#D9DDE1] overflow-hidden h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/products/${product.slug}`}
        className="group flex flex-col flex-1 focus-visible:ring-2 focus-visible:ring-[#E8612C] outline-none"
        aria-label={`View ${product.name} product details`}
      >
        {/* Image area */}
        <div className="relative aspect-[4/3] overflow-hidden bg-[#F4F5F6]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out"
              style={{ transform: hovered ? 'scale(1.04)' : 'scale(1)' }}
            />
          ) : (
            /* Elegant placeholder when no image is loaded yet */
            <div className="absolute inset-0 flex items-center justify-center bg-[#F0F1F3]">
              <div className="grid grid-cols-4 gap-1 opacity-20">
                {Array.from({ length: 32 }).map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-[#111318]" />
                ))}
              </div>
            </div>
          )}

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="inline-block bg-white/90 backdrop-blur-sm border border-[#D9DDE1] text-[9px] font-mono font-bold text-[#111318] uppercase tracking-widest px-2 py-1">
              {product.category_name}
            </span>
          </div>

          {/* Amber line animation on hover */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-[#E8612C]"
            initial={{ width: 0 }}
            animate={{ width: hovered ? '100%' : 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>

        {/* Card body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Product index */}
          <span className="text-[9px] font-mono text-[#E8612C] tracking-[0.2em] font-bold mb-2">
            {productIndex}
          </span>

          {/* Product name */}
          <h2 className="text-base font-display font-black text-[#111318] uppercase tracking-wide leading-tight mb-2 group-hover:text-[#E8612C] transition-colors duration-200">
            {product.name}
          </h2>

          {/* Short description */}
          <p className="text-xs text-[#6B7280] leading-relaxed mb-4 line-clamp-2 flex-1">
            {product.short_description}
          </p>

          {/* Technical meta strip */}
          <div className="border-t border-[#D9DDE1] pt-3 mb-2 space-y-1.5">
            {product.material && (
              <div className="flex items-start gap-3">
                <span className="text-[9px] font-mono font-bold text-[#9CA3AF] uppercase tracking-widest w-20 shrink-0 pt-px">Material</span>
                <span className="text-[11px] font-mono font-semibold text-[#111318]">{product.material}</span>
              </div>
            )}
            {product.applications && (
              <div className="flex items-start gap-3">
                <span className="text-[9px] font-mono font-bold text-[#9CA3AF] uppercase tracking-widest w-20 shrink-0 pt-px">Application</span>
                <span className="text-[11px] font-mono text-[#6B7280] line-clamp-1">{product.applications}</span>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* Action buttons */}
      <div className="flex border-t border-[#D9DDE1] bg-[#F7F8F9]">
        <Link
          href={`/products/${product.slug}`}
          className="flex-1 text-center py-3 text-[10px] font-display font-bold uppercase tracking-widest text-[#111318] hover:bg-[#111318] hover:text-white transition-colors duration-200"
        >
          View Product
        </Link>
        <div className="w-px bg-[#D9DDE1]" />
        <Link
          href="/contact"
          className="flex-1 text-center py-3 text-[10px] font-display font-bold uppercase tracking-widest text-[#E8612C] hover:bg-[#E8612C] hover:text-white transition-colors duration-200"
        >
          Contact Us
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Category Filter ──────────────────────────────────────────────────────────

function CategoryFilter({
  categories,
  activeSlug,
  onChange,
}: {
  categories: ProductCategory[];
  activeSlug: string;
  onChange: (slug: string) => void;
}) {
  return (
    <>
      {/* Desktop: horizontal pill filters */}
      <div className="hidden md:flex items-center gap-2 flex-wrap">
        <button
          onClick={() => onChange('all')}
          className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all duration-200 ${
            activeSlug === 'all'
              ? 'bg-[#111318] text-white border-[#111318]'
              : 'bg-white text-[#6B7280] border-[#D9DDE1] hover:border-[#111318] hover:text-[#111318]'
          }`}
        >
          All Systems
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onChange(cat.slug)}
            className={`px-4 py-2 text-[10px] font-mono font-bold uppercase tracking-widest border transition-all duration-200 ${
              activeSlug === cat.slug
                ? 'bg-[#E8612C] text-white border-[#E8612C]'
                : 'bg-white text-[#6B7280] border-[#D9DDE1] hover:border-[#E8612C] hover:text-[#E8612C]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Mobile: styled dropdown */}
      <div className="md:hidden relative">
        <select
          value={activeSlug}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-[#D9DDE1] px-4 py-3 pr-10 text-[11px] font-mono font-bold uppercase tracking-widest text-[#111318] focus:outline-none focus:border-[#E8612C]"
        >
          <option value="all">All Systems</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
      </div>
    </>
  );
}

// ─── Main Client Component ────────────────────────────────────────────────────

export default function ProductsClient({ initialProducts, categories }: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      router.push('/products');
    } else {
      router.push(`/products?category=${slug}`);
    }
  };

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return initialProducts;
    return initialProducts.filter((p) => p.category_slug === activeCategory);
  }, [initialProducts, activeCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <section className="pt-28 pb-16 border-b border-[#D9DDE1] relative overflow-hidden">
        {/* Subtle dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(#111318 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <span className="text-[10px] font-mono font-bold text-[#E8612C] tracking-[0.3em] uppercase block mb-4">
              Product Catalog // Saudi / GCC
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#111318] uppercase leading-tight tracking-tight max-w-3xl mb-5">
              Engineered Systems for Every Application.
            </h1>
            <p className="text-sm text-[#6B7280] max-w-2xl leading-relaxed">
              Arabian Gratings supplies a comprehensive range of industrial grating systems — steel, FRP/GRP, aluminium, stainless steel, stair treads, and access covers — engineered to international standards and deployed across Saudi and GCC oil & gas, infrastructure, marine and industrial projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Filter + Grid ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter bar */}
        {categories.length > 0 && (
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <CategoryFilter
              categories={categories}
              activeSlug={activeCategory}
              onChange={handleCategoryChange}
            />
          </motion.div>
        )}

        {/* Product count */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-[10px] font-mono text-[#9CA3AF] mb-6 tracking-widest uppercase"
          >
            {filtered.length} {filtered.length === 1 ? 'System' : 'Systems'} Found
          </motion.p>
        </AnimatePresence>

        {/* Grid */}
        {filtered.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          /* Empty state */
          <div className="border border-dashed border-[#D9DDE1] py-20 text-center">
            <span className="text-[9px] font-mono text-[#9CA3AF] tracking-widest uppercase block mb-3">
              Catalog Status // No Match
            </span>
            <h3 className="text-lg font-display font-black text-[#111318] uppercase mb-2">
              No Products in this Category
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto mb-6 leading-relaxed">
              This category is currently being catalogued. Contact our sales desk for immediate product information.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E8612C] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#D4521F] transition-colors"
            >
              Contact Sales <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section className="bg-[#111318] py-20 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-[9px] font-mono text-[#E8612C] tracking-[0.3em] uppercase block mb-4">
            Engineering Support
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white uppercase leading-tight mb-4">
            Can&apos;t Find What You Need?
          </h2>
          <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto leading-relaxed mb-8">
            Our engineering team can recommend the right grating system for your specific load class, environment and project requirements.
          </p>
          <div className="flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#E8612C] text-white text-[10px] font-display font-bold uppercase tracking-widest hover:bg-[#D4521F] transition-colors"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
