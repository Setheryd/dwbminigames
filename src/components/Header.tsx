'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Search, Users, Heart, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';
import styles from './Header.module.css';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink}>
            <div className={styles.logoIcon}>
              <span>DWB</span>
            </div>
            <span className={styles.logoText}>DWB Games</span>
          </Link>
        </div>

        {/* Search Bar - Desktop */}
        <div className={styles.searchContainer}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              className={styles.searchBar}
            />
            <div className={styles.searchIcon}>
              <Search size={20} />
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className={styles.actions}>
          <button className={styles.actionButton}>
            <Users size={20} />
          </button>
          <button className={styles.actionButton}>
            <Heart size={20} />
          </button>
          <button className={styles.loginButton}>
            <LogIn size={16} />
            <span>Log in</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Search Bar */}
      {isMobileMenuOpen && (
        <div className={styles.mobileSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              className={styles.searchBar}
            />
            <div className={styles.searchIcon}>
              <Search size={20} />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileMenuContent}>
            <div className={styles.mobileActions}>
              <button className={styles.actionButton}>
                <Users size={20} />
              </button>
              <button className={styles.actionButton}>
                <Heart size={20} />
              </button>
              <button className={styles.loginButton}>
                <LogIn size={16} />
                <span>Log in</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

