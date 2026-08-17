import { getProduct, getBlogPosts } from '@/lib/api/client';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import BlogCard from '@/components/blog/BlogCard';
import { generatePageMetadata } from '@/lib/seo/config';
import { stripHtml } from '@/lib/seo/stripHtml';
import { Metadata } from 'next';
import { FileText, Download, ChevronRight, ArrowLeft } from 'lucide-react';
import { Product, Document, BlogPost } from '@/types';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const product = await getProduct(resolvedParams.slug);
    return generatePageMetadata(product, {
      title: `${product.name} | Arabian Gratings UAE`,
      description: stripHtml(product.short_description),
      path: `/products/${product.slug}`,
      ogImageFallback: product.product_images?.[0]?.media?.file || undefined
    });
  } catch {
    return {
      title: 'Product Details | Arabian Gratings UAE'
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = await params;
  let product: Product | null = null;

  try {
    product = await getProduct(resolvedParams.slug);
  } catch {
    notFound();
  }

  if (!product || !product.is_active) {
    notFound();
  }

  let relatedArticles: BlogPost[] = [];
  try {
    const articlesRes = await getBlogPosts({ product: product.slug, page_size: 3 });
    relatedArticles = articlesRes.results || [];
  } catch (error) {
    console.warn('Failed to fetch related blog posts for product detail.', error);
  }

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'description': product.short_description,
    'image': product.product_images?.[0]?.media?.file ? `${SITE_URL}${product.product_images[0].media.file}` : undefined,
    'offers': {
      '@type': 'AggregateOffer',
      'priceCurrency': 'AED',
      'price': 'Contact for pricing'
    }
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': `${SITE_URL}` },
      { '@type': 'ListItem', 'position': 2, 'name': 'Products', 'item': `${SITE_URL}/products` },
      { '@type': 'ListItem', 'position': 3, 'name': product.category?.name || 'Category', 'item': `${SITE_URL}/products?category=${product.category?.slug || ''}` },
      { '@type': 'ListItem', 'position': 4, 'name': product.name, 'item': `${SITE_URL}/products/${product.slug}` }
    ]
  };

  const specs = Object.entries(product.specifications || {});

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Back Link & Breadcrumbs */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-grey">
          <Link href="/products" className="inline-flex items-center hover:text-accent transition-colors font-display uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Catalog
          </Link>
          <nav className="flex items-center space-x-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <Link href={`/products?category=${product.category?.slug}`} className="hover:text-accent transition-colors">
              {product.category?.name}
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-350" />
            <span className="text-foreground font-semibold">{product.name}</span>
          </nav>
        </div>

        {/* Product Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left: Product title & description */}
          <div className="lg:col-span-7">
            <Reveal direction="left" delay={0.1}>
              <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest block mb-2">
                {product.category?.name}
              </span>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-foreground uppercase mb-6 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-slate-500 leading-relaxed mb-8">
                {product.short_description}
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm shadow-sm"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border-color font-display text-xs font-bold uppercase tracking-widest text-foreground bg-white hover:bg-slate-50 transition-colors rounded-sm"
                >
                  Contact Sales Desk
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Right: Technical specifications table */}
          <div className="lg:col-span-5 bg-white border border-border-color p-6 rounded-sm shadow-sm">
            <Reveal direction="right" delay={0.2}>
              <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-4 border-b border-border-color pb-2">
                Technical Data Sheet
              </h3>
              {specs.length > 0 ? (
                <div className="divide-y divide-border-color font-mono text-xs">
                  {specs.map(([key, val]) => (
                    <div key={key} className="py-2.5 flex justify-between gap-4">
                      <span className="font-bold text-slate-grey capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="text-foreground font-semibold text-right">{String(val)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 py-4 font-sans leading-relaxed">
                  No technical specifications are currently cataloged for this product range. Contact our team to confirm dimensional configurations.
                </div>
              )}
            </Reveal>
          </div>

        </div>

        {/* Detailed Description */}
        <section className="mb-16 border-t border-border-color pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8">
              <Reveal direction="up" delay={0.1}>
                <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-4">
                  Overview & Applications
                </h2>
                <div className="text-sm text-slate-500 space-y-4 leading-relaxed font-sans">
                  <p>{product.description}</p>
                  {product.applications && (
                    <div className="mt-6 border-t border-border-color pt-6">
                      <h4 className="font-display font-bold text-foreground mb-2 text-xs uppercase tracking-wider">Suggested Applications</h4>
                      <p>{product.applications}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Right: Technical Catalogs downloads list */}
            <div className="lg:col-span-4 bg-slate-50 border border-border-color p-6 rounded-sm">
              <Reveal direction="up" delay={0.2}>
                <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-4 flex items-center">
                  <FileText className="w-4 h-4 mr-1.5 text-accent" />
                  Drawing Downloads
                </h3>
                {product.documents && product.documents.length > 0 ? (
                  <div className="space-y-3">
                    {product.documents.map((doc: Document) => (
                      <a
                        key={doc.id}
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-white border border-border-color rounded-sm text-xs hover:border-accent transition-colors group"
                      >
                        <span className="font-semibold text-slate-grey truncate group-hover:text-accent">{doc.title}</span>
                        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-accent shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    No catalogs or technical datasheets are currently cataloged for this product range.
                  </p>
                )}
              </Reveal>
            </div>

          </div>
        </section>

        {/* View Projects link */}
        <Reveal direction="none" delay={0.15}>
          <div className="mb-8 border border-border-color rounded-sm p-4 bg-slate-50 inline-flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-slate-grey">View project installations utilizing this product range</span>
            <Link
              href={`/projects?product=${product.slug}`}
              className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors"
            >
              View Projects <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </Reveal>

        {/* Related Blog Articles */}
        {relatedArticles.length > 0 && (
          <section className="mb-16 border-t border-border-color pt-12">
            <Reveal direction="up" delay={0.1}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Technical Insights & Engineering Guides
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((post, idx) => (
                <BlogCard key={post.id} post={post} index={idx} headingLevel="h3" />
              ))}
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <Reveal direction="none" delay={0.3}>
          <div className="premium-card-dark p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-display font-black uppercase tracking-wide">Need Custom Deflection Calculation?</h3>
              <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed">
                Our sales desk reviews grating layouts, mesh spans, and coating standards to provide compliance validation reports.
              </p>
              <div className="flex justify-center">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors rounded-sm"
                >
                  Submit RFQ Details
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
}
