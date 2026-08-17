import { Metadata } from 'next';
import Link from 'next/link';
import { defaultMetadata } from '@/lib/seo/config';
import ContactForm from '@/components/enquiries/ContactForm';
import Reveal from '@/components/animations/Reveal';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';

export const metadata: Metadata = {
  ...defaultMetadata,
  title: 'Contact Us | Arabian Gratings UAE',
  description: 'Get in touch with Arabian Gratings UAE. Contact our engineering office in the UAE for sales enquiries, product layout specifications, and support.',
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Hero */}
        <Reveal direction="up" delay={0.1}>
          <div className="max-w-3xl mb-12">
            <span className="text-accent font-mono font-bold tracking-widest text-[10px] uppercase block mb-3">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-display font-black text-foreground uppercase mb-4 leading-tight">
              Contact Sales & Engineering
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed font-sans">
              Have technical questions about load spans, custom configurations, or project rates? Reach out to our UAE team using the form below or our direct contact channels.
            </p>
          </div>
        </Reveal>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 bg-white border border-border-color p-8 rounded-sm shadow-sm">
            <Reveal direction="up" delay={0.15}>
              <h2 className="text-lg font-display font-bold text-foreground uppercase tracking-wider mb-6">
                Send an Enquiry
              </h2>
              <ContactForm />
            </Reveal>
          </div>

          {/* Right Column: Office Details */}
          <aside className="lg:col-span-5 space-y-6">
            <Reveal direction="right" delay={0.2}>
              <div className="bg-charcoal text-white p-8 rounded-sm border border-slate-800 space-y-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 tech-grid-overlay-dark" />
                <h2 className="text-sm font-display font-bold uppercase tracking-widest border-b border-slate-800 pb-3 text-slate-350 relative z-10">
                  UAE Engineering Office
                </h2>

                <div className="flex items-start gap-4 relative z-10">
                  <MapPin className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Office Location</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Arabian Gratings Sales & Engineering Division<br />
                      United Arab Emirates
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <Phone className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Direct Call</h3>
                    <p className="text-xs text-slate-400">
                      Contact desk via central request form
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <Mail className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Email Correspondence</h3>
                    <p className="text-xs text-slate-400">
                      Submit project tenders directly via RFQ portal
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 relative z-10">
                  <Clock className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-display font-bold text-white uppercase tracking-wider mb-1">Operational Hours</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-mono">
                      Monday – Friday: 8:00 AM – 5:30 PM<br />
                      Saturday – Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.3}>
              <div className="border border-border-color p-8 rounded-sm bg-slate-50 text-center">
                <h3 className="font-display font-bold text-foreground text-sm uppercase tracking-wider mb-2">
                  Need a Comprehensive Quote?
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
                  If you have structural drawings, dimension tables, or detailed load criteria, use our dedicated Request for Quotation system.
                </p>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent font-display text-xs font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover transition-colors w-full rounded-sm"
                >
                  Request a Quote (RFQ)
                </Link>
              </div>
            </Reveal>
          </aside>

        </div>

      </div>
    </div>
  );
}
