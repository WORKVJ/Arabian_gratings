import HomeClient from '@/components/home/HomeClient';
import { getProductCategories, getIndustries, getProjects, getBlogPosts } from '@/lib/api/client';
import { ProductCategory, Industry, Project, BlogPost } from '@/types';

export const revalidate = 86400; // Cache page for 24 hours

export default async function Home() {
  // Fetch data from Django API with try/catch to handle fallback cases gracefully
  let categories: ProductCategory[] = [];
  let industries: Industry[] = [];
  let projects: Project[] = [];
  let posts: BlogPost[] = [];

  try {
    const catRes = await getProductCategories();
    categories = catRes.results || [];
  } catch {
    console.warn("Product categories not available from backend. Using fallbacks.");
  }

  try {
    const indRes = await getIndustries();
    industries = indRes.results || [];
  } catch {
    console.warn("Industries not available from backend. Using fallbacks.");
  }

  try {
    const projRes = await getProjects({ is_featured: true });
    projects = projRes.results || [];
  } catch {
    console.warn("Featured projects not available from backend. Using fallbacks.");
  }

  try {
    const blogRes = await getBlogPosts({ page_size: 3 });
    posts = blogRes.results || [];
  } catch {
    console.warn("Featured blog posts not available from backend. Using fallbacks.");
  }

  return (
    <HomeClient 
      categories={categories} 
      industries={industries} 
      projects={projects}
      posts={posts}
    />
  );
}

