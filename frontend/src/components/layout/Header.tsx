'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Menu, X, Factory } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const noMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
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

  const menuItems = [
    { name: 'Home', href: '/' },
    {
      name: 'Products',
      href: '/products',
      dropdown: [
        { name: 'FRP/GRP Products', href: '/products/category/frp-grp-products' },
        { name: 'Steel Gratings', href: '/products/category/steel-gratings' },
        { name: 'Stainless Steel Products', href: '/products/category/stainless-steel-products' },
        { name: 'Aluminium', href: '/products/category/aluminium' },
        { name: 'Manhole', href: '/products/category/manhole' },
        { name: 'SS/GI Grating Clamps', href: '/products/category/ss-gi-grating-clamps' },
        { name: 'Step Iron', href: '/products/category/step-iron' },
        { name: 'Stud Products', href: '/products/category/stud-products' },
      ],
    },
    {
      name: 'Services',
      href: '/services',
      dropdown: [
        { name: 'Custom Fabrication', href: '/services/custom-fabrication' },
        { name: 'Technical Consultation', href: '/services/technical-consultation' },
        { name: 'Site Survey & Installation', href: '/services/site-survey-installation' },
      ],
    },
    { name: 'Industries', href: '/industries' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-[#D9DDE1] ${
        scrolled ? 'py-2.5 shadow-sm' : 'py-3'
      }`}
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s ease, padding 0.3s ease, background-color 0.3s ease, border-color 0.3s ease',
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 flex items-center justify-between gap-6">
        {/* LOGO */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/img/logo.png"
              alt="Arabian Gratings Logo"
              width={160}
              height={38}
              className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-102"
              priority
            />
          </Link>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <div className="flex items-center space-x-4 xl:space-x-5">
            {menuItems.map((item) => {
              const isPageActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <div key={item.name} className="relative group py-2">
                  <Link
                    href={item.href}
                    className={`relative font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors block ${
                      isPageActive ? 'text-[#E8612C]' : 'text-[#111318] hover:text-[#E8612C]'
                    }`}
                  >
                    {item.name}
                    <span
                      className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E8612C] transition-all duration-300 group-hover:w-full"
                      style={isPageActive ? { width: '100%' } : {}}
                    />
                  </Link>
                  {item.dropdown && (
                    <div className="absolute top-full left-0 pt-2 opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible transition-all duration-300 z-50">
                      <div className="bg-white border border-[#D9DDE1] py-3 w-64 shadow-md rounded-sm">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.name}
                            href={sub.href}
                            className="block px-5 py-2.5 text-[10px] font-sans font-bold uppercase tracking-widest text-[#111318] hover:text-[#E8612C] hover:bg-slate-50 transition-colors"
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT CTA */}
        <div className="hidden lg:block shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-4 py-2 bg-[#E8612C] hover:bg-[#D4521F] text-white font-sans text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:translate-y-[-1px] shadow-sm"
          >
            <span>Contact Us &rarr;</span>
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-[#111318] hover:text-[#E8612C] focus:outline-none transition-colors"
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
            className="lg:hidden fixed inset-0 z-40 bg-white flex flex-col p-6 overflow-y-auto border-t border-[#D9DDE1]"
            style={{ top: '60px', height: 'calc(100vh - 60px)' }}
            initial={noMotion ? {} : { opacity: 0, y: 15 }}
            animate={noMotion ? {} : { opacity: 1, y: 0 }}
            exit={noMotion ? {} : { opacity: 0, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="flex flex-col space-y-6 pt-4">
              {menuItems.map((item, idx) => (
                <div key={item.name} className="border-b border-[#D9DDE1] pb-4">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 font-sans text-base font-black uppercase tracking-wider text-[#111318] hover:text-[#E8612C] transition-colors"
                  >
                    <span className="font-mono text-xs text-[#E8612C]">0{idx + 1}</span>
                    <span>{item.name}</span>
                  </Link>
                  {item.dropdown && (
                    <div className="pl-8 mt-3 space-y-2.5 flex flex-col">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-xs font-bold font-sans uppercase tracking-wider text-[#59616B] hover:text-[#E8612C] transition-colors py-1"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-6">
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-4 py-4 font-sans text-xs font-bold uppercase tracking-widest text-white bg-[#E8612C] hover:bg-[#D4521F] transition-colors rounded-[2px]"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
