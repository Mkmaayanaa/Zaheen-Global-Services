/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar.tsx';
import { HomeView } from './components/HomeView.tsx';
import { CatalogView } from './components/CatalogView.tsx';
import { DetailView } from './components/DetailView.tsx';
import { AboutView } from './components/AboutView.tsx';
import { AdminPortal } from './components/AdminPortal.tsx';
import { Gemstone } from './types.js';
import { Gem, Mail, Phone, MapPin, ExternalLink, HelpCircle } from 'lucide-react';

export default function App() {
  // Navigation Routing States
  const [currentView, setView] = useState<'home' | 'catalog' | 'about' | 'admin' | 'detail'>('home');
  const [selectedGemId, setSelectedGemId] = useState<string | null>(null);

  // Gemstones Inventory State
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('zaheen_admin_token');
  });

  // Fetch Gemstones on mount
  const fetchGemstones = async () => {
    setIsLoading(true);
    setFetchError('');
    try {
      const response = await fetch('/api/gemstones');
      if (response.ok) {
        const data = await response.json();
        setGemstones(data);
      } else {
        setFetchError('Failed to fetch the gemstone inventory. Sourcing list offline.');
      }
    } catch (err) {
      console.error('Error fetching gemstones:', err);
      setFetchError('Unable to connect to Rikkos servers. Operating in offline preview mode.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check Auth Token on mount/token change
  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!adminToken) {
        setIsAdminLoggedIn(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/status', {
          headers: { 'x-admin-token': adminToken }
        });
        if (response.ok) {
          const data = await response.json();
          setIsAdminLoggedIn(data.authenticated);
          if (!data.authenticated) {
            localStorage.removeItem('zaheen_admin_token');
            setAdminToken(null);
          }
        } else {
          setIsAdminLoggedIn(false);
        }
      } catch (err) {
        console.error('Auth verification error:', err);
        setIsAdminLoggedIn(false);
      }
    };

    checkAuthStatus();
  }, [adminToken]);

  useEffect(() => {
    fetchGemstones();
  }, []);

  // Handle successful Admin login
  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('zaheen_admin_token', token);
    setIsAdminLoggedIn(true);
    setView('admin'); // Instantly view dashboard
  };

  // Handle Admin logout
  const handleAdminLogout = async () => {
    if (adminToken) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'x-admin-token': adminToken }
        });
      } catch (err) {
        console.error('Logout request failed:', err);
      }
    }
    localStorage.removeItem('zaheen_admin_token');
    setAdminToken(null);
    setIsAdminLoggedIn(false);
    setView('home');
  };

  // Find active gemstone for detail view
  const activeGemstone = gemstones.find(g => g.id === selectedGemId);

  // Filter out Featured Gemstones
  const featuredGemstones = gemstones.filter(g => g.featured);

  // Trigger detailed selection navigation
  const handleSelectGemstone = (id: string) => {
    setSelectedGemId(id);
    setView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Return to catalog
  const handleBackToCatalog = () => {
    setSelectedGemId(null);
    setView('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#F5F2ED] flex flex-col font-sans select-text relative overflow-hidden">
      {/* Background radial overlays for Frosted Glass theme */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-900/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/30 blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[100px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-amber-900/20 blur-[80px]" />
      </div>
      
      {/* Dynamic Nav Header */}
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        isAdminLoggedIn={isAdminLoggedIn} 
        onLogout={handleAdminLogout} 
      />

      {/* Main Viewport Content Area with Transitions */}
      <main className="flex-grow relative z-10">
        {isLoading ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="relative flex items-center justify-center">
              <div className="w-16 h-16 border-2 border-dashed border-gold-300 rounded-full animate-spin" />
              <Gem className="w-6 h-6 text-gold-300 absolute" />
            </div>
            <span className="font-serif text-sm text-gold-300 tracking-wider">
              Decrypting Gemstone Vault in Rikkos...
            </span>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView + (selectedGemId || '')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[50vh]"
            >
              {currentView === 'home' && (
                <HomeView 
                  featuredGems={featuredGemstones} 
                  onSelectGem={handleSelectGemstone} 
                  setView={setView} 
                />
              )}

              {currentView === 'catalog' && (
                <CatalogView 
                  gemstones={gemstones} 
                  onSelectGem={handleSelectGemstone} 
                />
              )}

              {currentView === 'detail' && activeGemstone && (
                <DetailView 
                  gemstone={activeGemstone} 
                  onBack={handleBackToCatalog} 
                />
              )}

              {currentView === 'detail' && !activeGemstone && (
                <div className="py-24 text-center">
                  <HelpCircle className="w-16 h-16 text-gold-300/30 mx-auto mb-4" />
                  <h3 className="font-serif text-xl text-white mb-2">Gemstone Spec Missing</h3>
                  <button onClick={handleBackToCatalog} className="px-6 py-2 bg-gold-400 text-black text-sm font-serif rounded">
                    Return to Catalog
                  </button>
                </div>
              )}

              {currentView === 'about' && <AboutView />}

              {currentView === 'admin' && (
                <AdminPortal 
                  gemstones={gemstones} 
                  isAdminLoggedIn={isAdminLoggedIn} 
                  adminToken={adminToken} 
                  onLogin={handleAdminLogin} 
                  onLogout={handleAdminLogout} 
                  onRefreshData={fetchGemstones} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Elegant Symmetrical Luxury Footer */}
      <footer className="bg-black/30 border-t border-white/5 backdrop-blur-md relative z-10 py-12 text-gray-500 text-xs text-center md:text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-gold-300/5 pb-8 mb-8">
            
            {/* Logo / Tag */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Gem className="w-5 h-5 text-gold-400" />
                <span className="font-serif text-gold-100 tracking-wider text-base">ZAHEEN GLOBAL SERVICES</span>
              </div>
              <p className="font-light text-gray-500 max-w-sm leading-relaxed">
                Custom cut masterpieces, absolute origin integrity, and worldwide armored logistics. Sourced behind Skysun in the valleys of Rikkos.
              </p>
            </div>

            {/* Directives Links */}
            <div className="md:col-span-3 flex flex-col gap-2 font-serif text-sm items-center md:items-start text-gray-400">
              <button onClick={() => { setView('home'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-gold-300 transition-colors cursor-pointer">Main Registry</button>
              <button onClick={() => { setView('catalog'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-gold-300 transition-colors cursor-pointer">Gemstone Catalog</button>
              <button onClick={() => { setView('about'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-gold-300 transition-colors cursor-pointer">Heritage Sourcing</button>
            </div>

            {/* Location contact brief */}
            <div className="md:col-span-4 space-y-3 font-mono text-[11px] text-gray-500">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <MapPin className="w-4 h-4 text-gold-500/60" />
                <span>Rikkos, behind Skysun Commercial District, Jos Pleatue State Nigeria.</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Phone className="w-4 h-4 text-gold-500/60" />
                <span>+234 8036301091</span>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-4 h-4 text-gold-500/60" />
                <span>zaheenaminu@gmail.com</span>
              </div>
            </div>

          </div>

          {/* Symmetrical footer copyright */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-gray-600 gap-4">
            <div className="font-mono text-[10px] tracking-wide uppercase">
              &copy; 2026 Zaheen Global Services. All Rights Reserved.
            </div>
            <div className="flex gap-4 justify-center">
              <span className="font-serif">Licensed Lapidary House #9943</span>
              <span>&bull;</span>
              <button onClick={() => { setView('admin'); window.scrollTo({top:0, behavior:'smooth'}); }} className="hover:text-gold-300 hover:underline">Secure Staff Portal</button>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
