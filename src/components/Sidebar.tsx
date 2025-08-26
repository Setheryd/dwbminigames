'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useState } from 'react';
import styles from './Sidebar.module.css';
import { 
  Home, 
  Clock, 
  Star, 
  TrendingUp, 
  RefreshCw, 
  Crown, 
  Users, 
  Gamepad2,
  Target,
  Car,
  Puzzle,
  Zap,
  Shield,
  Heart,
  Trophy,
  Settings,
  Mail,
  Globe,
  Github,
  Twitter,
  Youtube,
  User,
  Gamepad,
  Bike,
  MousePointer,
  Shirt,
  Crosshair,
  Ghost,
  Network,
  Blocks,
  Dumbbell,
  UserCheck,
  Brain,
  Castle,
  Tags
} from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Home', href: '/', active: true },
  { icon: Clock, label: 'Recently played', href: '/recent', disabled: true },
  { icon: Star, label: 'New', href: '/new' },
  { icon: TrendingUp, label: 'Popular Games', href: '/popular' },
  { icon: RefreshCw, label: 'Updated', href: '/updated' },
  { icon: Crown, label: 'Originals', href: '/originals' },
  { icon: Users, label: 'Multiplayer', href: '/multiplayer' },
  { type: 'divider' },
  { icon: User, label: '2 Player', href: '/2-player' },
  { icon: Zap, label: 'Action', href: '/action' },
  { icon: Target, label: 'Adventure', href: '/adventure' },
  { icon: Target, label: 'Basketball', href: '/basketball' },
  { icon: Heart, label: 'Beauty', href: '/beauty' },
  { icon: Bike, label: 'Bike', href: '/bike' },
  { icon: Car, label: 'Car', href: '/car' },
  { icon: Shield, label: 'Card', href: '/card' },
  { icon: Shield, label: 'Casual', href: '/casual' },
  { icon: MousePointer, label: 'Clicker', href: '/clicker' },
  { icon: Gamepad, label: 'Controller', href: '/controller' },
  { icon: Shirt, label: 'Dress Up', href: '/dress-up' },
  { icon: Car, label: 'Driving', href: '/driving' },
  { icon: Target, label: 'Escape', href: '/escape' },
  { icon: Zap, label: 'Flash', href: '/flash' },
  { icon: Crosshair, label: 'FPS', href: '/fps' },
  { icon: Ghost, label: 'Horror', href: '/horror' },
  { icon: Network, label: '.io', href: '/io' },
  { icon: Blocks, label: 'Mahjong', href: '/mahjong' },
  { icon: Gamepad2, label: 'Minecraft', href: '/minecraft' },
  { icon: Target, label: 'Pool', href: '/pool' },
  { icon: Puzzle, label: 'Puzzle', href: '/puzzle' },
  { icon: Crosshair, label: 'Shooting', href: '/shooting' },
  { icon: Target, label: 'Soccer', href: '/soccer' },
  { icon: Dumbbell, label: 'Sports', href: '/sports' },
  { icon: UserCheck, label: 'Stickman', href: '/stickman' },
  { icon: Brain, label: 'Thinky', href: '/thinky' },
  { icon: Castle, label: 'Tower Defense', href: '/tower-defense' },
  { type: 'divider' },
  { icon: Tags, label: 'Tags', href: '/tags' },
];

const footerLinks = [
  { label: 'About', href: 'https://about.dwb.com', external: true },
  { label: 'Developers', href: 'https://developer.dwb.com', external: true },
  { label: 'Kids site', href: 'https://kids.dwb.com', external: true },
  { label: 'Jobs', href: 'https://jobs.dwb.com', external: true },
  { label: 'Info for parents', href: '/parents' },
  { label: 'Terms & conditions', href: '/terms' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'All games', href: '/games' },
];

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com/dwb', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/dwb', label: 'YouTube' },
  { icon: Github, href: 'https://github.com/dwb', label: 'GitHub' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isHovered, setIsHovered] = useState(false);
  
  // Show expanded state when hovering over collapsed sidebar
  const shouldShowExpanded = isCollapsed && isHovered;

  return (
    <aside 
      className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.sidebarContainer}>
        {/* Logo */}
        <div className={styles.sidebarLogo}>
          <div className={styles.logoIcon}>
            <span>DWB</span>
          </div>
          {(!isCollapsed || shouldShowExpanded) && (
            <div className={styles.logoText}>DWB Games</div>
          )}
        </div>
        
        {/* Collapse Toggle Button */}
        <button 
          onClick={toggleSidebar}
          className={styles.sidebarToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            className={`${styles.toggleIcon} ${isCollapsed ? styles.rotate180 : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation Links */}
        <nav className={styles.sidebarNav}>
          {sidebarItems.map((item, index) => {
            if (item.type === 'divider') {
              return <hr key={index} className={styles.sidebarDivider} />;
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isDisabled = item.disabled;

            return (
              <Link
                key={index}
                href={isDisabled ? '#' : item.href}
                className={`${styles.sidebarLink} ${isActive ? styles.active : ''} ${isDisabled ? styles.disabled : ''}`}
                onClick={isDisabled ? (e) => e.preventDefault() : undefined}
                title={isCollapsed && !shouldShowExpanded ? item.label : undefined}
              >
                <div className={styles.linkIcon}>
                  {Icon && <Icon size={20} />}
                </div>
                {(!isCollapsed || shouldShowExpanded) && (
                  <div className={styles.linkLabel}>{item.label}</div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Contact Button */}
        <div className={styles.sidebarContact}>
          <button className={styles.contactButton}>
            <Mail size={16} />
            {(!isCollapsed || shouldShowExpanded) && <span>Contact us</span>}
          </button>
        </div>

        {/* Language Selector */}
        <div className={styles.sidebarLanguage}>
          <button className={styles.languageButton}>
            {(!isCollapsed || shouldShowExpanded) && <span>English</span>}
            <Globe size={16} />
          </button>
        </div>

        {/* Footer Links */}
        {(!isCollapsed || shouldShowExpanded) && (
          <div className={styles.sidebarFooterLinks}>
            {footerLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={styles.footerLink}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className={styles.sidebarSocialLinks}>
          {socialLinks.map((social, index) => {
            const Icon = social.icon;
            return (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
                title={isCollapsed && !shouldShowExpanded ? social.label : undefined}
              >
                <Icon size={16} />
              </Link>
            );
          })}
        </div>

        {/* Copyright */}
        {(!isCollapsed || shouldShowExpanded) && (
          <div className={styles.sidebarCopyright}>
            © 2025 DWB Games
          </div>
        )}
      </div>
    </aside>
  );
}
