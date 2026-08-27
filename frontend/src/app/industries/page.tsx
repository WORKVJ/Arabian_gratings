import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import { getIndustries } from '@/lib/api/client';
import { Industry, PaginatedResponse } from '@/types';
import { ChevronRight } from 'lucide-react';
import { defaultMetadata } from '@/lib/seo/config';
import { Metadata } from 'next';

export const revalidate = 86400;

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Industries Served | Arabian Gratings Saudi Arabia',
  description: 'Arabian Gratings supplies industrial grating solutions across Oil & Gas, Water Treatment, Power, Infrastructure, and other demanding sectors across Saudi Arabia and GCC.'
};

export default async function IndustriesPage() {
  let industriesRes: PaginatedResponse<Industry> = { count: 0, next: null, previous: null, results: [] };

  try {
    industriesRes = await getIndustries();
  } catch {
    console.warn('Industries not available from backend. Using empty state.');
  }

  const industries = industriesRes.results;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-16">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">Sectors Served</span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Industries Served
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed">
              Arabian Gratings provides access flooring, walkway, and structural grating systems for a range of demanding industrial environments. Each application calls for specific material selections, load ratings, and surface characteristics.
            </p>
          </div>
        </Reveal>

        {/* Industries Grid */}
        {industries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry: Industry, idx: number) => (
              <Reveal key={industry.id} direction="up" delay={idx * 0.05}>
                <div className="premium-card-light p-6 h-full flex flex-col justify-between bg-white border border-border-color rounded-sm hover:border-accent transition-colors">
                  <div>
                    <h2 className="text-lg font-bold text-foreground mb-3 font-display uppercase tracking-wide">{industry.name}</h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-4 mb-6">
                      {industry.short_description}
                    </p>
                  </div>
                  <Link
                    href={`/industries/${industry.slug}`}
                    className="text-xs font-bold text-accent hover:text-accent-hover inline-flex items-center uppercase tracking-wider font-display transition-colors focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    Explore Sector Applications <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border-color rounded-sm p-16 text-center bg-slate-50 text-slate-500">
            <span className="text-[10px] block mb-2 font-mono text-slate-400">Database Status: Synced</span>
            <h3 className="text-lg font-bold text-foreground mb-2 font-display uppercase">No Industries Registered</h3>
            <p className="text-xs text-slate-550 max-w-md mx-auto">
              No active industry sectors are currently published. Sectors will appear dynamically once added via the content management system.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
