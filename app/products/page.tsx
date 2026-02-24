import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const revalidate = 3600; // Refresh data every hour
const POSTS_PER_PAGE = 24;

export default async function AllProductsPage(props: { 
  searchParams: Promise<{ page?: string }> 
}) {
  const searchParams = await props.searchParams; // Next.js 15 unwrapping
  const currentPage = Number(searchParams.page) || 1;
  
  // Calculate range for Supabase
  const from = (currentPage - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  // Fetch data + total count
  const { data: products, count, error } = await supabase
    .from("products")
    .select("sku, title, price, sale_price, currency, star_review, image_link, brand", { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  if (error) {
    return <div className="p-20 text-center">Error loading products.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* HEADER SECTION */}
      <header className="mb-12 border-b pb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">All Reviews</h1>
        <p className="text-slate-500">
          Browse our complete database of expert product reviews.
        </p>
      </header>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products?.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>

      {/* PAGINATION CONTROLS */}
      <div className="mt-16 flex justify-center items-center gap-4">
        {currentPage > 1 && (
          <Link 
            href={`/products?page=${currentPage - 1}`}
            className="px-4 py-2 border rounded-lg hover:bg-slate-50 transition-colors"
          >
            Previous
          </Link>
        )}

        <span className="text-sm font-medium text-slate-600">
          Page {currentPage} of {totalPages}
        </span>

        {currentPage < totalPages && (
          <Link 
            href={`/products?page=${currentPage + 1}`}
            className="px-4 py-2 border rounded-lg hover:bg-slate-50 transition-colors"
          >
            Next
          </Link>
        )}
      </div>

      {/* EMPTY STATE */}
      {products?.length === 0 && (
        <div className="text-center py-20">
          <p className="text-slate-400 italic">No products found in the database yet.</p>
        </div>
      )}
    </div>
  );
}