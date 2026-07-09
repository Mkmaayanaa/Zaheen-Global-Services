/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GemCategory } from '../types.js';

interface FacetedGemProps {
  category: GemCategory;
  className?: string;
  size?: number;
}

export function FacetedGem({ category, className = '', size = 120 }: FacetedGemProps) {
  // Return tailored SVG drawings representing premium faceted gemstone cuts
  const colorMap: Record<GemCategory, { gradientStart: string; gradientEnd: string; lineStroke: string }> = {
    Emerald: { gradientStart: '#059669', gradientEnd: '#064e3b', lineStroke: '#34d399' },
    Ruby: { gradientStart: '#dc2626', gradientEnd: '#7f1d1d', lineStroke: '#fca5a5' },
    Sapphire: { gradientStart: '#2563eb', gradientEnd: '#1e3a8a', lineStroke: '#93c5fd' },
    Amethyst: { gradientStart: '#9333ea', gradientEnd: '#581c87', lineStroke: '#d8b4fe' },
    Topaz: { gradientStart: '#d97706', gradientEnd: '#78350f', lineStroke: '#fde047' },
    Tourmaline: { gradientStart: '#db2777', gradientEnd: '#831843', lineStroke: '#fbcfe8' },
    Other: { gradientStart: '#4b5563', gradientEnd: '#111827', lineStroke: '#d1d5db' },
  };

  const { gradientStart, gradientEnd, lineStroke } = colorMap[category] || colorMap.Other;
  const gradientId = `grad-${category.toLowerCase()}`;

  // Renders beautiful, geometric vector representation of gemstone facet lines
  const renderGemGeometry = () => {
    switch (category) {
      case 'Emerald':
        // Octagonal Emerald Cut
        return (
          <g>
            {/* Outer octagon */}
            <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill={`url(#${gradientId})`} />
            {/* Facet lines */}
            <polygon points="35,20 65,20 77,32 77,68 65,80 35,80 23,68 23,32" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <polygon points="40,30 60,30 67,37 67,63 60,70 40,70 33,63 33,37" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Star facet connections */}
            <line x1="30" y1="10" x2="35" y2="20" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="70" y1="10" x2="65" y2="20" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="90" y1="30" x2="77" y2="32" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="90" y1="70" x2="77" y2="68" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="70" y1="90" x2="65" y2="80" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="30" y1="90" x2="35" y2="80" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="10" y1="70" x2="23" y2="68" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="10" y1="30" x2="23" y2="32" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            {/* Inner connections */}
            <line x1="35" y1="20" x2="40" y2="30" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="65" y1="20" x2="60" y2="30" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="77" y1="32" x2="67" y2="37" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="77" y1="68" x2="67" y2="63" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="65" y1="80" x2="60" y2="70" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="35" y1="80" x2="40" y2="70" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="23" y1="68" x2="33" y2="63" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <line x1="23" y1="32" x2="33" y2="37" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.7" />
          </g>
        );

      case 'Ruby':
        // Brilliant Marquise/Oval cut
        return (
          <g>
            {/* Oval base */}
            <ellipse cx="50" cy="50" rx="42" ry="30" fill={`url(#${gradientId})`} />
            {/* Internal star facets */}
            <ellipse cx="50" cy="50" rx="28" ry="18" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Center table */}
            <ellipse cx="50" cy="50" rx="14" ry="8" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Facet rays */}
            <line x1="50" y1="20" x2="50" y2="32" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="50" y1="80" x2="50" y2="68" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="8" y1="50" x2="22" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="92" y1="50" x2="78" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            {/* Diagonals */}
            <line x1="20" y1="28" x2="30" y2="37" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="80" y1="28" x2="70" y2="37" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="20" y1="72" x2="30" y2="63" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="80" y1="72" x2="70" y2="63" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
          </g>
        );

      case 'Sapphire':
        // Cushion Cut
        return (
          <g>
            {/* Rounded rectangle */}
            <rect x="12" y="12" width="76" height="76" rx="22" fill={`url(#${gradientId})`} />
            {/* Inner cushion */}
            <rect x="24" y="24" width="52" height="52" rx="14" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Center Table */}
            <rect x="36" y="36" width="28" height="28" rx="6" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Ray connections */}
            <line x1="12" y1="12" x2="24" y2="24" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="88" y1="12" x2="76" y2="24" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="12" y1="88" x2="24" y2="76" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="88" y1="88" x2="76" y2="76" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            
            <line x1="50" y1="12" x2="50" y2="24" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="50" y1="88" x2="50" y2="76" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="12" y1="50" x2="24" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="88" y1="50" x2="76" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
          </g>
        );

      case 'Amethyst':
        // Round Brilliant Cut
        return (
          <g>
            {/* Circle boundary */}
            <circle cx="50" cy="50" r="42" fill={`url(#${gradientId})`} />
            {/* Star facets (Inner heptagon/octagon) */}
            <polygon points="50,22 70,30 78,50 70,70 50,78 30,70 22,50 30,30" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Table */}
            <polygon points="50,34 61,39 66,50 61,61 50,66 39,61 34,50 39,39" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Girdle connecting rays */}
            <line x1="50" y1="8" x2="50" y2="22" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="92" y1="50" x2="78" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="50" y1="92" x2="50" y2="78" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="8" y1="50" x2="22" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="20" y1="20" x2="30" y2="30" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="80" y1="20" x2="70" y2="30" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="80" y1="80" x2="70" y2="70" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="20" y1="80" x2="30" y2="70" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
          </g>
        );

      case 'Topaz':
        // Marquise / Diamond Cut
        return (
          <g>
            {/* Rhombus/Marquise shape */}
            <polygon points="50,10 88,50 50,90 12,50" fill={`url(#${gradientId})`} />
            {/* Star facets */}
            <polygon points="50,26 72,50 50,74 28,50" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Center table */}
            <polygon points="50,38 62,50 50,62 38,50" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Corner connection lines */}
            <line x1="50" y1="10" x2="50" y2="26" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="88" y1="50" x2="72" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="50" y1="90" x2="50" y2="74" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="12" y1="50" x2="28" y2="50" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
          </g>
        );

      case 'Tourmaline':
        // Baguette / Emerald Bar Cut
        return (
          <g>
            {/* Long rectangular emerald cut */}
            <polygon points="15,22 85,22 92,30 92,70 85,78 15,78 8,70 8,30" fill={`url(#${gradientId})`} />
            {/* Inner octagon step */}
            <polygon points="22,30 78,30 84,36 84,64 78,70 22,70 16,64 16,36" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            {/* Center table */}
            <polygon points="28,38 72,38 76,42 76,58 72,62 28,62 24,58 24,42" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
            {/* Corner facets */}
            <line x1="15" y1="22" x2="22" y2="30" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="85" y1="22" x2="78" y2="30" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="92" y1="30" x2="84" y2="36" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="92" y1="70" x2="84" y2="64" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="85" y1="78" x2="78" y2="70" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="15" y1="78" x2="22" y2="70" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="8" y1="70" x2="16" y2="64" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
            <line x1="8" y1="30" x2="16" y2="36" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.5" />
          </g>
        );

      default:
        // Elegant diamond standard cut
        return (
          <g>
            <polygon points="50,12 85,38 50,88 15,38" fill={`url(#${gradientId})`} />
            <line x1="50" y1="12" x2="50" y2="88" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <line x1="15" y1="38" x2="85" y2="38" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.6" />
            <polygon points="50,25 68,38 50,68 32,38" fill="none" stroke={lineStroke} strokeWidth="1.5" strokeOpacity="0.8" />
          </g>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`select-none ${className}`}
    >
      <defs>
        <radialGradient id={gradientId} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor={gradientStart} />
          <stop offset="60%" stopColor={gradientStart} stopOpacity="0.9" />
          <stop offset="100%" stopColor={gradientEnd} />
        </radialGradient>
      </defs>
      {renderGemGeometry()}
    </svg>
  );
}

// Morphing Gem loop component for the Hero section
export function MorphingGem({ size = 180 }: { size?: number }) {
  const categories: GemCategory[] = ['Emerald', 'Ruby', 'Sapphire', 'Amethyst', 'Topaz', 'Tourmaline'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 4000); // cycle every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const currentCategory = categories[index];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Decorative Golden Rings in background */}
      <div className="absolute inset-0 border border-gold-300/10 rounded-full animate-spin [animation-duration:12s]" />
      <div className="absolute inset-2 border border-dashed border-gold-400/20 rounded-full animate-spin [animation-duration:24s] [animation-direction:reverse]" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentCategory}
          initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
          animate={{ opacity: 1, scale: 1.0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8, rotate: 30 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="relative z-10 filter drop-shadow-[0_10px_25px_rgba(220,175,59,0.25)]"
        >
          <FacetedGem category={currentCategory} size={size} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
