/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Gem, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { Gemstone, GemCategory, GemStatus } from '../types.js';

interface CatalogViewProps {
  gemstones: Gemstone[];
  onSelectGem: (gemId: string) => void;
}

export function CatalogView({ gemstones, onSelectGem }: CatalogViewProps) {
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GemCategory | 'All'>('All');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 100000 });
  const [showSold, setShowSold] = useState(false); // Default: Sold items hidden
  const [sortBy, setSortBy] = useState<'order' | 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc' | 'newest'>('order');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Derive actual maximum price in existing list to populate filter limits dynamically
  const maxPriceInDb = useMemo(() => {
    if (gemstones.length === 0) return 50000;
    return Math.max(...gemstones.map(g => g.price), 10000);
  }, [gemstones]);

  // Handle active filter resets
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setPriceRange({ min: 0, max: maxPriceInDb });
    setShowSold(false);
    setSortBy('order');
  };

  // Categories list for filter buttons
  const categories: (GemCategory | 'All')[] = ['All', 'Emerald', 'Ruby', 'Sapphire', 'Amethyst', 'Topaz', 'Tourmaline', 'Other'];

  // Filter and sort the gemstones
  const filteredAndSortedGemstones = useMemo(() => {
    let result = [...gemstones];

    // 1. Search Query filter (matches name, category, description)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(q) || 
        g.category.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(g => g.category === selectedCategory);
    }

    // 3. Price filter
    result = result.filter(g => g.price >= priceRange.min && g.price <= priceRange.max);

    // 4. Availability filter (If showSold is false, only show Available or Reserved)
    if (!showSold) {
      result = result.filter(g => g.status !== 'Sold');
    }

    // 5. Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'weight-asc':
          return a.weight - b.weight;
        case 'weight-desc':
          return b.weight - a.weight;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'order':
        default:
          if (a.displayOrder !== b.displayOrder) {
            return a.displayOrder - b.displayOrder;
          }
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [gemstones, searchQuery, selectedCategory, priceRange, showSold, sortBy]);

  return (
    <div className="bg-transparent text-[#F5F2ED] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center md:text-left mb-10">
          <span className="text-xs font-mono tracking-widest text-gold-300 uppercase block mb-1">
            Exclusive Selection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
            Our Gemstone Catalog
          </h1>
          <p className="text-gray-400 font-light text-sm mt-1 max-w-2xl">
            Filter our active collection of premium gems sourced from around the globe and cut to ultimate brilliance in Rikkos.
          </p>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTER TOGGLES, SORT */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-4 mb-8 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by gem name, category..."
                className="w-full bg-black/20 border border-white/10 focus:border-gold-300 rounded-xl py-3 pl-11 pr-4 text-sm text-gray-200 outline-none transition-all placeholder:text-gray-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter buttons & sort combo */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              
              {/* Sold Stones Toggle */}
              <button
                onClick={() => setShowSold(!showSold)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  showSold
                    ? 'bg-gold-950/40 border-gold-300/40 text-gold-300'
                    : 'bg-transparent border-gold-300/10 text-gray-400 hover:text-gray-200'
                }`}
              >
                {showSold ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                {showSold ? 'Showing Sold' : 'Hide Sold'}
              </button>

              {/* Show Filters Controls Button */}
              <button
                onClick={() => setShowFiltersMobile(!showFiltersMobile)}
                className={`lg:flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono tracking-wider transition-all cursor-pointer ${
                  showFiltersMobile
                    ? 'bg-gold-300 text-black border-gold-300'
                    : 'bg-transparent border-gold-300/10 text-gray-400 hover:text-gray-200'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>

              {/* Sort Selection */}
              <div className="relative flex items-center bg-black/20 border border-white/10 rounded-xl px-3 py-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-gold-300 mr-2" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-mono tracking-wider text-gray-300 outline-none cursor-pointer pr-1"
                >
                  <option value="order">Catalog Order</option>
                  <option value="weight-asc">Weight: Low to High</option>
                  <option value="weight-desc">Weight: High to Low</option>
                  <option value="newest">Newest Sourced</option>
                </select>
              </div>

            </div>

          </div>

          {/* EXPANDABLE FILTER DRAWER */}
          <AnimatePresence>
            {showFiltersMobile && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-gold-300/10 mt-4 pt-4"
              >
                <div className="flex flex-col md:flex-row gap-6 items-end justify-between">
                  
                  {/* Category Buttons Filter */}
                  <div className="flex-grow space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 block mb-1">
                      Gemstone Categories
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-2 rounded-lg text-xs font-serif transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-gold-400 text-[#070a13] font-medium shadow-[0_0_10px_rgba(255,255,255,0.15)]'
                              : 'bg-black/20 border border-white/10 text-gray-400 hover:text-gold-200 hover:border-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Actions */}
                  <div className="pt-2 shrink-0">
                    <button
                      onClick={handleResetFilters}
                      className="px-4 py-2 border border-gold-300/20 rounded-lg text-xs font-mono text-gold-400 hover:bg-gold-400 hover:text-black transition-all cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ACTIVE FILTERS SUMMARY BAR */}
        {(selectedCategory !== 'All' || searchQuery !== '' || showSold) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-gray-400">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gold-400 mr-2">Active filters:</span>
            {selectedCategory !== 'All' && (
              <span className="bg-gold-950/40 border border-gold-300/20 text-gold-300 px-2 py-0.5 rounded flex items-center gap-1">
                Category: {selectedCategory}
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSelectedCategory('All')} />
              </span>
            )}
            {searchQuery !== '' && (
              <span className="bg-gold-950/40 border border-gold-300/20 text-gold-300 px-2 py-0.5 rounded flex items-center gap-1">
                Search: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {showSold && (
              <span className="bg-gold-950/40 border border-gold-300/20 text-gold-300 px-2 py-0.5 rounded flex items-center gap-1">
                Showing Sold Gems
                <X className="w-3 h-3 cursor-pointer hover:text-white" onClick={() => setShowSold(false)} />
              </span>
            )}
            <button
              onClick={handleResetFilters}
              className="text-gold-300 hover:text-gold-200 underline font-mono text-[10px] ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* GEMSTONES CATALOG GRID */}
        {filteredAndSortedGemstones.length === 0 ? (
          <div className="text-center py-24 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl">
            <Gem className="w-12 h-12 text-gold-300/30 mx-auto mb-4 animate-bounce" />
            <p className="text-gray-400 font-serif text-lg mb-2">No Match Found</p>
            <p className="text-gray-500 font-light text-sm max-w-md mx-auto px-4">
              Try adjusting your category or searching with another keyword.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-400 text-black font-serif text-sm rounded-lg hover:from-gold-400 cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredAndSortedGemstones.map((gem) => {
                const isSold = gem.status === 'Sold';
                const isReserved = gem.status === 'Reserved';

                // Determine a fallback jewel colored badge
                const categoryColorMap: Record<string, string> = {
                  Emerald: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40',
                  Ruby: 'bg-red-950/80 text-red-300 border-red-800/40',
                  Sapphire: 'bg-blue-950/80 text-blue-300 border-blue-800/40',
                  Amethyst: 'bg-purple-950/80 text-purple-300 border-purple-800/40',
                  Topaz: 'bg-amber-950/80 text-amber-300 border-amber-800/40',
                  Tourmaline: 'bg-pink-950/80 text-pink-300 border-pink-800/40',
                };
                const badgeStyle = categoryColorMap[gem.category] || 'bg-gray-800 text-gray-300 border-gray-700';

                return (
                  <motion.div
                    key={gem.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    onClick={() => onSelectGem(gem.id)}
                    className={`group bg-white/5 border backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 hover:shadow-2xl flex flex-col h-full transition-all duration-500 ${
                      isSold 
                        ? 'opacity-60 border-white/5 grayscale hover:grayscale-0 hover:opacity-90' 
                        : 'border-white/10 hover:border-white/25 hover:-translate-y-1.5'
                    }`}
                  >
                    {/* Gem Image */}
                    <div className="relative aspect-[4/3] bg-black/40 overflow-hidden">
                      <img
                        src={gem.images[0] || 'https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=800'}
                        alt={gem.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Ambient Overlays */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      {/* Category Badge */}
                      <span className={`absolute top-4 left-4 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                        {gem.category}
                      </span>

                      {/* Status Badges */}
                      {isSold && (
                        <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border bg-gray-900 border-red-500 text-red-400 font-semibold shadow-lg">
                          Sold
                        </span>
                      )}
                      {isReserved && (
                        <span className="absolute top-4 right-4 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border bg-yellow-950/80 border-yellow-800 text-yellow-300 font-semibold shadow-lg">
                          Reserved
                        </span>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-serif text-lg text-white font-medium group-hover:text-gold-200 transition-colors mb-2 line-clamp-1">
                        {gem.name}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-xs font-mono text-gray-400 mb-4">
                        <span>{gem.weight.toFixed(2)} Carats</span>
                      </div>

                      <div 
                        className="text-gray-400 text-xs font-light line-clamp-2 mb-6 flex-grow"
                        dangerouslySetInnerHTML={{ __html: gem.description }}
                      />

                      <div className="flex items-center justify-between pt-4 border-t border-gold-300/5 text-xs text-gold-300 font-serif font-medium group-hover:text-gold-200 transition-colors">
                        <span>{isSold ? 'View Sourced Detail' : 'View Details & Inquiry'}</span>
                        <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

      </div>
    </div>
  );
}
