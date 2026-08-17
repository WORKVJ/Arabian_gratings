'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { ProductCategory, Industry, Project, BlogPost } from '@/types';

interface HomeClientProps {
  categories: ProductCategory[];
  industries: Industry[];
  projects: Project[];
  posts: BlogPost[];
}

const defaultCategories: ProductCategory[] = [
  { id: 1, name: 'Steel Grating Systems', slug: 'steel-gratings', description: 'Industrial heavy-duty metal floors galvanized to ISO 1461. Fabricated using high-strength structural grade steels.', image: null, is_active: true, no_index: false },
  { id: 2, name: 'FRP / GRP Grating', slug: 'frp-gratings', description: 'Corrosion-proof fiberglass reinforced plastic grates built with isophthalic polyester or vinyl ester resins.', image: null, is_active: true, no_index: false },
  { id: 3, name: 'Industrial Stair Treads', slug: 'stair-treads', description: 'Grating steps with anti-slip nosing plates and standard welded end-plates for immediate field installation.', image: null, is_active: true, no_index: false },
  { id: 4, name: 'Custom Fabricated Grates', slug: 'custom-fabrications', description: 'Bespoke grating panels with circular penetrations, notches, complex shapes and edge bandings to match site drawings.', image: null, is_active: true, no_index: false },
];

const defaultIndustries: Industry[] = [
  { id: 1, name: 'Oil & Gas', slug: 'oil-and-gas', short_description: 'High-load gratings and platforms engineered for extreme thermal fluctuations and coastal environments.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
  { id: 2, name: 'Marine & Offshore', slug: 'marine-offshore', short_description: 'Corrosion-resistant GRP grids built to withstand seawater spray and wave impact loads.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
  { id: 3, name: 'Desalination Plants', slug: 'water-treatment', short_description: 'Chemical-safe GRP grids and stainless floor plates for humid, chlorine-heavy utility yards.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
  { id: 4, name: 'Infrastructure', slug: 'infrastructure-logistics', short_description: 'Heavy duty wheel-load rated trench covers and drainage grates for warehouse docks and road channels.', description: '', description_blocks: [], image: null, applications: '', related_products: [], is_active: true, no_index: false },
];

const defaultProjects: Project[] = [
  { id: 1, title: 'Mussafah Cargo Platform Layout', slug: 'mussafah-cargo-platform', location: 'Mussafah Industrial Port, Abu Dhabi', associated_industries: [defaultIndustries[1]], description: 'Hot-dip galvanized steel grids fabricated and tested for massive wheel load deflection standards across the cargo platform.', description_blocks: [], featured_image: null, project_images: [], products_used: [], project_date: '2025-06', is_featured: true, is_active: true, no_index: false, created_at: '', updated_at: '' },
  { id: 2, title: 'Ruwais Sulphur Trench Grates', slug: 'ruwais-sulphur-trench', location: 'Ruwais Refinery Complex, Abu Dhabi', associated_industries: [defaultIndustries[0]], description: 'Molded GRP fiberglass composite floor walkways with high chemical safety ratios designed for sulphur exposure.', description_blocks: [], featured_image: null, project_images: [], products_used: [], project_date: '2025-09', is_featured: true, is_active: true, no_index: false, created_at: '', updated_at: '' },
];

const defaultPosts: BlogPost[] = [
  { id: 1, title: 'Hot-Dip Galvanizing Deflection Standards in Coastal UAE Docks', slug: 'hot-dip-galvanizing-deflection-standards', excerpt: 'Detailed analysis of corrosion fatigue on marine steel platforms and yield stress parameters in coastal environments.', content: '', content_blocks: [], featured_image: null, category: { id: 1, name: 'Technical Standards', slug: 'technical-standards', description: '', is_active: true }, author: { id: 1, name: 'Lead Structural Engineer' }, status: 'PUBLISHED', is_featured: true, published_at: '2025-05-12', created_at: '', updated_at: '', related_products: [], related_industries: [], related_posts: [], no_index: false },
  { id: 2, title: 'GRP/FRP Matrix Selection Guide for Sulphur Environments', slug: 'grp-frp-matrix-selection-guide', excerpt: 'A review of isophthalic polyester versus vinyl ester resin resistance profiles in local refineries and desalination plants.', content: '', content_blocks: [], featured_image: null, category: { id: 2, name: 'Material Engineering', slug: 'material-engineering', description: '', is_active: true }, author: { id: 1, name: 'Chemical Specialist' }, status: 'PUBLISHED', is_featured: false, published_at: '2025-08-22', created_at: '', updated_at: '', related_products: [], related_industries: [], related_posts: [], no_index: false },
];

const productImages = ['/product-steel-grating.jpg', '/product-frp-grating.jpg', '/product-steel-grating.jpg', '/product-frp-grating.jpg'];
const productSpecs: Record<number, { label: string; value: string }[]> = {
  0: [{ label: 'MATERIAL', value: 'ASTM A36 CARBON STEEL' }, { label: 'DEFLECTION', value: 'BS EN 14122 RATIO' }, { label: 'FINISH', value: 'ISO 1461 HOT-DIP GALVANIZED' }],
  1: [{ label: 'MATRIX', value: 'GRP / FIBERGLASS' }, { label: 'CORROSION', value: 'ISOPHTHALIC ACID IMMUNITY' }, { label: 'SAFETY', value: 'SLIP-RESISTANT GRIT SURFACE' }],
  2: [{ label: 'INSTALLATION', value: 'BOLTED END PLATES' }, { label: 'NOSING', value: 'SERRATED VISIBILITY PLATES' }, { label: 'LOAD RATING', value: '150KG CONCENTRATED' }],
  3: [{ label: 'CAD COMPILING', value: 'CNC AUTOCAD SHAPING' }, { label: 'PENETRATIONS', value: 'CIRCULAR & COLLAR BANDING' }, { label: 'CERTIFICATE', value: 'ISO 9001 QUALIFIED TEST' }],
};
const industryImages = ['/industry-oilgas.jpg', '/project-marine.jpg', '/project-marine.jpg', '/project-refinery.jpg'];
const projectImages = ['/project-marine.jpg', '/project-refinery.jpg'];
const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1];
const springCfg = { stiffness: 70, damping: 20, mass: 0.9 };

const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } } };
const staggerItem = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } } };

// Reusable ImageReveal component with clip-path, scale and parallax support
function ImageReveal({ src, alt, className = '', parallaxSpeed = 0.05, aspectClass = 'aspect-[4/3]' }: { src: string; alt: string; className?: string; parallaxSpeed?: number; aspectClass?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  
  const rawY = useTransform(scrollYProgress, [0, 1], [`${parallaxSpeed * -100}px`, `${parallaxSpeed * 100}px`]);
  const y = useSpring(rawY, springCfg);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.08, 1.04, 1]);
  const clipPercent = useTransform(scrollYProgress, [0, 0.45], [10, 0]);

  const smoothScale = useSpring(scale, springCfg);
  const smoothClip = useSpring(clipPercent, springCfg);
  
  // Custom spring rendering callback to avoid manual interpolation crashes
  const [clipVal, setClipVal] = useState(10);
  useEffect(() => {
    if (noMotion) return;
    return smoothClip.on('change', (latest) => {
      setClipVal(latest);
    });
  }, [smoothClip, noMotion]);

  const clipPathStyle = noMotion ? {} : { clipPath: `inset(0% ${clipVal}% 0% ${clipVal}%)` };

  return (
    <div ref={ref} className={`relative overflow-hidden bg-slate-900 ${aspectClass} ${className}`}>
      <motion.div 
        className="w-full h-full relative"
        style={noMotion ? {} : { y, scale: smoothScale, ...clipPathStyle }}
      >
        <Image 
          src={src} 
          alt={alt} 
          fill 
          sizes="(max-width: 768px) 100vw, 60vw" 
          className="object-cover transition-transform duration-700 hover:scale-[1.04]" 
        />
      </motion.div>
    </div>
  );
}

function ParallaxImage({ src, alt, className = '', speed = 0.08 }: { src: string; alt: string; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const noMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rawY = useTransform(scrollYProgress, [0, 1], [`${speed * -100}%`, `${speed * 100}%`]);
  const y = useSpring(rawY, springCfg);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div className="w-full h-full scale-[1.15]" style={noMotion ? {} : { y }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
      </motion.div>
    </div>
  );
}

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const noMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={noMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ duration: 0.75, delay, ease: easeOut }}>
      {children}
    </motion.div>
  );
}

function MaskReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const noMotion = useReducedMotion();
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div initial={noMotion ? false : { y: '100%' }} whileInView={{ y: 0 }} viewport={{ once: true, margin: '-6%' }} transition={{ duration: 0.85, delay, ease: easeOut }}>
        {children}
      </motion.div>
    </div>
  );
}

function ClipReveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const noMotion = useReducedMotion();
  return (
    <motion.div className={className} initial={noMotion ? false : { clipPath: 'inset(0 6% 0 6%)' }} whileInView={{ clipPath: 'inset(0 0% 0 0)' }} viewport={{ once: true, margin: '-6%' }} transition={{ duration: 1.1, delay, ease: easeOut }}>
      {children}
    </motion.div>
  );
}
function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const noMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.0, 1.06]);
  const smoothScale = useSpring(scale, { stiffness: 55, damping: 18 });
  return (
    <section ref={ref} className="relative min-h-[75vh] flex items-center justify-center overflow-hidden bg-[#0f1115]" aria-label="Request a quote">
      <motion.div className="absolute inset-0 z-0" style={noMotion ? {} : { scale: smoothScale }}>
        <Image src="/cta-factory.jpg" alt="Arabian Gratings factory — submit RFQ" fill sizes="100vw" className="object-cover saturate-[0.8]" />
        <div className="absolute inset-0 bg-[#0f1115]/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/30 to-[#0f1115]/10" />
      </motion.div>
      <div className="absolute top-0 left-0 right-0 h-px bg-white/10 z-10" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 text-center space-y-8">
        <FadeUp delay={0.05}><span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block">08 // Get In Touch</span></FadeUp>
        <MaskReveal delay={0.12}>
          <h2 className="font-display font-black text-white text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-tighter uppercase">
            Let&apos;s Build<br />What The Industry<br />Requires.
          </h2>
        </MaskReveal>
        <FadeUp delay={0.3}><p className="font-sans text-slate-350 text-sm leading-relaxed max-w-lg mx-auto">Submit your grating dimensions, material configurations, and target spans. Our engineering desk verifies weight deflection limits and responds within 24 hours.</p></FadeUp>
        <FadeUp delay={0.42}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quote" className="group inline-flex items-center gap-3 bg-[#d97706] hover:bg-[#b45309] text-white font-display font-bold text-xs uppercase tracking-[0.15em] px-10 py-5 transition-colors duration-300 shadow-2xl">
              Submit RFQ Details
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="group inline-flex items-center gap-3 border border-white/20 hover:border-white/50 text-white/70 hover:text-white font-display font-bold text-xs uppercase tracking-[0.15em] px-10 py-5 transition-all duration-300">
              Request a Consultation
              <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:opacity-100" />
            </Link>
          </div>
        </FadeUp>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10 z-10" />
    </section>
  );
}

export default function HomeClient({ categories: rawCategories, industries: rawIndustries, projects: rawProjects, posts: rawPosts }: HomeClientProps) {
  const categories = rawCategories.length > 0 ? rawCategories : defaultCategories;
  const industries = rawIndustries.length > 0 ? rawIndustries : defaultIndustries;
  const projects = rawProjects.length > 0 ? rawProjects : defaultProjects;
  const posts = rawPosts.length > 0 ? rawPosts : defaultPosts;
  
  const heroRef = useRef<HTMLElement>(null);
  const introRef = useRef<HTMLElement>(null);
  const productsRef = useRef<HTMLElement>(null);
  const industriesRef = useRef<HTMLElement>(null);
  const capabilitiesRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const insightsRef = useRef<HTMLElement>(null);
  const noMotion = useReducedMotion();

  // Controlled active index state for stats loop
  const [activeStatIndex, setActiveStatIndex] = useState(0);
  const [isHoveredStat, setIsHoveredStat] = useState<number | null>(null);

  // Controlled active index state for material showcase loop
  const [activeMatIndex, setActiveMatIndex] = useState(0);
  const [isHoveredMat, setIsHoveredMat] = useState<number | null>(null);

  // Controlled active index state for product configurator showcase
  const [activeProdIndex, setActiveProdIndex] = useState(0);
  const [isHoveredProd, setIsHoveredProd] = useState<number | null>(null);

  // Controlled active index state for industries accordion loop
  const [activeIndIndex, setActiveIndIndex] = useState(0);
  const [isHoveredInd, setIsHoveredInd] = useState<number | null>(null);

  // Mouse coordinate values for desktop micro-parallax depth
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Cycle counter state for SVG visualization specs readout
  const [visSpecIndex, setVisSpecIndex] = useState(0);

  useEffect(() => {
    if (noMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 16; // -8px to 8px range limit
      const y = (clientY / window.innerHeight - 0.5) * 10; // -5px to 5px range limit
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredStat === null) {
        setActiveStatIndex((prev) => (prev + 1) % 4);
      }
    }, 2800);
    return () => clearInterval(interval);
  }, [isHoveredStat, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredMat === null) {
        setActiveMatIndex((prev) => (prev + 1) % 3);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHoveredMat, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredProd === null) {
        setActiveProdIndex((prev) => (prev + 1) % 4);
      }
    }, 3200);
    return () => clearInterval(interval);
  }, [isHoveredProd, noMotion]);

  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      if (isHoveredInd === null) {
        setActiveIndIndex((prev) => (prev + 1) % 4);
      }
    }, 3600);
    return () => clearInterval(interval);
  }, [isHoveredInd, noMotion]);

  // Rotate technical values in the SVG visualization readout
  useEffect(() => {
    if (noMotion) return;
    const interval = setInterval(() => {
      setVisSpecIndex((prev) => (prev + 1) % 4);
    }, 2200);
    return () => clearInterval(interval);
  }, [noMotion]);

  // Scroll animations for 100vh hero area
  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Layered speed variables matching premium specifications
  const heroScale = useTransform(heroScrollProgress, [0, 1], [1.04, 1.10]);
  const heroY = useTransform(heroScrollProgress, [0, 1], ['0%', '-5%']);
  const contentY = useTransform(heroScrollProgress, [0, 1], [0, -100]);
  const contentOpacity = useTransform(heroScrollProgress, [0, 0.8], [1, 0]);

  // Spring physics setup for smooth, non-aggressive motion profiles
  const springConfig = { stiffness: 70, damping: 24, mass: 1 };
  const smoothHeroScale = useSpring(heroScale, springConfig);
  const smoothHeroY = useSpring(heroY, springConfig);
  const smoothContentY = useSpring(contentY, springConfig);
  const smoothContentOpacity = useSpring(contentOpacity, springConfig);

  const visSpecsList = [
    { label: 'SPAN LOAD', val: '45.8 kN/m²' },
    { label: 'YIELD POINT', val: 'E235 GRADE' },
    { label: 'MESH SPAN', val: '30 x 100 MM' },
    { label: 'GALV ANNEAL', val: 'ISO 1461' }
  ];

  return (
    <div className="flex flex-col bg-[#0f1115] overflow-x-clip">

      {/* 01 — HERO */}
      <section ref={heroRef} className="relative h-screen w-full flex items-end overflow-hidden" aria-label="Arabian Gratings hero">
        <motion.div 
          className="absolute inset-0 z-0" 
          style={noMotion ? {} : { 
            scale: smoothHeroScale, 
            y: smoothHeroY,
            x: mousePos.x,
            translateY: mousePos.y
          }}
        >
          <Image 
            src="/hero-industrial.jpg" 
            alt="Arabian Gratings industrial manufacturing facility" 
            fill 
            sizes="100vw" 
            className="object-cover saturate-[0.8]" 
            priority 
          />
          {/* Subtle industrial lighting movement gradient: 12-16s infinite loop overlay */}
          <div 
            className="absolute inset-0 z-10 pointer-events-none opacity-40 mix-blend-color-dodge animate-pulse" 
            style={{
              background: 'linear-gradient(105deg, transparent 20%, rgba(217, 119, 6, 0.08) 50%, transparent 80%)',
              backgroundSize: '200% 100%',
              animationDuration: '14s'
            }}
          />
          
          {/* Global Darkening Overlay: 50% opacity mask */}
          <div className="absolute inset-0 bg-[#0f1115]/50 z-10" />

          {/* Left-heavy gradient overlay (65% on left behind text, fading to 45% on the right for SVG) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1115]/85 via-[#0f1115]/65 to-[#0f1115]/45 z-10" />
          
          {/* Bottom-up gradient for section boundary blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/50 to-transparent z-10" />

          {/* Subtle radial spotlight gradient behind right-hand side visualization to separate it from factory photo */}
          <div 
            className="absolute right-0 top-1/4 w-1/2 h-2/3 pointer-events-none z-10 opacity-60"
            style={{
              background: 'radial-gradient(circle at 70% 50%, #0f1115 10%, transparent 70%)'
            }}
          />
        </motion.div>
        
        {/* Subtle scroll progress line at bottom of Hero */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20 overflow-hidden">
          <motion.div 
            className="h-full bg-[#d97706]"
            style={noMotion ? {} : { scaleX: heroScrollProgress, transformOrigin: 'left' }}
          />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-16 md:pb-20 flex flex-col lg:flex-row justify-between items-end gap-12">
          
          {/* LEFT SIDE: Heading Copy and CTAs */}
          <motion.div 
            className="w-full lg:w-1/2 text-left" 
            style={noMotion ? {} : { y: smoothContentY, opacity: smoothContentOpacity }}
          >
            {/* Eyebrow entrance */}
            <motion.div 
              className="mb-6 flex items-center gap-4"
              initial={noMotion ? false : { opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: easeOut }}
            >
              <span className="block font-mono text-[#d97706] text-[10px] tracking-[0.25em] uppercase">
                Arabian Gratings UAE / Industrial Grating Systems
              </span>
              <motion.div 
                className="h-px bg-[#d97706]"
                initial={{ width: 0 }}
                animate={{ width: 45 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              />
            </motion.div>
            
            <div className="space-y-1 mb-8">
              <div className="overflow-hidden">
                <motion.h1 
                  className="font-display font-black text-white text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.92] tracking-tighter uppercase" 
                  initial={noMotion ? false : { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }} 
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }} 
                  transition={{ duration: 0.9, delay: 0.15, ease: easeOut }}
                >
                  Engineered For
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.span 
                  className="font-display font-black text-white text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.92] tracking-tighter uppercase block" 
                  initial={noMotion ? false : { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }} 
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }} 
                  transition={{ duration: 0.9, delay: 0.27, ease: easeOut }}
                >
                  Demanding
                </motion.span>
              </div>
              <div className="overflow-hidden relative pb-2">
                <motion.span 
                  className="font-display font-black text-[#d97706] text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.92] tracking-tighter uppercase block" 
                  initial={noMotion ? false : { opacity: 0, y: 70, clipPath: 'inset(100% 0 0 0)' }} 
                  animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }} 
                  transition={{ duration: 0.9, delay: 0.39, ease: easeOut }}
                >
                  Industries<span className="text-white">.</span>
                </motion.span>
                <motion.div 
                  className="absolute bottom-0 left-0 h-[2px] bg-[#d97706]"
                  initial={{ width: 0 }}
                  animate={{ width: 70 }}
                  transition={{ duration: 0.6, delay: 1.0, ease: easeOut }}
                />
              </div>
            </div>

            <motion.p 
              className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed max-w-xl mb-10 opacity-90"
              initial={noMotion ? false : { opacity: 0, y: 25, clipPath: 'inset(20px 0 0 0)' }}
              animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
              transition={{ duration: 0.7, delay: 0.55, ease: easeOut }}
            >
              Industrial flooring, access platforms, grating systems and engineered access solutions built for demanding industrial environments across the UAE and GCC.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 items-start mb-12" 
              initial={noMotion ? false : { opacity: 0, y: 25, scale: 0.97 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              transition={{ duration: 0.7, delay: 0.7, ease: easeOut }}
            >
              <Link href="/quote" className="group relative overflow-hidden inline-flex items-center gap-3 bg-[#d97706] hover:bg-[#b45309] text-white font-display text-xs font-bold uppercase tracking-[0.15em] px-8 py-4 transition-all duration-300 hover:scale-[1.02]">
                Request a Quote
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link href="/products" className="group inline-flex items-center gap-2 text-white/80 hover:text-white font-display text-xs font-bold uppercase tracking-[0.15em] px-4 py-4 transition-all duration-300 border border-transparent hover:border-white/20">
                Explore Products
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">&rarr;</span>
              </Link>
            </motion.div>

            {/* Credentials Row */}
            <motion.div 
              className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8" 
              initial={noMotion ? false : { opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ duration: 1.0, delay: 0.85 }}
            >
              {[{ value: '15+', label: 'Years in UAE' }, { value: 'ISO 9001 / Standards', label: 'Quality Credentials' }, { value: '500+', label: 'Projects Delivered' }, { value: 'UAE / GCC', label: 'Regional Coverage' }].map((stat, idx) => {
                const isActive = (isHoveredStat !== null ? isHoveredStat === idx : activeStatIndex === idx) && !noMotion;
                return (
                  <div 
                    key={stat.label}
                    className="relative transition-all duration-500 cursor-pointer select-none"
                    onMouseEnter={() => setIsHoveredStat(idx)}
                    onMouseLeave={() => setIsHoveredStat(null)}
                    style={{
                      opacity: isActive ? 1.0 : 0.55,
                      transform: isActive ? 'scale(1.03) translateY(-3px)' : 'scale(1) translateY(0)',
                      transition: 'opacity 0.4s ease, transform 0.4s ease'
                    }}
                  >
                    <span className={`block font-display font-black text-2xl tracking-tight ${isActive ? 'text-[#d97706]' : 'text-white'}`}>
                      {stat.value}
                    </span>
                    <span className="block font-mono text-white/50 text-[9px] uppercase tracking-widest mt-1">
                      {stat.label}
                    </span>
                    <div className="absolute -bottom-2 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#d97706]"
                        initial={{ width: '0%' }}
                        animate={{ width: isActive ? '100%' : '0%' }}
                        transition={{ duration: isActive ? 2.8 : 0.3, ease: 'linear' }}
                      />
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: Premium animated engineering visualization (SVG Stage) */}
          <div 
            className="w-full lg:w-1/2 h-[450px] lg:h-[550px] relative hidden sm:flex items-center justify-center select-none"
            aria-hidden="true"
          >
            <div className="absolute inset-0 border border-white/5 bg-[#0f1115]/30 backdrop-blur-sm overflow-hidden flex flex-col justify-between p-6">
              
              {/* Grid backdrop */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                  backgroundSize: '24px 24px'
                }}
              />

              {/* Top technical parameters display */}
              <div className="flex justify-between items-start font-mono text-[9px] text-white/30 uppercase tracking-widest relative z-10">
                <div>
                  SYSTEM STATUS: ACTIVE<br />
                  GRID SPAN: 1200 x 3000 MM
                </div>
                <div className="text-right">
                  DEVIATION LIMIT: +/- 0.5MM<br />
                  MATERIAL CODE: S235JR
                </div>
              </div>

              {/* Main SVG Graphic Grid perspective drawing */}
              <div className="w-full h-2/3 flex items-center justify-center relative">
                <svg viewBox="0 0 500 300" className="w-full h-full text-white/20">
                  {/* Perspective coordinate grid line projection */}
                  <line x1="50" y1="220" x2="450" y2="220" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="100" y1="120" x2="400" y2="120" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="50" y1="220" x2="100" y2="120" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="450" y1="220" x2="400" y2="120" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />

                  {/* Draw the grating system layout lines */}
                  {Array.from({ length: 9 }).map((_, i) => {
                    const x1 = 100 + i * 37.5;
                    const x2 = 50 + i * 50;
                    return (
                      <motion.line 
                        key={i}
                        x1={x1} y1="120" x2={x2} y2="220" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.8, delay: 0.5 + i * 0.1 }}
                      />
                    );
                  })}

                  {/* Horizontal cross bars */}
                  {Array.from({ length: 6 }).map((_, i) => {
                    const yOffset = 120 + i * 20;
                    const xLeft = 100 - i * 10;
                    const xRight = 400 + i * 10;
                    return (
                      <motion.line 
                        key={i}
                        x1={xLeft} y1={yOffset} x2={xRight} y2={yOffset} 
                        stroke="currentColor" 
                        strokeWidth="1" 
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1.5, delay: 0.2 + i * 0.12 }}
                      />
                    );
                  })}

                  {/* Dimension lines */}
                  <motion.g 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.2 }}
                    className="text-[#d97706]"
                  >
                    {/* Dimension Line 1 */}
                    <line x1="40" y1="230" x2="460" y2="230" stroke="currentColor" strokeWidth="1" />
                    <line x1="40" y1="225" x2="40" y2="235" stroke="currentColor" strokeWidth="1" />
                    <line x1="460" y1="225" x2="460" y2="235" stroke="currentColor" strokeWidth="1" />
                    <text x="250" y="245" fill="currentColor" className="font-mono text-[8px] uppercase tracking-widest text-center" textAnchor="middle">
                      SPAN: 3000 MM
                    </text>
                  </motion.g>

                  {/* Scan line overlay sweeping horizontally */}
                  <motion.line 
                    x1="50" y1="110" x2="50" y2="230" 
                    stroke="#d97706" 
                    strokeWidth="2" 
                    className="opacity-60"
                    animate={{
                      x: [0, 400, 0]
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: 'easeInOut'
                    }}
                  />
                </svg>
              </div>

              {/* Bottom active telemetry spec labels */}
              <div className="flex justify-between items-end border-t border-white/5 pt-4 relative z-10">
                <div>
                  <span className="block font-mono text-white/30 text-[8px] uppercase tracking-widest">
                    ACTIVE PARAMETER
                  </span>
                  <span className="block font-mono text-[#d97706] text-xs font-black tracking-wider uppercase mt-0.5">
                    {visSpecsList[visSpecIndex].label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-mono text-white/30 text-[8px] uppercase tracking-widest">
                    READ VALUE
                  </span>
                  <span className="block font-mono text-white text-xs font-black tracking-wider uppercase mt-0.5">
                    {visSpecsList[visSpecIndex].val}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 02 — ENGINEERING INTRO */}
      <section ref={introRef} className="bg-[#0f1115] text-white py-32 relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT COLUMN: Technical specs indicator list */}
            <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-28">
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block">
                  01 // ENGINEERING &mdash; UAE / GCC
                </span>
              </FadeUp>
              <div className="w-12 h-[2px] bg-[#d97706]/40" />
              <div className="space-y-4">
                <span className="block font-mono text-white/30 text-[9px] uppercase tracking-widest leading-relaxed">
                  SYSTEM TYPE: STRUCTURAL SYSTEMS<br />
                  MATERIALS: STEEL / FRP / ALUMINIUM<br />
                  DESIGN BASE: SITE ENGINEERED ACCESS<br />
                  REGULATORY: GCC MUNICIPAL COMPLIANT
                </span>
              </div>
            </div>

            {/* RIGHT COLUMN: Statement + Technical material showcase layout */}
            <div className="lg:col-span-8 space-y-12">
              <div className="space-y-6">
                <MaskReveal delay={0.12}>
                  <h2 className="font-display font-black text-white text-[clamp(2.2rem,4.8vw,4rem)] leading-[0.95] tracking-tighter uppercase">
                    Engineered For<br />The Environments<br />That Demand More.
                  </h2>
                </MaskReveal>
                <FadeUp delay={0.25} className="max-w-2xl">
                  <p className="text-zinc-350 text-sm leading-relaxed">
                    Arabian Gratings supplies site-engineered platform floor structures to steel suppliers, fabricators, and engineering firms across the GCC. Each batch complies with structural safety ratios and local UAE municipal specifications.
                  </p>
                </FadeUp>
              </div>

              {/* Interactive Technical Material Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
                {[
                  { id: 0, num: '01', title: 'STEEL', desc: 'CARBON & ALLOY' },
                  { id: 1, num: '02', title: 'FRP', desc: 'FIBERGLASS MATRIX' },
                  { id: 2, num: '03', title: 'ALUMINIUM', desc: 'LIGHTWEIGHT' }
                ].map((item) => {
                  const isActive = isHoveredMat !== null ? isHoveredMat === item.id : activeMatIndex === item.id;
                  return (
                    <div 
                      key={item.id}
                      className="relative cursor-pointer transition-all duration-300 py-4 select-none"
                      onMouseEnter={() => setIsHoveredMat(item.id)}
                      onMouseLeave={() => setIsHoveredMat(null)}
                      style={{
                        transform: isActive ? 'translateX(8px)' : 'translateX(0)'
                      }}
                    >
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#d97706]/20">
                        <motion.div 
                          className="w-full bg-[#d97706]"
                          initial={{ height: '0%' }}
                          animate={{ height: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="pl-4">
                        <span className={`block font-mono text-[9px] uppercase tracking-widest ${isActive ? 'text-[#d97706]' : 'text-white/40'}`}>
                          {item.num} {"//"} SPEC
                        </span>
                        <h3 className={`font-display font-black text-lg uppercase tracking-tight mt-1 ${isActive ? 'text-[#d97706]' : 'text-white'}`}>
                          {item.title}
                        </h3>
                        <span className="block font-sans text-[11px] text-white/50 uppercase tracking-wider mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Visual image stage showcasing currently active material */}
              <div className="pt-8 relative w-full aspect-[16/9] overflow-hidden bg-slate-900">
                {[
                  '/facility-overview.jpg',
                  '/product-frp-grating.jpg',
                  '/product-steel-grating.jpg'
                ].map((imgSrc, idx) => {
                  const isActive = isHoveredMat !== null ? isHoveredMat === idx : activeMatIndex === idx;
                  return (
                    <motion.div 
                      key={imgSrc}
                      className="absolute inset-0 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.8, ease: easeOut }}
                    >
                      <Image 
                        src={imgSrc} 
                        alt="Arabian Gratings structural material overview" 
                        fill
                        sizes="100vw"
                        className="object-cover saturate-[0.8]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115]/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 font-mono text-white/40 text-[9px] uppercase tracking-widest">
                        METRIC STABILITY // UAE
                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 03 — PRODUCTS */}
      <section ref={productsRef} className="bg-[#0f1115] text-[#f8fafc] py-32 relative z-20 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* LEFT COLUMN: Sticky product selector navigator */}
            <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-28">
              <div>
                <FadeUp delay={0.05}>
                  <span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block mb-4">
                    02 // PRODUCT CATALOG
                  </span>
                </FadeUp>
                <MaskReveal delay={0.1}>
                  <h2 className="font-display font-black text-white text-[clamp(2.2rem,4.5vw,3.8rem)] leading-[0.92] tracking-tighter uppercase mb-6">
                    Engineered<br />For Every<br />Application.
                  </h2>
                </MaskReveal>
                <FadeUp delay={0.2}>
                  <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                    From heavy-duty steel grating to lightweight FRP and aluminium systems, Arabian Gratings delivers access and flooring solutions for GCC industrial environments.
                  </p>
                </FadeUp>
              </div>

              {/* Vertical Navigation Index */}
              <div className="space-y-6 pt-4 border-t border-white/10">
                {categories.map((cat, idx) => {
                  const isActive = isHoveredProd !== null ? isHoveredProd === idx : activeProdIndex === idx;
                  return (
                    <div 
                      key={cat.id}
                      className="relative cursor-pointer transition-all duration-300 pl-4 select-none py-2"
                      onMouseEnter={() => setIsHoveredProd(idx)}
                      onMouseLeave={() => setIsHoveredProd(null)}
                      onClick={() => setActiveProdIndex(idx)}
                      style={{
                        transform: isActive ? 'translateX(10px)' : 'translateX(0)'
                      }}
                    >
                      <div className="absolute top-0 left-0 w-[2px] h-full bg-[#d97706]/10">
                        <motion.div 
                          className="w-full bg-[#d97706]"
                          initial={{ height: '0%' }}
                          animate={{ height: isActive ? '100%' : '0%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className={`block font-mono text-[9px] uppercase tracking-widest ${isActive ? 'text-[#d97706]' : 'text-white/40'}`}>
                        0{idx + 1} {"//"} SYSTEMS
                      </span>
                      <h3 className={`font-display font-black text-sm uppercase tracking-tight mt-0.5 ${isActive ? 'text-[#d97706]' : 'text-white'}`}>
                        {cat.name}
                      </h3>
                    </div>
                  );
                })}
              </div>

              <FadeUp delay={0.35}>
                <Link href="/products" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#d97706] uppercase tracking-widest hover:text-white transition-colors duration-300">
                  All Systems &rarr;
                </Link>
              </FadeUp>
            </div>

            {/* RIGHT COLUMN: Cinematic visual showcase stage & specifications grid */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Product Stage */}
              <div className="relative w-full aspect-[4/3] min-h-[480px] sm:min-h-[580px] overflow-hidden bg-slate-900 shadow-2xl">
                {categories.map((cat, idx) => {
                  const isActive = isHoveredProd !== null ? isHoveredProd === idx : activeProdIndex === idx;
                  const imgSrc = (cat.image as string | null) || productImages[idx % productImages.length];
                  return (
                    <motion.div 
                      key={cat.id}
                      className="absolute inset-0 z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 1 : 0 }}
                      transition={{ duration: 0.9, ease: easeOut }}
                    >
                      <Image 
                        src={imgSrc} 
                        alt={cat.name} 
                        fill
                        sizes="100vw"
                        className="object-cover saturate-[0.8]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-[#0f1115]/30 to-transparent" />
                      
                      {/* Technical specifications overlays */}
                      <div className="absolute top-4 left-4 font-mono text-white/50 text-[9px] uppercase tracking-widest leading-relaxed">
                        SYSTEM INDEX: 0{idx + 1} / 04<br />
                        REGULATORY: ISO 9001 APPROVED
                      </div>

                      <div className="absolute bottom-6 left-6 text-left">
                        <span className="block font-mono text-[#d97706] text-[9px] uppercase tracking-widest mb-1">
                          PRODUCT TYPE // OVERVIEW
                        </span>
                        <h4 className="font-display font-black text-white text-xl sm:text-2xl uppercase tracking-tight">
                          {cat.name}
                        </h4>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Dynamic Active Product Specifications Grid */}
              <div className="pt-6 border-t border-white/10">
                <span className="block font-mono text-slate-500 text-[10px] uppercase tracking-widest mb-4">
                  Technical Specifications &mdash; Active System
                </span>
                
                {categories.map((cat, idx) => {
                  const isActive = isHoveredProd !== null ? isHoveredProd === idx : activeProdIndex === idx;
                  const specs = productSpecs[idx] ?? productSpecs[0];
                  if (!isActive) return null;
                  return (
                    <div key={cat.id} className="space-y-1">
                      {specs.map((spec, sIdx) => (
                        <motion.div 
                          key={spec.label} 
                          className="flex justify-between items-center py-3 border-b border-white/6"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: sIdx * 0.1, ease: easeOut }}
                        >
                          <span className="font-mono text-slate-500 text-[10px] uppercase tracking-widest">{spec.label}</span>
                          <span className="font-mono text-slate-200 text-[10px] uppercase tracking-wider">{spec.value}</span>
                        </motion.div>
                      ))}
                    </div>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 04 — INDUSTRIES */}
      <section ref={industriesRef} className="bg-[#0b0d10] text-white py-32 relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start lg:items-end">
            <div className="lg:col-span-8">
              <FadeUp delay={0.05}>
                <span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block mb-4">
                  03 // INDUSTRIES &mdash; UAE / GCC
                </span>
              </FadeUp>
              <MaskReveal delay={0.1}>
                <h2 className="font-display font-black text-white text-[clamp(2.5rem,5.5vw,5.5rem)] leading-[0.92] tracking-tighter uppercase">
                  Built For<br />Harsh<br />Atmospheres.
                </h2>
              </MaskReveal>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <FadeUp delay={0.2}>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  Engineered access systems for demanding environments across energy, infrastructure, marine, utilities and industrial facilities.
                </p>
              </FadeUp>
              <FadeUp delay={0.28}>
                <Link href="/industries" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#d97706] uppercase tracking-widest hover:text-white transition-colors duration-300">
                  Explore All Industries &rarr;
                </Link>
              </FadeUp>
            </div>
          </div>
        </div>
        
        {/* Interactive Industry Accordion Panel Stage */}
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
          <div 
            className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[620px] overflow-hidden"
            onMouseEnter={() => setIsHoveredInd(activeIndIndex)}
            onMouseLeave={() => setIsHoveredInd(null)}
          >
            {industries.map((ind, idx) => {
              const isActive = isHoveredInd !== null ? isHoveredInd === idx : activeIndIndex === idx;
              const imgSrc = (ind.image as string | null) || industryImages[idx % industryImages.length];
              return (
                <motion.div 
                  key={ind.id} 
                  className="relative overflow-hidden bg-slate-950 flex flex-col justify-end"
                  animate={{
                    width: noMotion ? '100%' : (isActive ? '55%' : '11%'),
                    height: noMotion ? 'auto' : 'auto'
                  }}
                  transition={{ duration: 0.85, ease: easeOut }}
                  onClick={() => {
                    setActiveIndIndex(idx);
                    setIsHoveredInd(idx);
                  }}
                  style={{
                    minHeight: noMotion ? '350px' : '450px'
                  }}
                >
                  {/* Image container with subtle scaling parallax */}
                  <div className="absolute inset-0 z-0">
                    <Image 
                      src={imgSrc} 
                      alt={ind.name} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 800px" 
                      className={`object-cover saturate-[0.8] transition-transform duration-1000 ${isActive ? 'scale-105' : 'scale-100'}`}
                    />
                    <div className="absolute inset-0 bg-[#0f1115]/80 z-10 transition-opacity duration-700" style={{ opacity: isActive ? 0.45 : 0.8 }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0d10] via-transparent to-transparent z-20" />
                  </div>

                  {/* Panel Technical Overlays */}
                  <div className="relative z-30 p-6 sm:p-8 flex flex-col justify-between h-full select-none">
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-[#d97706] text-xs font-black">
                        0{idx + 1}
                      </span>
                      {isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
                          <motion.div 
                            className="h-full bg-[#d97706]"
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3.6, ease: 'linear' }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-display font-black text-white text-lg uppercase tracking-tight">
                        {ind.name}
                      </h3>
                      
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.15 }}
                          className="space-y-4"
                        >
                          <p className="font-sans text-zinc-350 text-xs leading-relaxed max-w-md">
                            {ind.short_description}
                          </p>
                          <Link href={`/industries/${ind.slug}`} className="group/link inline-flex items-center gap-2 font-mono text-[9px] text-[#d97706] uppercase tracking-[0.2em]">
                            View Industry
                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/link:translate-x-1.5" />
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05 — CAPABILITIES */}
      <section ref={capabilitiesRef} className="bg-[#0f1115] text-white py-28 relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4">
              <FadeUp delay={0.05}><span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block mb-6">04 // Quality Assurance</span></FadeUp>
              <MaskReveal delay={0.12}><h2 className="font-display font-black text-white text-[clamp(1.8rem,3.5vw,3rem)] leading-none tracking-tighter uppercase">Built Around<br />Engineering<br />Precision.</h2></MaskReveal>
              <FadeUp delay={0.3}><p className="mt-6 text-slate-400 text-sm leading-relaxed">From raw material selection through to load testing and quality certification &mdash; every step is traceable and documented.</p></FadeUp>
            </div>
            <div className="lg:col-span-8">
              <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10%' }}>
                {[
                  { num: '01', title: 'Materials Selection', detail: 'ASTM A36 / S355JR / ISO 898-1', sub: 'Carbon steel, alloy steel, stainless, and fiberglass matrix sourcing.' },
                  { num: '02', title: 'Fabrication Engineering', detail: 'Hydraulic Press Fusion', sub: 'Cross rods and load bars fused into single-piece floor sheets under hydraulic pressure.' },
                  { num: '03', title: 'Testing Standards', detail: 'BS EN 14122-2 / ASTM A985', sub: 'All panels verified against deflection metrics.' },
                  { num: '04', title: 'Surface Finishing', detail: 'ISO 1461 Hot-Dip Galvanizing', sub: 'Zinc coating parameters optimized to withstand seawater spray and chemical exposure.' },
                ].map((cap) => (
                  <motion.div 
                    key={cap.num} 
                    variants={staggerItem} 
                    className="group border-t border-white/8 py-7 grid grid-cols-12 gap-4 sm:gap-6 items-start transition-all duration-300 hover:border-[#d97706]/40 cursor-default"
                    whileHover={noMotion ? {} : { x: 10 }}
                  >
                    <span className="col-span-1 font-mono text-[#d97706]/60 text-xs pt-0.5 group-hover:translate-x-1 transition-transform duration-300">{cap.num}</span>
                    <div className="col-span-5 pr-4">
                      <h3 className="font-display font-black text-white text-base uppercase tracking-wide group-hover:text-[#d97706] transition-colors duration-300">{cap.title}</h3>
                      <span className="font-mono text-slate-500 text-[9px] uppercase tracking-widest mt-1 block">{cap.detail}</span>
                    </div>
                    <p className="col-span-6 font-sans text-slate-400 text-xs leading-relaxed opacity-85 group-hover:opacity-100 transition-opacity duration-300">{cap.sub}</p>
                  </motion.div>
                ))}
                <div className="border-t border-white/8" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — PROJECTS */}
      <section ref={projectsRef} className="bg-[#f8fafc] py-28 relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-8 mb-20">
            <div>
              <FadeUp delay={0.05}><span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block mb-4">05 // Case Installations</span></FadeUp>
              <MaskReveal delay={0.1}><h2 className="font-display font-black text-[#0f1115] text-[clamp(2rem,4.5vw,3.5rem)] leading-none tracking-tighter uppercase">Selected Installations</h2></MaskReveal>
            </div>
            <FadeUp delay={0.2}><Link href="/projects" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#d97706] uppercase tracking-widest mt-6 sm:mt-0 hover:text-[#0f1115] transition-colors duration-300">All Projects<ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" /></Link></FadeUp>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {projects.map((proj, idx) => {
              const imgSrc = (proj.featured_image as string | null) || projectImages[idx % projectImages.length];
              const isFirst = idx === 0;
              return (
                <div key={proj.id} className={`group ${isFirst ? 'lg:col-span-7' : 'lg:col-span-5 lg:mt-24'}`}>
                  <ImageReveal 
                    src={imgSrc} 
                    alt={proj.title} 
                    parallaxSpeed={0.04} 
                    aspectClass={isFirst ? 'aspect-[16/10]' : 'aspect-[4/3]'} 
                    className="mb-6"
                  />
                  <FadeUp delay={0.18 + idx * 0.1}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                        <span className="text-slate-400">{proj.project_date || 'UAE'}</span>
                        <span className="text-slate-400 text-right">{proj.location}</span>
                      </div>
                      <h3 className="font-display font-black text-[#0f1115] text-xl sm:text-2xl uppercase tracking-tight leading-tight group-hover:text-[#d97706] transition-colors duration-300">
                        <Link href={`/projects/${proj.slug}`}>{proj.title}</Link>
                      </h3>
                      <p className="font-sans text-slate-550 text-xs leading-relaxed">{proj.description}</p>
                      <Link href={`/projects/${proj.slug}`} className="group/link inline-flex items-center gap-2 font-mono text-[10px] text-[#d97706] uppercase tracking-[0.2em] hover:gap-3 transition-all duration-300">
                        View Project
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </FadeUp>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 07 — INSIGHTS */}
      <section ref={insightsRef} className="bg-white py-28 border-t border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-8 mb-16">
            <div>
              <FadeUp delay={0.05}><span className="font-mono text-[#d97706] text-[10px] uppercase tracking-[0.25em] block mb-4">06 // Technical Reports</span></FadeUp>
              <MaskReveal delay={0.1}><h2 className="font-display font-black text-[#0f1115] text-[clamp(2rem,4.5vw,3.5rem)] leading-none tracking-tighter uppercase">Industry Insights</h2></MaskReveal>
            </div>
            <FadeUp delay={0.2}><Link href="/blog" className="group inline-flex items-center gap-2 font-mono text-[10px] text-[#d97706] uppercase tracking-widest mt-6 sm:mt-0 hover:text-[#0f1115] transition-colors duration-300">Knowledge Hub<ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" /></Link></FadeUp>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {posts[0] && (
              <FadeUp delay={0.1} className="lg:col-span-7">
                <Link href={`/blog/${posts[0].slug}`} className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0f1115] mb-6">
                    <div className="w-full h-full bg-gradient-to-br from-[#0f1115] via-slate-800 to-slate-700 flex items-end p-8">
                      <span className="font-display font-black text-white/12 text-5xl uppercase tracking-tighter leading-none">Technical</span>
                    </div>
                    <div className="absolute inset-0 group-hover:bg-[#0f1115]/10 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d97706]" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4 font-mono text-[10px] text-slate-400 uppercase tracking-widest">
                      <span>{posts[0].published_at}</span>
                      <span className="w-1 h-1 rounded-full bg-[#d97706]" />
                      <span className="text-[#d97706] font-bold">{posts[0].category?.name}</span>
                    </div>
                    <h3 className="font-display font-black text-[#0f1115] text-2xl sm:text-3xl leading-tight uppercase tracking-tight group-hover:text-[#d97706] transition-colors duration-300">{posts[0].title}</h3>
                    <p className="font-sans text-slate-550 text-sm leading-relaxed">{posts[0].excerpt}</p>
                    <span className="inline-flex items-center gap-2 font-mono text-[10px] text-[#d97706] uppercase tracking-widest group-hover:gap-3 transition-all duration-300">Read Article<ArrowRight className="w-3.5 h-3.5" /></span>
                  </div>
                </Link>
              </FadeUp>
            )}
            <div className="lg:col-span-5 flex flex-col gap-8">
              {posts.slice(1).map((post, i) => (
                <FadeUp key={post.id} delay={0.2 + i * 0.12}>
                  <Link href={`/blog/${post.slug}`} className="group block border-b border-slate-100 pb-7 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-3">
                      <span>{post.published_at}</span>
                      <span className="text-[#d97706] font-bold">{post.category?.name}</span>
                    </div>
                    <h4 className="font-display font-black text-[#0f1115] text-base sm:text-lg uppercase tracking-tight leading-tight group-hover:text-[#d97706] transition-colors duration-300 mb-2">{post.title}</h4>
                    <p className="font-sans text-slate-550 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </Link>
                </FadeUp>
              ))}
              <FadeUp delay={0.4}>
                <div className="bg-[#0f1115] p-6 text-white">
                  <span className="font-mono text-[#d97706] text-[9px] uppercase tracking-widest block mb-2">Standard // Quality</span>
                  <p className="font-sans text-slate-300 text-xs leading-relaxed">Mill Test Certificates (MTC) matching standard alloy classifications are enclosed with every delivery in the GCC region.</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* 08 — CTA */}
      <CtaSection />

    </div>
  );
}
