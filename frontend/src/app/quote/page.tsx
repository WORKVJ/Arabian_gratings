import { Metadata } from 'next';
import { defaultMetadata } from '@/lib/seo/config';
import QuoteForm from '@/components/enquiries/QuoteForm';
import Reveal from '@/components/animations/Reveal';
import { FileText, ShieldAlert, BadgeInfo } from 'lucide-react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Request a Quote (RFQ) | Arabian Gratings UAE',
  description: 'Submit an RFQ for industrial gratings, GRP/FRP walkway layouts, or custom access flooring. Attach drawings and layout specifications.',
};

export default function QuotePage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Request for Quotation
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Request a Custom Quote (RFQ)
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Submit your grating layouts, dimensions, load spans, and raw material specifications. Attach project layout drawing documents for direct review by our engineering desk.
            </p>
          </div>
        </Reveal>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-8 bg-white border border-border-color p-8 rounded-sm shadow-sm">
            <Reveal direction="up" delay={0.15}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Technical Specifications Form
              </h2>
              <QuoteForm />
            </Reveal>
          </div>

          {/* Right Column: Upload requirements sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <Reveal direction="right" delay={0.2}>
              <div className="border border-border-color p-6 rounded-sm bg-slate-50 space-y-4">
                <h3 className="font-display font-bold text-foreground text-xs uppercase tracking-widest mb-2 flex items-center gap-1.5 border-b border-border-color pb-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Drawing Upload Rules
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                  To calculate proper load parameters and quantity spans, please attach site layouts.
                </p>

                <div className="border-t border-border-color pt-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-accent uppercase block mb-1">
                      Max File Size
                    </span>
                    <span className="text-xs font-mono font-semibold text-foreground">
                      10 Megabytes (10MB) per file
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono font-bold text-accent uppercase block mb-1">
                      Allowed Formats
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png', '.doc', '.docx'].map((ext) => (
                        <span key={ext} className="text-[9px] font-mono font-bold bg-white border border-border-color px-1.5 py-0.5 rounded-sm">
                          {ext}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 p-3 bg-accent/5 rounded-sm border border-accent/10 text-xs text-slate-600 leading-relaxed font-sans">
                  <BadgeInfo className="w-4 h-4 shrink-0 text-accent" />
                  <span>
                    Additional drawings can be attached to the secondary upload area on the form.
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.3}>
              <div className="border border-border-color p-6 rounded-sm bg-charcoal text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
                <div className="relative z-10 space-y-2">
                  <ShieldAlert className="w-6 h-6 text-accent mx-auto" />
                  <h3 className="font-display font-bold text-xs uppercase tracking-widest text-slate-350">
                    Secure Data Policy
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                    All submitted drawings and engineering tenders are stored securely and treated confidentially.
                  </p>
                </div>
              </div>
            </Reveal>
          </aside>

        </div>

      </div>
    </div>
  );
}
