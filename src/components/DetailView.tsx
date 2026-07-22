/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, MessageCircle, FileCheck, HelpCircle, ChevronLeft, ChevronRight, Eye, Download, Gem, Mail, Phone, Send, User } from 'lucide-react';
import { Gemstone } from '../types.js';

interface DetailViewProps {
  gemstone: Gemstone;
  onBack: () => void;
}

export function DetailView({ gemstone, onBack }: DetailViewProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showCertModal, setShowCertModal] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('+2348036301091'); // Configurable default dealer number

  // Consultation Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [consultationMethod, setConsultationMethod] = useState<'WhatsApp' | 'Email' | 'Voice'>('WhatsApp');
  const [clientMessage, setClientMessage] = useState(
    `I would like to request a private consultation regarding the ${gemstone.name} (${gemstone.weight.toFixed(2)} cts, Ref: ${gemstone.id}).`
  );

  const images = gemstone.images.length > 0 
    ? gemstone.images 
    : ['https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=800'];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Generate the pre-filled WhatsApp link with URL encoding
  const getWhatsAppLink = () => {
    const textMessage = `Hello Zaheen Global Services,

I am interested in inquiring about the following gemstone:
- Name: ${gemstone.name}
- ID: ${gemstone.id}
- Category: ${gemstone.category}
- Weight: ${gemstone.weight} Carats
- Status: ${gemstone.status}

Could you please provide more details or let me know the next steps for acquisition?

Thank you!`;
    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  const getEmailInquiryLink = () => {
    const subject = encodeURIComponent(`Consultation Request: ${gemstone.name} (Ref: ${gemstone.id})`);
    const body = encodeURIComponent(`Dear Zaheen Global Services Acquisitions Desk,

I would like to request a private consultation regarding the following gemstone:
- Name: ${gemstone.name}
- ID: ${gemstone.id}
- Weight: ${gemstone.weight.toFixed(2)} Carats

--- CLIENT CONTACT DETAILS ---
- Name: ${clientName || 'Not Specified'}
- Email: ${clientEmail || 'Not Specified'}
- Phone: ${clientPhone || 'Not Specified'}
- Preferred Channel: ${consultationMethod}

--- CLIENT MESSAGE ---
${clientMessage}

Sincerely,
${clientName || 'Interested Client'}`);
    return `mailto:zaheenaminu@gmail.com?subject=${subject}&body=${body}`;
  };

  const getDetailedWhatsAppLink = () => {
    const textMessage = `Hello Zaheen Global Services,

*NEW CONSULTATION REQUEST*

I would like to request a private consultation for:
- *Stone:* ${gemstone.name}
- *Ref ID:* ${gemstone.id}
- *Weight:* ${gemstone.weight.toFixed(2)} Carats

*Client Details:*
- *Name:* ${clientName || 'Not Specified'}
- *Email:* ${clientEmail || 'Not Specified'}
- *Phone:* ${clientPhone || 'Not Specified'}
- *Preferred Channel:* ${consultationMethod}

*Message:*
${clientMessage}`;

    const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(textMessage)}`;
  };

  // Suffix styles based on gem family
  const categoryGlowMap: Record<string, string> = {
    Emerald: 'shadow-emerald-500/20 ring-emerald-500/30 text-emerald-300 bg-emerald-950/50',
    Ruby: 'shadow-red-500/20 ring-red-500/30 text-red-300 bg-red-950/50',
    Sapphire: 'shadow-blue-500/20 ring-blue-500/30 text-blue-300 bg-blue-950/50',
    Amethyst: 'shadow-purple-500/20 ring-purple-500/30 text-purple-300 bg-purple-950/50',
    Topaz: 'shadow-amber-500/20 ring-amber-500/30 text-amber-300 bg-amber-950/50',
    Tourmaline: 'shadow-pink-500/20 ring-pink-500/30 text-pink-300 bg-pink-950/50',
  };
  const jewelTheme = categoryGlowMap[gemstone.category] || 'shadow-gray-500/20 ring-gray-500/30 text-gray-300 bg-gray-950/50';

  return (
    <div className="bg-transparent text-[#F5F2ED] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-gold-300 hover:text-gold-200 font-serif text-sm mb-8 group cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          Back to Catalog
        </button>

        {/* MAIN DETAIL GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT SIDE: MULTI-IMAGE CAROUSEL / GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Primary Main Image Frame */}
            <div className="relative aspect-[4/3] bg-black/30 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={images[activeImageIndex]}
                  alt={`${gemstone.name} photo ${activeImageIndex + 1}`}
                  referrerPolicy="no-referrer"
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>

              {/* Status Ribbon overlay */}
              {gemstone.status !== 'Available' && (
                <div className={`absolute top-4 right-4 z-10 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest border font-semibold shadow-xl ${
                  gemstone.status === 'Reserved'
                    ? 'bg-yellow-950/90 text-yellow-300 border-yellow-700'
                    : 'bg-red-950/90 text-red-400 border-red-800'
                }`}>
                  {gemstone.status}
                </div>
              )}

              {/* Navigation Arrows (if multiple images exist) */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-gold-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-gold-300 hover:text-white hover:bg-white/10 cursor-pointer transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Dot Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 px-3 py-1 rounded-full">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                        activeImageIndex === i ? 'bg-gold-300 w-4' : 'bg-white/40 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation Grid */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`aspect-square rounded-xl overflow-hidden border transition-all cursor-pointer bg-[#090d16] ${
                      activeImageIndex === i 
                        ? 'border-gold-300 ring-2 ring-gold-400/20 scale-95' 
                        : 'border-gold-300/10 hover:border-gold-300/30'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDE: GEM DETAILS AND WHATSAPP INQUIRY */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Header / Primary details */}
            <div className="space-y-4">
              <span className={`inline-flex items-center gap-1.5 text-xs font-mono tracking-widest uppercase px-3 py-1 rounded-lg border ring-1 ${jewelTheme}`}>
                <Gem className="w-3.5 h-3.5" />
                {gemstone.category}
              </span>
              
              <h1 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight">
                {gemstone.name}
              </h1>

              {/* Specifications Pills */}
              <div className="pt-2">
                <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-xl shadow-xl">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">Weight</span>
                  <span className="text-xl font-serif text-white font-medium block pt-1">
                    {gemstone.weight.toFixed(2)} <span className="text-xs text-gold-400 font-mono">cts</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Description Text block */}
            <div className="border-t border-gold-300/10 pt-6 space-y-3">
              <h3 className="font-serif text-white text-lg font-medium">Stone Description</h3>
              <div 
                className="text-gray-400 text-sm font-light leading-relaxed markdown-body"
                dangerouslySetInnerHTML={{ __html: gemstone.description }}
              />
            </div>

            {/* CERTIFICATE OF AUTHENTICITY SECTION */}
            {gemstone.certificate && (
              <div className="border-t border-gold-300/10 pt-6 space-y-4">
                <h3 className="font-serif text-white text-lg font-medium flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-gold-300" />
                  Certificate of Authenticity
                </h3>
                
                <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl flex items-center justify-between gap-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-black/30 border border-white/10 overflow-hidden flex items-center justify-center text-gold-400">
                      {gemstone.certificate.startsWith('data:image') || gemstone.certificate.startsWith('http') ? (
                        <img src={gemstone.certificate} alt="Cert thumbnail" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <FileCheck className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-gold-100 block font-medium">Geological Report</span>
                      <span className="text-[10px] font-mono text-gray-500 block">Verification attached</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowCertModal(true)}
                      className="p-2 rounded-lg bg-black/20 hover:bg-white/10 border border-white/10 text-gold-300 cursor-pointer text-xs flex items-center gap-1"
                      title="View Certificate"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <a
                      href={gemstone.certificate}
                      download={`${gemstone.name.replace(/\s+/g, '_')}_Certificate`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-black/20 hover:bg-white/10 border border-white/10 text-gold-300 cursor-pointer text-xs flex items-center gap-1"
                      title="Download Certificate"
                    >
                      <Download className="w-4 h-4" />
                      <span>Open</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* REQUEST CONSULTATION FORM */}
            <div className="border-t border-white/10 pt-6 space-y-6">
              <div className="space-y-1.5">
                <h3 className="font-serif text-white text-lg font-medium flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gold-300" />
                  Request Private Consultation
                </h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed">
                  Connect with our gemology acquisitions desk. Specify your preferred contact channel and details below to initiate a secure transaction or virtual viewing.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 space-y-4 shadow-xl">
                {/* Name field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Aliko Dangote"
                      className="w-full bg-black/25 border border-white/10 focus:border-gold-300 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-300 outline-none font-sans"
                    />
                  </div>
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        placeholder="client@domain.com"
                        className="w-full bg-black/25 border border-white/10 focus:border-gold-300 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-300 outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        placeholder="e.g. +234 803 000 0000"
                        className="w-full bg-black/25 border border-white/10 focus:border-gold-300 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-300 outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Consultation Preference */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Preferred Consultation Channel
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['WhatsApp', 'Email', 'Voice'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setConsultationMethod(method)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                          consultationMethod === method
                            ? 'bg-gold-400 border-gold-300 text-black font-semibold'
                            : 'bg-black/20 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom message */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Your Message / Specific Requirements
                  </label>
                  <textarea
                    value={clientMessage}
                    onChange={(e) => setClientMessage(e.target.value)}
                    rows={3}
                    placeholder="Provide any specific consultation preferences or queries..."
                    className="w-full bg-black/25 border border-white/10 focus:border-gold-300 rounded-xl p-3 text-xs text-gray-300 outline-none font-sans resize-none"
                  />
                </div>

                {/* Optional dealer phone edit for admin/curator */}
                <div className="pt-2 border-t border-white/5">
                  <details className="cursor-pointer group">
                    <summary className="text-[9px] font-mono text-gray-500 hover:text-gray-400 flex items-center gap-1 outline-none select-none">
                      <span>Dealer Routing Settings ({whatsappNumber})</span>
                    </summary>
                    <div className="pt-2 space-y-1">
                      <label className="text-[8px] font-mono uppercase tracking-widest text-gray-500 block">
                        Admin Route Destination
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="+2348036301091"
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-400 outline-none font-mono"
                      />
                    </div>
                  </details>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <a
                    href={getDetailedWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-green-600 hover:bg-green-500 text-white font-serif font-medium text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(22,163,74,0.2)] hover:shadow-[0_4px_15px_rgba(22,163,74,0.3)] transition-all transform hover:-translate-y-0.5 duration-300"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Inquire via WhatsApp</span>
                  </a>
                  <a
                    href={getEmailInquiryLink()}
                    className="px-4 py-2.5 bg-gold-400 hover:bg-gold-300 text-[#070a13] font-serif font-medium text-xs tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(220,175,59,0.2)] hover:shadow-[0_4px_15px_rgba(220,175,59,0.3)] transition-all transform hover:-translate-y-0.5 duration-300"
                  >
                    <Mail className="w-4 h-4 text-[#070a13]" />
                    <span>Send Inquiry Email</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* FULL CERTIFICATE MODAL */}
      <AnimatePresence>
        {showCertModal && gemstone.certificate && createPortal(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-lg flex items-center justify-center p-4"
          >
            <div className="relative max-w-4xl w-full bg-[#090d16] border border-white/10 rounded-2xl overflow-hidden p-6 shadow-2xl flex flex-col max-h-[90vh]">
              
              <div className="flex items-center justify-between border-b border-gold-300/10 pb-4 mb-4">
                <h3 className="font-serif text-lg text-white font-medium">
                  {gemstone.name} — Geological Report
                </h3>
                <button
                  onClick={() => setShowCertModal(false)}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-auto flex justify-center items-center bg-black/30 rounded-xl p-4">
                {gemstone.certificate.startsWith('data:image') || gemstone.certificate.startsWith('http') ? (
                  <img
                    src={gemstone.certificate}
                    alt="Certificate Document"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-[60vh] object-contain rounded"
                  />
                ) : (
                  <div className="text-center p-12 text-gray-400">
                    <FileCheck className="w-16 h-16 mx-auto text-gold-300 mb-4" />
                    <p className="font-serif text-lg">Document Attached</p>
                    <p className="text-xs text-gray-500 mt-1">This report is stored in custom PDF/file format.</p>
                    <a
                      href={gemstone.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-1 px-4 py-2 bg-gold-400 text-black text-xs font-serif rounded"
                    >
                      Open Document in New Tab
                    </a>
                  </div>
                )}
              </div>

              <div className="border-t border-gold-300/10 pt-4 mt-4 flex justify-end gap-3">
                <a
                  href={gemstone.certificate}
                  download={`${gemstone.name.replace(/\s+/g, '_')}_Certificate`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gold-500 hover:bg-gold-400 text-[#070a13] font-serif text-xs rounded-lg flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download / Open Original
                </a>
                <button
                  onClick={() => setShowCertModal(false)}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-serif text-xs rounded-lg cursor-pointer"
                >
                  Close Preview
                </button>
              </div>

            </div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>

    </div>
  );
}

// Simple internal X icon
function XIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
