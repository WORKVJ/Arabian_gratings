/* eslint-disable @typescript-eslint/no-explicit-any */
import { 
  Product, ProductListItem, ProductCategory, Industry, Solution, Service, Project, BlogPost, PaginatedResponse, BlogCategory 
} from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_MEDIA_URL || 'http://127.0.0.1:8000';

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  if (path.startsWith('/media/')) {
    return `${MEDIA_BASE_URL}${path}`;
  }
  if (path.startsWith('uploads/')) {
    return `${MEDIA_BASE_URL}/media/${path}`;
  }
  return path;
}

export class APIError extends Error {
  status: number;
  data: any;
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

async function fetchFromAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Fallback if not JSON
      }
      throw new APIError(data?.detail || `API error: ${res.statusText} (${res.status})`, res.status, data);
    }
    return await res.json() as T;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    console.error(`Fetch error for URL ${url}:`, error);
    throw error;
  }
}

// Products API
export async function getProducts(params?: {
  category?: string;
  is_featured?: boolean;
  search?: string;
  page_size?: number;
}): Promise<PaginatedResponse<ProductListItem>> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.is_featured) query.append('is_featured', String(params.is_featured));
  if (params?.search) query.append('search', params.search);
  if (params?.page_size) query.append('page_size', String(params.page_size));
  
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchFromAPI<PaginatedResponse<ProductListItem>>(`/products/${queryString}`, {
    next: { tags: ['products'], revalidate: 86400 }
  });
}

export async function getProduct(slug: string): Promise<Product> {
  return fetchFromAPI<Product>(`/products/${slug}/`, {
    next: { tags: [`product-${slug}`], revalidate: 86400 }
  });
}

export async function getProductCategories(): Promise<PaginatedResponse<ProductCategory>> {
  return fetchFromAPI<PaginatedResponse<ProductCategory>>('/products/categories/', {
    next: { tags: ['categories'], revalidate: 86400 }
  });
}

export async function getProductCategory(slug: string): Promise<ProductCategory> {
  return fetchFromAPI<ProductCategory>(`/products/categories/${slug}/`, {
    next: { tags: [`category-${slug}`], revalidate: 86400 }
  });
}

// Industries API
export async function getIndustries(): Promise<PaginatedResponse<Industry>> {
  return fetchFromAPI<PaginatedResponse<Industry>>('/industries/', {
    next: { tags: ['industries'], revalidate: 86400 }
  });
}

export async function getIndustry(slug: string): Promise<Industry> {
  return fetchFromAPI<Industry>(`/industries/${slug}/`, {
    next: { tags: [`industry-${slug}`], revalidate: 86400 }
  });
}

// Solutions API
export async function getSolutions(): Promise<PaginatedResponse<Solution>> {
  return fetchFromAPI<PaginatedResponse<Solution>>('/solutions/', {
    next: { tags: ['solutions'], revalidate: 86400 }
  });
}

export async function getSolution(slug: string): Promise<Solution> {
  return fetchFromAPI<Solution>(`/solutions/${slug}/`, {
    next: { tags: [`solution-${slug}`], revalidate: 86400 }
  });
}

// Services API
export async function getServices(): Promise<PaginatedResponse<Service>> {
  return fetchFromAPI<PaginatedResponse<Service>>('/services/', {
    next: { tags: ['services'], revalidate: 86400 }
  });
}

export async function getService(slug: string): Promise<Service> {
  return fetchFromAPI<Service>(`/services/${slug}/`, {
    next: { tags: [`service-${slug}`], revalidate: 86400 }
  });
}

// Projects API
export async function getProjects(params?: { industry?: string; product?: string; is_featured?: boolean }): Promise<PaginatedResponse<Project>> {
  const query = new URLSearchParams();
  if (params?.industry) query.append('industry', params.industry);
  if (params?.product) query.append('product', params.product);
  if (params?.is_featured) query.append('is_featured', String(params.is_featured));
  
  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchFromAPI<PaginatedResponse<Project>>(`/projects/${queryString}`, {
    next: { tags: ['projects'], revalidate: 86400 }
  });
}

export async function getProject(slug: string): Promise<Project> {
  return fetchFromAPI<Project>(`/projects/${slug}/`, {
    next: { tags: [`project-${slug}`], revalidate: 86400 }
  });
}

// Blog API
export async function getBlogPosts(params?: {
  category?: string;
  product?: string;
  industry?: string;
  is_featured?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}): Promise<PaginatedResponse<BlogPost>> {
  const query = new URLSearchParams();
  if (params?.category) query.append('category', params.category);
  if (params?.product) query.append('product', params.product);
  if (params?.industry) query.append('industry', params.industry);
  if (params?.is_featured) query.append('is_featured', String(params.is_featured));
  if (params?.search) query.append('search', params.search);
  if (params?.page && params.page > 1) query.append('page', String(params.page));
  if (params?.page_size) query.append('page_size', String(params.page_size));

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return fetchFromAPI<PaginatedResponse<BlogPost>>(`/blog/${queryString}`, {
    next: { tags: ['blog'], revalidate: 86400 }
  });
}


export async function getBlogPost(slug: string): Promise<BlogPost> {
  return fetchFromAPI<BlogPost>(`/blog/${slug}/`, {
    next: { tags: [`blog-${slug}`], revalidate: 86400 }
  });
}

export async function getBlogCategories(): Promise<PaginatedResponse<BlogCategory>> {
  return fetchFromAPI<PaginatedResponse<BlogCategory>>('/blog/categories/', {
    next: { tags: ['blog-categories'], revalidate: 86400 }
  });
}

export async function getBlogCategory(slug: string): Promise<BlogCategory> {
  return fetchFromAPI<BlogCategory>(`/blog/categories/${slug}/`, {
    next: { tags: [`blog-category-${slug}`], revalidate: 86400 }
  });
}

// Enquiry Form Submissions
export async function submitContactEnquiry(data: {
  name: string;
  company?: string;
  email: string;
  phone: string;
  message: string;
}): Promise<any> {
  return fetchFromAPI('/enquiries/contact/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

export async function submitQuoteRequest(formData: FormData): Promise<any> {
  return fetchFromAPI('/enquiries/quote/', {
    method: 'POST',
    body: formData,
  });
}
