"use client";

import { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { sites, categories } from "../data/sites";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredSites = selectedCategory === "All" 
    ? sites 
    : sites.filter(site => site.category === selectedCategory);

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4">E-commerce CRO Gallery</h1>
        <p className="text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
          A collection of successful e-commerce stores with proven conversion rate optimization strategies and analytics.
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
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredSites.map((site) => (
          <Link href={`/site/${site.slug}`} key={site.id} className="group">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="relative h-60 w-full">
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">{site.title}</span>
                </div>
                {/* Uncomment when you have actual images */}
                {/* <Image
                  src={site.imageUrl}
                  alt={site.title}
                  fill
                  className="object-cover"
                /> */}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{site.title}</h2>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                    {site.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{site.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredSites.length === 0 && (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-500 dark:text-gray-400">No sites found in this category</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">Try selecting a different category</p>
        </div>
      )}
    </main>
  );
}
