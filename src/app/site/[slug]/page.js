import Store from "@/models/Store";
import connectToDatabase from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  await connectToDatabase();
  const stores = await Store.find({}, 'slug');
  
  return stores.map((store) => ({
    slug: store.slug,
  }));
}

export async function generateMetadata({ params }) {
  await connectToDatabase();
  const store = await Store.findOne({ slug: params.slug });
  
  if (!store) {
    return {
      title: "Site Not Found",
      description: "The requested site could not be found",
    };
  }
  
  return {
    title: `${store.title} | CRO Case Study`,
    description: store.description,
  };
}

export default async function SitePage({ params }) {
  await connectToDatabase();
  const store = await Store.findOne({ slug: params.slug });
  
  if (!store) {
    notFound();
  }
  
  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Gallery
      </Link>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-xl">
        <div className="relative h-80 w-full">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-2xl text-gray-500 dark:text-gray-400">{store.title}</span>
          </div>
          {store.imageUrl && (
            <Image
              src={store.imageUrl}
              alt={store.title}
              fill
              className="object-cover"
            />
          )}
        </div>
        
        <div className="p-8">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
            <h1 className="text-3xl font-bold">{store.title}</h1>
            {store.category && (
              <span className="text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full">
                {store.category}
              </span>
            )}
          </div>
          
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">{store.description}</p>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 mt-8">
            <h2 className="text-2xl font-bold mb-6">CRO Case Study</h2>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {store.analysis && store.analysis.content ? (
                <div dangerouslySetInnerHTML={{ __html: store.analysis.content }} />
              ) : (
                <>
                  <p>
                    This is a placeholder for the detailed case study content. In a real application, this would contain 
                    in-depth information about the conversion rate optimization strategies implemented, 
                    the problems that were solved, methodologies used, and the results achieved.
                  </p>
                  
                  <h3 className="mt-6">Key Metrics</h3>
                  <ul>
                    <li>Conversion Rate: Improved by X%</li>
                    <li>Average Order Value: Increased by $X</li>
                    <li>Customer Retention: Improved by X%</li>
                  </ul>
                  
                  <h3 className="mt-6">Implementation Strategy</h3>
                  <p>
                    Placeholder for detailed implementation strategy information. This would include
                    the specific changes made to the website, the testing methodology, and how the
                    final solutions were developed and deployed.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 