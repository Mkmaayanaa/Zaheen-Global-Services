/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Compass, Shield, ShieldCheck, Gem } from 'lucide-react';

export function AboutView() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-transparent text-[#F5F2ED] py-12 md:py-20 relative overflow-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-gold-950/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24 space-y-4">
          <span className="text-xs font-mono tracking-widest text-gold-300 uppercase block">
            Zaheen Global Services
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight leading-tight">
            Our Heritage & Sourcing
          </h1>
          <p className="text-gray-400 font-light text-sm sm:text-base leading-relaxed">
            Established on the principles of integrity, perfect geometry, and geological scarcity, we serve as the premier gemstone gateway in Rikkos.
          </p>
        </div>

        {/* Heritage Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-2xl md:text-3xl text-white tracking-tight">
              The Legend of Rikkos & Skysun Sourcing
            </h2>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              For generations, the gemstone trading lines behind <span className="text-gold-300 font-medium">Skysun</span> in the valleys of <span className="text-gold-300 font-medium">Rikkos</span> have held secrets of exceptional crystalline mineral deposits. Here, geological pressures have forged color saturations found nowhere else in the world.
            </p>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              Zaheen Global Services was founded to establish direct channel partnerships with local artisans and geological dig sites. By maintaining our principal offices and cutting house in Rikkos, we oversee every facet of the supply chain—from rough crystal extraction to the final hand-polished masterpiece on velvet.
            </p>
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed">
              We serve a selective global clientele including royal jewelry houses, private high-net-worth curators, and prestigious master designers. Every stone in our vault represents a certified asset of enduring value.
            </p>
          </div>

          {/* Decorative Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative p-8 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-2xl space-y-6">
              <div className="absolute top-0 right-0 p-4">
                <Compass className="w-12 h-12 text-gold-300/10 animate-spin [animation-duration:60s]" />
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold-950/40 border border-gold-300/20 flex items-center justify-center text-gold-300">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-lg text-white font-medium">Core Directives</h3>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-300 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-white block">Ethical Extraction Matrix</span>
                    <span className="text-xs text-gray-400 font-light">Supporting geological miners with fair-market trade and absolute community safety.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-300 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-white block">Symmetric Precision Cutting</span>
                    <span className="text-xs text-gray-400 font-light">Rejecting automated mass factories to ensure each gem is hand-crafted to maximum reflection indices.</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-300 mt-2 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-mono text-white block">Zero-Trust Origin Verification</span>
                    <span className="text-xs text-gray-400 font-light">Comprehensive lab reports for origin validation, mineral classifications, and treatments.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Map / Location & Contact Details */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-12 border-t border-white/5"
        >
          {/* Location Description */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-gold-300 uppercase block">Where to Find Us</span>
              <h3 className="font-serif text-xl text-white font-medium">Headquarters & Vault</h3>
              <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                Our main trading offices and secure stone vaults are positioned in Rikkos, Cy, nestled discreetly behind the Skysun commercial development gates. 
              </p>
              <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                Private viewings and raw-material consultations are available exclusively by appointment. Armored collection and private jet delivery routes are arranged directly from Rikkos Airport.
              </p>
            </div>

            <div className="mt-8 flex items-center gap-3 text-xs text-gold-300 font-mono">
              <MapPin className="w-4 h-4 text-gold-300" />
              <span>Rikkos, behind Skysun Commercial District, Jos Pleatue State Nigeria.</span>
            </div>
          </motion.div>

          {/* Contact Details */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-4">
              <span className="text-[10px] font-mono tracking-widest text-gold-300 uppercase block">Inquiries</span>
              <h3 className="font-serif text-xl text-white font-medium">Get in Touch</h3>
              <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed">
                For commercial contracts, custom wholesale requests of Emeralds or Sapphires, or private collection acquisitions, connect with our principal dealers.
              </p>
            </div>

            <div className="mt-8 space-y-4 text-xs font-mono text-gray-400">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-300" />
                <span>+234 8036301091</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-300" />
                <span>zaheenaminu@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Compass className="w-4 h-4 text-gold-300" />
                <span>Registered Lapidary Chamber: R-9943</span>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </div>
  );
}
