"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="dark:border-gray-800 text-center text-gray-500 dark:text-gray-400">
          <p>All screenshots &copy; of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
} 