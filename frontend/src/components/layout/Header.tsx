'use strict';
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, ChevronDown, Factory } from 'lucide-react';

const navigation = [
  { name: 'Products', href: '/products' },
  { name: 'Industries', href: '/industries' },
  { name: 'Solutions', href: '/solutions' },
  { name: 'Services', href: '/services' },
  { name: 'Projects', href: '/projects' },
  {
    name: 'About',
    href: '/about/company',
    children: [
      { name: 'Company Profile', href: '/about/company' },
      { name: 'Manufacturing', href: '/about/manufacturing' },
      { name: 'Quality Policy', href: '/about/quality' },
      { name: 'Certifications', href: '/about/certifications' },
    ],
  },
  { name: 'Knowledge Hub', href: '/blog' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const noMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#0f1115] border-b border-white/5 py-4 shadow-lg' 
          : 'bg-transparent border-b border-transparent py-5'
      } text-white`}
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s ease, py 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Subtle top dark overlay gradient to ensure readability on hero images */}
      {!scrolled && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0f1115]/80 to-transparent pointer-events-none" />
      )}

      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <Factory className="w-6 h-6 text-[#d97706] transition-transform duration-300 group-hover:scale-105" />
            <span className="font-display font-black text-sm tracking-[0.18em] uppercase">
              Arabian Gratings
            </span>
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navigation.map((item) => {
            const isPageActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      className="flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-slate-200 hover:text-[#d97706] transition-colors py-2"
                      aria-expanded={openDropdown === item.name}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-3 h-3 opacity-60 group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    <div 
                      className="absolute left-0 mt-1 w-48 rounded-sm bg-[#0f1115] text-white shadow-2xl border border-white/5 py-2 transition-all duration-200 origin-top-left opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className="block px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-slate-400 hover:bg-white/5 hover:text-[#d97706] transition-all"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`relative font-sans text-xs font-semibold uppercase tracking-wider transition-colors py-2 block ${
                      isPageActive ? 'text-[#d97706]' : 'text-slate-200 hover:text-[#d97706]'
                    }`}
                  >
                    {item.name}
                    <span 
                      className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#d97706] transition-all duration-300 group-hover:w-full"
                      style={isPageActive ? { width: '100%' } : {}}
                    />
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT CTA */}
        <div className="hidden lg:block">
          <Link
            href="/quote"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-[#d97706] hover:bg-[#b45309] text-white font-sans text-xs font-bold uppercase tracking-widest rounded-[2px] transition-all duration-300 hover:translate-y-[-1px] shadow-sm"
          >
            <span>Request a Quote &rarr;</span>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-slate-200 hover:text-[#d97706] focus:outline-none transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="lg:hidden fixed inset-0 z-40 bg-[#0f1115] flex flex-col p-6 overflow-y-auto border-t border-white/5" 
            style={{ top: '72px', height: 'calc(100vh - 72px)' }}
            initial={noMotion ? {} : { opacity: 0, y: 15 }}
            animate={noMotion ? {} : { opacity: 1, y: 0 }}
            exit={noMotion ? {} : { opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex flex-col space-y-6 pt-4 text-white">
              {navigation.map((item, idx) => (
                <div key={item.name} className="border-b border-white/5 pb-4">
                  {item.children ? (
                    <div className="flex flex-col space-y-3">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                        0{idx + 1} {"//"} {item.name}
                      </span>
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="pl-4 py-1 font-sans text-sm font-bold uppercase tracking-wider text-slate-200 hover:text-[#d97706] transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 font-sans text-base font-black uppercase tracking-wider text-slate-100 hover:text-[#d97706] transition-colors"
                    >
                      <span className="font-mono text-xs text-[#d97706]">0{idx + 1}</span>
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-6">
                <Link
                  href="/quote"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-4 font-sans text-xs font-bold uppercase tracking-widest text-white bg-[#d97706] hover:bg-[#b45309] transition-colors rounded-[2px]"
                >
                  Request a Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
