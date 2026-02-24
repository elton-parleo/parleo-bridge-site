import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// 1. Tell Next.js to revalidate data every hour (ISR)
export const revalidate = 3600; 

// Helper function to convert cents to a displayable decimal string
const formatPrice = (cents: number) => (cents / 100).toFixed(2);

// 2. Generate static paths for your top products at build time
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from('products')
    .select('sku')
    .limit(100); // Pre-build top 100 pages

  return products?.map((p) => ({ sku: p.sku })) || [];
}

// 3. Dynamic SEO Metadata
export async function generateMetadata(props: { params: Promise<{ sku: string }> }): Promise<Metadata> {
  const params = await props.params; // UNWRAP THE PROMISE
  const sku = params.sku;

  const { data: product } = await supabase
    .from('products')
    .select('title, description')
    .eq('sku', sku)
    .single();

  return {
    title: `${product?.title || 'Product'} - Review`,
    description: product?.description?.substring(0, 160),
  };
}

export default async function ProductReviewPage(props: { params: Promise<{ sku: string }> }) {
  const params = await props.params; // UNWRAP THE PROMISE
  const sku = params.sku;

  const { data: product, error } = await supabase
    .from('products')
    .select(`*, merchants (name)`)
    .eq('sku', sku)
    .single();

  if (error || !product) notFound();

  // Convert cents to decimals for display and schema
  const displayPrice = formatPrice(product.price);
  const displaySalePrice = product.sale_price ? formatPrice(product.sale_price) : null;
  const finalPrice = displaySalePrice || displayPrice;

  // 4. Create the JSON-LD Schema for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: product.image_link,
    description: product.description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      price: finalPrice,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      url: `https://my-domain.com/products/${product.sku}`,
      seller: { '@type': 'Organization', name: product.merchants?.name }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.star_review,
      reviewCount: product.number_of_reviews
    }
  };

  return (
    <article className="max-w-4xl mx-auto p-6">
      {/* Add JSON-LD to the page head for Google's bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p className="text-gray-500">Reviewed for {product.merchants?.name}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        <img src={product.image_link} alt={product.title} className="rounded-lg border" />
        
        <div className="space-y-4">
          <div className="text-2xl font-semibold flex gap-3 items-baseline">
            {displaySalePrice ? (
              <>
                <span className="text-red-600">{product.currency} {displaySalePrice}</span>
                <span className="text-gray-400 line-through text-lg">{product.currency} {displayPrice}</span>
              </>
            ) : (
              <span>{product.currency} {displayPrice}</span>
            )}
          </div>
          
          {/* THE AFFILIATE LINK BUTTON */}
          <a 
            href={product.link} 
            rel="nofollow sponsored" 
            className="block text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-bold hover:bg-blue-700"
          >
            Check Price at {product.merchants?.name}
          </a>

          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-bold">Expert Score: {product.value}/100</h3>
            <p className="text-sm">Based on {product.number_of_reviews} user reviews.</p>
          </div>
        </div>
      </div>

      <div className="prose lg:prose-xl">
        <h2>Our Honest Review</h2>
        <p>{product.description}</p>
      </div>
    </article>
  );
}