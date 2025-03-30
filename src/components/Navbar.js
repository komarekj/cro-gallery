"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          {/* Logo and site name */}
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-blue-600 text-2xl">📈</span>
            <span className="font-semibold text-xl">CRO Gallery</span>
          </Link>
        </div>
      </div>
    </nav>
  );
} 