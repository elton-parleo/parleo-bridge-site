import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600; // Update homepage every hour

export default async function HomePage() {
  // Fetch featured products from your Supabase table
  const { data: products } = await supabase
    .from("products")
    .select("sku, title, price, sale_price, currency, star_review, image_link, brand")
    .limit(8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* HERO SECTION */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          Expert Reviews. <span className="text-blue-600">Better Gifts.</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          We analyze thousands of data points from our proprietary database to 
          bring you unbiased reviews and the best prices.
        </p>
      </section>

      {/* PRODUCT GRID */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold">Featured Reviews</h2>
          <Link href="/products" className="text-blue-600 flex items-center gap-1 text-sm font-bold">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}