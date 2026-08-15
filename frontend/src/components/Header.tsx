'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount] = useState(0);

  return (
    <header className="bg-white shadow-sm dark:bg-gray-900">
      <nav className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            TodoGastro
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/catalog" className="text-gray-700 hover:text-blue-600 dark:text-gray-300">
              Catálogo
            </Link>
            <input
              type="search"
              placeholder="Buscar productos..."
              className="px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart" className="relative flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            <Link href="/auth/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Ingresar
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 space-y-2">
            <Link href="/catalog" className="block py-2 text-gray-700 dark:text-gray-300">
              Catálogo
            </Link>
            <input
              type="search"
              placeholder="Buscar productos..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
        )}
      </nav>
    </header>
  );
}
