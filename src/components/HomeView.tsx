/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MapPin, Award, ShieldCheck, HelpCircle } from 'lucide-react';
import { Gemstone } from '../types.js';
import { MorphingGem } from './FacetedGem.tsx';

interface HomeViewProps {
  featuredGems: Gemstone[];
  onSelectGem: (gemId: string) => void;
  setView: (view: 'home' | 'catalog' | 'about' | 'admin' | 'detail') => void;
}

export function HomeView({ featuredGems, onSelectGem, setView }: HomeViewProps) {
  // Setup nice container variants for staggering entry animations
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-transparent text-[#F5F2ED]">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-32 border-b border-white/5">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-950/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-950/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Title and Tagline */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-3 py-1 bg-gold-950/50 border border-gold-300/20 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-gold-300 animate-pulse" />
                <span className="text-xs font-mono tracking-widest text-gold-200 uppercase">
                  Exquisite Rare Gemstones
                </span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight"
              >
                Zaheen <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 gold-glow">
                  Global Services
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed"
              >
                Sourcing raw grandeur, cutting precision, and delivering unmatched brilliance. 
                Based in the mysterious realms of <span className="text-gold-300 font-medium">Rikkos</span>, directly behind Skysun. 
                We bring you nature’s ultimate masterpieces with certificates of pristine heritage. And the company deals with both local and international deals. It can be delivered to you any part of the world.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
              >
                <button
                  onClick={() => setView('catalog')}
                  className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-[#070a13] font-serif font-medium tracking-wide rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(220,175,59,0.3)] hover:shadow-[0_4px_25px_rgba(220,175,59,0.5)] transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  Explore Catalog
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('about')}
                  className="px-8 py-4 bg-transparent hover:bg-gold-950/10 border border-gold-300/30 hover:border-gold-300 text-gold-200 hover:text-white font-serif font-medium tracking-wide rounded-lg transition-all duration-300 cursor-pointer"
                >
                  Our Heritage
                </button>
              </motion.div>
            </div>

            {/* Right Column: Morphing Gem Loop */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: 'spring' }}
                className="relative p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl"
              >
                {/* Visual Accent Corner Highlights */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-300/30 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-300/30 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-300/30 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-300/30 rounded-br-xl" />
                
                <MorphingGem size={220} />
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="py-16 bg-transparent border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all shadow-xl group">
              <div className="w-12 h-12 bg-gold-950/50 border border-gold-300/20 rounded-xl flex items-center justify-center mb-4 text-gold-300 group-hover:text-gold-200 transition-all shadow-[0_0_10px_rgba(220,175,59,0.1)]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium mb-2">Exquisite Cutting Quality</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Every gem is precision-cut by master lapidaries under magnifying parameters to extract max brilliance, fires, and crystal clarity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all shadow-xl group">
              <div className="w-12 h-12 bg-gold-950/50 border border-gold-300/20 rounded-xl flex items-center justify-center mb-4 text-gold-300 group-hover:text-gold-200 transition-all shadow-[0_0_10px_rgba(220,175,59,0.1)]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium mb-2">Pristine Certificates</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                We provide certified documentation detailing geological origin, exact carat measurements, treatment levels, and flawless grading.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all shadow-xl group">
              <div className="w-12 h-12 bg-gold-950/50 border border-gold-300/20 rounded-xl flex items-center justify-center mb-4 text-gold-300 group-hover:text-gold-200 transition-all shadow-[0_0_10px_rgba(220,175,59,0.1)]">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium mb-2">Rikkos Exclusive</h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                Operating directly behind Skysun in Rikkos. We serve international dealers, private collectors, and prestigious jewel houses.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. FEATURED STONES */}
      <section className="py-20 md:py-28 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 text-center md:text-left gap-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-gold-300 uppercase block mb-2">
                Hand-Selected Masterpieces
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
                Featured Gemstones
              </h2>
            </div>
            <button
              onClick={() => setView('catalog')}
              className="text-gold-300 hover:text-gold-200 font-serif tracking-wide text-sm flex items-center justify-center gap-1 group/btn cursor-pointer transition-colors"
            >
              View Full Collection
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {featuredGems.length === 0 ? (
            <div className="text-center py-16 bg-[#0d1324] rounded-2xl border border-gold-300/10">
              <HelpCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No featured gemstones are currently available.</p>
              <button
                onClick={() => setView('catalog')}
                className="mt-4 px-6 py-2 bg-gold-500 text-black rounded font-serif text-sm hover:bg-gold-400"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-100px' }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {featuredGems.map((gem) => {
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
                    variants={itemFadeIn}
                    onClick={() => onSelectGem(gem.id)}
                    className="group bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full"
                  >
                    {/* Gem Image */}
                    <div className="relative aspect-[4/3] bg-[#090d16] overflow-hidden">
                      <img
                        src={gem.images[0] || 'https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=800'}
                        alt={gem.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {/* Dark overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      {/* Category Badge */}
                      <span className={`absolute top-4 left-4 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border ${badgeStyle}`}>
                        {gem.category}
                      </span>

                      {/* Status Badge */}
                      {gem.status !== 'Available' && (
                        <span className={`absolute top-4 right-4 text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border ${
                          gem.status === 'Reserved' 
                            ? 'bg-yellow-950/80 text-yellow-300 border-yellow-800/40' 
                            : 'bg-gray-900/90 text-gray-400 border-gray-700'
                        }`}>
                          {gem.status}
                        </span>
                      )}
                    </div>

                    {/* Content */}
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
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

        </div>
      </section>

      {/* 4. CALL TO ACTION FOR THE CATALOG */}
      <section className="py-24 bg-transparent relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,175,59,0.03)_0%,transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight">
            Acquire Extraordinary Rarities
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-light leading-relaxed text-sm sm:text-base">
            Explore our complete active catalog of Emeralds, Sapphires, Rubies, and rare crystals. Filter by weight or category to find the perfect stone.
          </p>
          <div className="pt-4">
            <button
              onClick={() => setView('catalog')}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-[#070a13] font-serif font-medium tracking-wide rounded-lg inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(220,175,59,0.25)] hover:shadow-[0_4px_25px_rgba(220,175,59,0.4)] transition-all duration-300"
            >
              Browse Complete Catalog
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
