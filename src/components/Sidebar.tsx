'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarContext';
import { useState } from 'react';

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
  Tags,
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
  


  return (
    <aside
      className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}
      style={{ 
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100%',
        width: isCollapsed && !isHovered ? '64px' : '240px',
        backgroundColor: 'hsl(var(--card))',
        borderRight: '1px solid hsl(var(--border))',
        zIndex: isCollapsed && isHovered ? 60 : 50,
        overflow: isCollapsed && isHovered ? 'visible' : 'hidden',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isCollapsed && isHovered ? '8px 0 24px rgba(0, 0, 0, 0.15)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="sidebar-container"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 8px',
          width: isCollapsed && !isHovered ? '64px' : '240px',
          position: isCollapsed && isHovered ? 'absolute' : 'relative',
          left: isCollapsed && isHovered ? 0 : 'auto',
          top: isCollapsed && isHovered ? 0 : 'auto',
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          backgroundColor: isCollapsed && isHovered ? 'hsl(var(--card))' : 'transparent',
          borderRight: isCollapsed && isHovered ? '1px solid hsl(var(--border))' : 'none',
          borderRadius: isCollapsed && isHovered ? '0 8px 8px 0' : '0',
          zIndex: isCollapsed && isHovered ? 60 : 'auto'
        }}
      >
        {/* Logo */}
        <div 
          className="sidebar-logo"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
            position: 'relative',
            padding: '0 8px'
          }}
        >
          <div 
            className="logo-icon"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'hsl(var(--primary))',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <span style={{ color: 'hsl(var(--primary-foreground))', fontWeight: 'bold', fontSize: '0.875rem' }}>DWB</span>
          </div>
          {(!isCollapsed || isHovered) && (
            <div 
              className="logo-text"
              style={{
                fontSize: '1.125rem',
                fontWeight: 'bold',
                color: 'hsl(var(--foreground))',
                transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 1,
                visibility: 'visible'
              }}
            > GAMES
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="sidebar-toggle"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          style={{
            position: 'absolute',
            top: '16px',
            right: '8px',
            padding: '4px',
            borderRadius: '4px',
            zIndex: 10,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <svg
            className={`toggle-icon ${isCollapsed ? 'rotate180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            style={{
              width: '16px',
              height: '16px',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Navigation Links */}
                 <nav 
           className="sidebar-nav"
           style={{
             flex: 1,
             display: 'flex',
             flexDirection: 'column',
             gap: '4px',
             overflowY: (!isCollapsed || isHovered) ? 'auto' : 'hidden',
             overflowX: 'hidden',
             scrollbarWidth: 'thin',
             scrollbarColor: 'hsl(var(--muted)) transparent',
             paddingRight: '4px'
           }}
         >
          {sidebarItems.map((item, index) => {
            if (item.type === 'divider') {
              return (
                <hr 
                  key={index} 
                  className="sidebar-divider"
                  style={{
                    borderColor: 'hsl(var(--border))',
                    margin: '8px 16px'
                  }}
                />
              );
            }

            const Icon = item.icon;
            const isActive = pathname === item.href;
            const isDisabled = item.disabled;

            return (
              <Link
                key={index}
                href={isDisabled ? '#' : (item.href || '/')}
                className={`sidebar-link ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                {...(isDisabled && { onClick: (e) => e.preventDefault() })}
                title={isCollapsed ? item.label : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  backgroundColor: isActive ? 'hsl(var(--accent))' : 'transparent',
                  opacity: isDisabled ? 0.5 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isActive && !isDisabled) {
                    e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
                    e.currentTarget.style.color = 'hsl(var(--foreground))';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive && !isDisabled) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                  }
                }}
              >
                <div 
                  className="link-icon"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                    flexShrink: 0
                  }}
                >
                  {Icon && <Icon size={20} />}
                </div>
                {(!isCollapsed || isHovered) && (
                  <div 
                    className="link-label"
                    style={{ 
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'hsl(var(--foreground))',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      opacity: 1,
                      visibility: 'visible'
                    }}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
                     })}

           {/* Contact Button */}
           <div 
             className="sidebar-contact"
             style={{
               marginTop: '24px',
               padding: '0 16px'
             }}
           >
             <button 
               className="contact-button"
               style={{
                 width: '100%',
                 backgroundColor: 'hsl(var(--primary))',
                 color: 'hsl(var(--primary-foreground))',
                 border: 'none',
                 borderRadius: '4px',
                 fontWeight: 500,
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px',
                 padding: '8px 12px',
                 fontSize: '0.875rem',
                 cursor: 'pointer',
                 transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = 'hsl(var(--primary) / 0.9)';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'hsl(var(--primary))';
               }}
             >
               <Mail size={16} />
               {(!isCollapsed || isHovered) && (
                 <span style={{ opacity: 1, visibility: 'visible' }}>Contact us</span>
               )}
             </button>
           </div>

           {/* Language Selector */}
           <div 
             className="sidebar-language"
             style={{
               marginTop: '16px',
               padding: '0 16px'
             }}
           >
             <button 
               className="language-button"
               style={{
                 width: '100%',
                 display: 'flex',
                 alignItems: 'center',
                 justifyContent: 'space-between',
                 padding: '8px',
                 backgroundColor: 'hsl(var(--muted))',
                 borderRadius: '4px',
                 fontSize: '0.875rem',
                 border: 'none',
                 cursor: 'pointer',
                 transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
               }}
               onMouseEnter={(e) => {
                 e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
               }}
               onMouseLeave={(e) => {
                 e.currentTarget.style.backgroundColor = 'hsl(var(--muted))';
               }}
             >
               {(!isCollapsed || isHovered) && (
                 <span style={{ opacity: 1, visibility: 'visible' }}>English</span>
               )}
               <Globe size={16} />
             </button>
           </div>

           {/* Footer Links */}
           {(!isCollapsed || isHovered) && (
             <div 
               className="sidebar-footer-links"
               style={{
                 marginTop: '24px',
                 padding: '0 16px',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '8px',
                 opacity: 1,
                 visibility: 'visible'
               }}
             >
               {footerLinks.map((link, index) => (
                 <Link
                   key={index}
                   href={link.href}
                   target={link.external ? '_blank' : undefined}
                   rel={link.external ? 'noopener noreferrer' : undefined}
                   className="footer-link"
                   style={{
                     display: 'block',
                     fontSize: '0.75rem',
                     color: 'hsl(var(--muted-foreground))',
                     textDecoration: 'none',
                     transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.color = 'hsl(var(--foreground))';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.color = 'hsl(var(--muted-foreground))';
                   }}
                 >
                   {link.label}
                 </Link>
               ))}
             </div>
           )}

           {/* Social Links */}
           <div 
             className="sidebar-social-links"
             style={{
               marginTop: '16px',
               padding: '0 16px',
               display: 'flex',
               gap: '8px',
               flexWrap: 'wrap'
             }}
           >
             {socialLinks.map((social, index) => {
               const Icon = social.icon;
               return (
                 <Link
                   key={index}
                   href={social.href}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="social-link"
                   aria-label={social.label}
                   title={isCollapsed ? social.label : undefined}
                   style={{
                     padding: '8px',
                     backgroundColor: 'hsl(var(--muted))',
                     borderRadius: '4px',
                     textDecoration: 'none',
                     transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                   }}
                   onMouseEnter={(e) => {
                     e.currentTarget.style.backgroundColor = 'hsl(var(--accent))';
                   }}
                   onMouseLeave={(e) => {
                     e.currentTarget.style.backgroundColor = 'hsl(var(--muted))';
                   }}
                 >
                   <Icon size={16} />
                 </Link>
               );
             })}
           </div>

           {/* Copyright */}
           {(!isCollapsed || isHovered) && (
             <div 
               className="sidebar-copyright"
               style={{
                 marginTop: '16px',
                 padding: '0 16px',
                 fontSize: '0.75rem',
                 color: 'hsl(var(--muted-foreground))',
                 textAlign: 'center',
                 opacity: 1,
                 visibility: 'visible'
               }}
             >
               © 2025 DWB Games
             </div>
           )}
         </nav>
      </div>
    </aside>
  );
}
