import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight } from "lucide-react";
import { getActivePrice } from "@/lib/utils";

// Define the types for the product prop
interface ProductCardProps {
  product: {
    sku: string;
    title: string;
    price: number;
    sale_price: number | null;
    currency: string;
    star_review: string | null;
    image_link: string | null;
    brand: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const prices = getActivePrice(product.price, product.sale_price);

  return (
    <Link 
      href={`/products/${product.sku}`}
      className="group flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-blue-200 transition-all duration-300"
    >
      {/* IMAGE WRAPPER */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden p-6">
        <Image 
          src={product.image_link || "/placeholder.png"} 
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-1 rounded">
            {product.brand}
          </span>
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={12} fill="currentColor" />
            <span className="text-xs font-bold text-slate-700">{product.star_review}</span>
          </div>
        </div>

        <h2 className="font-bold text-slate-800 line-clamp-2 leading-snug mb-4 h-10">
          {product.title}
        </h2>

        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            {prices.sale ? (
              <>
                <span className="text-red-600 font-bold text-lg leading-none">
                  {product.currency} {prices.sale}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {product.currency} {prices.original}
                </span>
              </>
            ) : (
              <span className="text-slate-900 font-bold text-lg">
                {product.currency} {prices.original}
              </span>
            )}
          </div>
          
          <div className="bg-slate-100 p-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ChevronRight size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}