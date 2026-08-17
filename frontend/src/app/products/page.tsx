import { Suspense } from 'react';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import FilterPanel from '@/components/products/FilterPanel';
import { getProducts, getProductCategories } from '@/lib/api/client';
import { ChevronRight } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';
import { Product, ProductCategory, PaginatedResponse } from '@/types';

export const revalidate = 86400; // 24 hours caching

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>;
}

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Industrial Grating Solutions | Arabian Gratings UAE',
  description: 'Explore our catalog of premium industrial gratings, GRP/FRP composite platforms, galvanized steel walkway panels, stair treads, and step irons.'
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  
  let productsRes: PaginatedResponse<Product> = { count: 0, next: null, previous: null, results: [] };
  let categoriesRes: PaginatedResponse<ProductCategory> = { count: 0, next: null, previous: null, results: [] };

  try {
    categoriesRes = await getProductCategories();
  } catch {
    console.warn("Product categories not available from backend. Using placeholders.");
  }

  try {
    productsRes = await getProducts({
      category: params.category,
      search: params.search
    });
  } catch {
    console.warn("Products list not available from backend. Using empty state.");
  }

  const activeCategories = categoriesRes.results || [];
  const products = productsRes.results || [];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">Product Catalog</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Industrial Grating Solutions
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Discover our comprehensive range of high-performance access flooring frameworks, FRP structural sections, steel panel grating structures, and safety walkway elements.
            </p>
          </div>
        </Reveal>

        {/* Filter controls */}
        <Reveal direction="none" delay={0.2}>
          <div className="mb-10 bg-white border border-border-color p-6 rounded-sm shadow-sm">
            <Suspense fallback={<div className="text-xs text-slate-500 font-mono">Loading filters...</div>}>
              <FilterPanel categories={activeCategories} />
            </Suspense>
          </div>
        </Reveal>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((prod: Product, idx: number) => (
              <Reveal key={prod.id} direction="up" delay={idx * 0.05}>
                <div className="premium-card-light p-6 h-full flex flex-col justify-between bg-white border border-border-color rounded-sm hover:border-accent transition-colors">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider block mb-2">
                      {prod.category?.name}
                    </span>
                    <h3 className="text-lg font-bold text-foreground mb-3 font-display uppercase tracking-wide">{prod.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 mb-6 leading-relaxed">{prod.short_description}</p>
                  </div>
                  <Link
                    href={`/products/${prod.slug}`}
                    className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    View Specifications <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          // Editorial Empty State
          <div className="border border-dashed border-border-color rounded-sm p-16 text-center text-slate-500 bg-slate-50">
            <span className="text-[10px] block mb-1 font-mono text-slate-400">Database Status: Synced</span>
            <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Products Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
              There are currently no items matching the selected category criteria in our catalog. Contact our sales desk directly for custom requests.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/quote" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs font-bold uppercase tracking-wider text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm">
                Request custom quote
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
