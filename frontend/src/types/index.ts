export interface SEOData {
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  no_index: boolean;
}

export interface Media {
  id: number;
  file: string;
  alt_text: string;
  title: string;
  caption: string;
  created_at: string;
}

export interface Document {
  id: number;
  title: string;
  file: string;
  document_type: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductCategory extends SEOData {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: Media | null;
  is_active: boolean;
}

export interface ProductImage {
  id: number;
  media: Media;
  sort_order: number;
}

export interface Product extends SEOData {
  id: number;
  name: string;
  slug: string;
  category: ProductCategory;
  short_description: string;
  description: string;
  description_blocks: unknown[];
  specifications: Record<string, string>;
  applications: string;
  product_images: ProductImage[];
  documents: Document[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Industry extends SEOData {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  description_blocks: unknown[];
  image: Media | null;
  applications: string;
  related_products: Product[];
  is_active: boolean;
}

export interface Solution extends SEOData {
  id: number;
  name: string;
  slug: string;
  description: string;
  description_blocks: unknown[];
  image: Media | null;
  related_products: Product[];
  related_industries: Industry[];
  is_active: boolean;
}

export interface Service extends SEOData {
  id: number;
  name: string;
  slug: string;
  description: string;
  description_blocks: unknown[];
  image: Media | null;
  is_active: boolean;
}

export interface Project extends SEOData {
  id: number;
  title: string;
  slug: string;
  location: string;
  associated_industries: Industry[];
  description: string;
  description_blocks: unknown[];
  featured_image: Media | null;
  project_images: { id: number; media: Media; sort_order: number }[];
  products_used: Product[];
  project_date: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
}


export interface BlogPost extends SEOData {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  content_blocks: unknown[];
  featured_image: Media | null;
  category: BlogCategory;
  author: { id: number; name: string };
  status: 'DRAFT' | 'PUBLISHED';
  is_featured: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  related_products: Product[];
  related_industries: Industry[];
  related_posts: BlogPost[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
