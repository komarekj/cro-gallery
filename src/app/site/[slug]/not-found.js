import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Site Not Found</h2>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        We couldn&apos;t find the CRO case study you&apos;re looking for.
      </p>
      <Link 
        href="/" 
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
      >
        Return to Gallery
      </Link>
    </div>
  );
} 