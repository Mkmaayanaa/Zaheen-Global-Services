/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Menu, X, Gem, UserCheck } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  currentView: 'home' | 'catalog' | 'about' | 'admin' | 'detail';
  setView: (view: 'home' | 'catalog' | 'about' | 'admin' | 'detail') => void;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export function Navbar({ currentView, setView, isAdminLoggedIn, onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'catalog', label: 'Catalog' },
    { id: 'about', label: 'About Us' },
    { id: 'admin', label: 'Admin Portal' }
  ] as const;

  const handleNavClick = (view: 'home' | 'catalog' | 'about' | 'admin') => {
    setView(view);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-black/20 border-b border-white/5 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md group-hover:border-gold-300 transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Gem className="w-5 h-5 text-gold-300 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <span className="font-serif text-lg tracking-wider text-gold-100 group-hover:text-gold-200 transition-colors block">
                ZAHEEN
              </span>
              <span className="text-[10px] tracking-[0.25em] text-gold-400 font-mono block uppercase">
                Global Services
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'admin' && currentView === 'admin');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative font-serif tracking-wide text-sm transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'text-gold-300 font-medium' 
                      : 'text-gray-400 hover:text-gold-200'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-gold-300 shadow-[0_0_8px_rgba(220,175,59,0.8)] rounded-full" />
                  )}
                </button>
              );
            })}

            {isAdminLoggedIn && (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                <span className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-950/40 border border-green-800 px-2 py-1 rounded">
                  <UserCheck className="w-3.5 h-3.5" />
                  Admin
                </span>
                <button
                  onClick={onLogout}
                  className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer hover:underline"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {isAdminLoggedIn && (
              <span className="text-[10px] font-mono text-green-400 bg-green-950/40 border border-green-800 px-1.5 py-0.5 rounded">
                Admin
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-gold-300 hover:bg-gold-900/10 border border-transparent hover:border-gold-300/20 transition-all cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-md border-b border-white/10">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const isActive = currentView === item.id || (item.id === 'admin' && currentView === 'admin');
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-serif text-base tracking-wide transition-all ${
                    isActive 
                      ? 'bg-white/5 border-l-4 border-gold-300 text-gold-300 font-medium' 
                      : 'text-gray-300 hover:bg-white/5 hover:text-gold-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            {isAdminLoggedIn && (
              <div className="pt-4 pb-2 px-4 border-t border-gray-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-950/40 border border-green-800 px-2 py-1 rounded">
                  <UserCheck className="w-3.5 h-3.5" />
                  Logged in as Admin
                </span>
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="text-xs font-mono text-red-400 hover:text-red-300 cursor-pointer bg-red-950/20 border border-red-900/30 px-2 py-1 rounded"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
