'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Users, Heart, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DWB</span>
            </div>
            <span className="text-xl font-bold">DWB Games</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className="flex-1 max-w-lg mx-8 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              className="search-bar w-full pl-10 pr-4"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-muted-foreground" size={20} />
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>4000+ games</span>
            <span>No install needed</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Users size={24} />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Heart size={24} />
            </button>
            <button className="pixel-button flex items-center gap-2">
              <LogIn size={20} />
              <span>Log in</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search games..."
            className="search-bar w-full pl-10 pr-4"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-muted-foreground" size={20} />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-4 space-y-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>4000+ games</span>
              <span>No install needed</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Users size={24} />
              </button>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <Heart size={24} />
              </button>
              <button className="pixel-button flex items-center gap-2">
                <LogIn size={20} />
                <span>Log in</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

