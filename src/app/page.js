"use client";

import { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sites, setSites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalStores: 0,
  });
  const itemsPerPage = 12;
  
  // Fetch categories separately
  useEffect(() => {
    async function fetchCategories() {
      try {
        const categoriesUrl = new URL('/api/categories', window.location.origin);
        const response = await fetch(categoriesUrl);
        const data = await response.json();
        
        if (data.success) {
          // Extract category names and counts
          const categoryNames = data.categories.map(category => category.name);
          const counts = {};
          
          data.categories.forEach(category => {
            counts[category.name] = category.count;
          });
          
          setCategories(categoryNames);
          setCategoryCounts(counts);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    
    fetchCategories();
  }, []);
  
  // Fetch sites based on selected category and page
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Construct API URL with pagination and category parameters
        const url = new URL('/api/stores', window.location.origin);
        url.searchParams.append('page', currentPage);
        if (selectedCategory !== "All") {
          url.searchParams.append('category', selectedCategory);
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('Pagination data:', data.pagination);
        console.log('Current page:', currentPage);
        console.log('Number of stores:', data.stores.length);
        
        setSites(data.stores);
        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [currentPage, selectedCategory]);
  
  useEffect(() => {
    // Reset to first page when category changes
    setCurrentPage(1);
  }, [selectedCategory]);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">E-commerce CRO Gallery</h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
          A collection of e-commerce stores analyzed by synthetic buyer personas.
        </p>
      </header>

      <div className="mb-12">
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {category} {categoryCounts[category] !== undefined && (
                <span className="ml-1 text-xs opacity-80">({categoryCounts[category]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sites.map((site) => (
              <Link href={`/site/${site._id}`} key={site._id} className="group">
                <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
                  <div className="relative h-60 w-full">
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400">{site.title || site.domain}</span>
                    </div>
                    {site._id && (
                      <Image
                        src={`/images/sites/${site._id}.png`}
                        alt={site.title || site.domain}
                        fill
                        className="object-cover"
                        // objectPosition="left top"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{site.title || site.domain}</h2>
                      {site.category && (
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                          {site.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{site.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-1">
                {/* Previous button */}
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  &laquo;
                </button>
                
                {/* Page numbers */}
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === i + 1
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                {/* Next button */}
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === pagination.totalPages 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  &raquo;
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && sites.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">No sites found in this category</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Try selecting a different category</p>
        </div>
      )}
    </main>
  );
}
