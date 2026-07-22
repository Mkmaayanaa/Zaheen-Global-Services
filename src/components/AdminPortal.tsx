/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { 
  Lock, KeyRound, Mail, Plus, Trash2, Edit2, ArrowUp, ArrowDown, 
  Sparkles, CheckCircle2, X, Upload, FileSpreadsheet, Eye, RefreshCw, AlertCircle
} from 'lucide-react';
import { Gemstone, GemCategory, GemStatus } from '../types.js';

interface AdminPortalProps {
  gemstones: Gemstone[];
  isAdminLoggedIn: boolean;
  adminToken: string | null;
  onLogin: (token: string) => void;
  onLogout: () => void;
  onRefreshData: () => Promise<void>;
}

export function AdminPortal({ 
  gemstones, 
  isAdminLoggedIn, 
  adminToken, 
  onLogin, 
  onLogout, 
  onRefreshData 
}: AdminPortalProps) {
  
  // Authentication Form States
  const [email, setEmail] = useState('admin@zaheen-global.com');
  const [password, setPassword] = useState('zaheengems');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form Drawer Modal States
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingGem, setEditingGem] = useState<Gemstone | null>(null);
  
  // Gem Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<GemCategory>('Emerald');
  const [formWeight, setFormWeight] = useState(0);
  const [formPrice, setFormPrice] = useState(0);
  const [formStatus, setFormStatus] = useState<GemStatus>('Available');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formImages, setFormImages] = useState<string[]>([]);
  const [formCertificate, setFormCertificate] = useState<string>('');
  
  const [formError, setFormError] = useState('');
  const [isSavingForm, setIsSavingForm] = useState(false);

  // Delete Confirmation States
  const [deletingGemId, setDeletingGemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle file uploads to Base64 helper
  const handleMultipleImagesUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Promises: Promise<string>[] = Array.from(files).map((file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });
    });

    try {
      const base64s = await Promise.all(base64Promises);
      setFormImages((prev) => [...prev, ...base64s]);
    } catch (err) {
      console.error('Error uploading images:', err);
      setFormError('Failed to parse uploaded images. Ensure files are not corrupted.');
    }
  };

  const handleCertificateUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormCertificate(reader.result as string);
    };
    reader.onerror = () => {
      setFormError('Failed to parse certificate file.');
    };
  };

  const removeFormImage = (indexToRemove: number) => {
    setFormImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Login submission
  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.token);
      } else {
        const errData = await response.json();
        setLoginError(errData.error || 'Authentication failed. Please verify the password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setLoginError('Server connection error. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Open Form Drawer to Add Stone
  const openAddDrawer = () => {
    setEditingGem(null);
    setFormName('');
    setFormCategory('Emerald');
    setFormWeight(1.0);
    setFormPrice(0);
    setFormStatus('Available');
    setFormFeatured(false);
    setFormDescription('<p>Fully sourced and hand-polished precious gemstone.</p>');
    setFormImages([]);
    setFormCertificate('');
    setFormError('');
    setIsDrawerOpen(true);
  };

  // Open Form Drawer to Edit Stone
  const openEditDrawer = (gem: Gemstone) => {
    setEditingGem(gem);
    setFormName(gem.name);
    setFormCategory(gem.category);
    setFormWeight(gem.weight);
    setFormPrice(gem.price);
    setFormStatus(gem.status);
    setFormFeatured(gem.featured);
    setFormDescription(gem.description);
    setFormImages(gem.images);
    setFormCertificate(gem.certificate || '');
    setFormError('');
    setIsDrawerOpen(true);
  };

  // Submit Add or Edit Form
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    if (!formName.trim()) {
      setFormError('Gemstone name is required.');
      return;
    }
    if (formWeight <= 0) {
      setFormError('Weight in carats must be greater than 0.');
      return;
    }

    setIsSavingForm(true);

    const payload = {
      name: formName,
      category: formCategory,
      description: formDescription,
      weight: formWeight,
      price: formPrice,
      status: formStatus,
      featured: formFeatured,
      images: formImages,
      certificate: formCertificate || undefined
    };

    const url = editingGem ? `/api/gemstones/${editingGem.id}` : '/api/gemstones';
    const method = editingGem ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken || ''
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsDrawerOpen(false);
        await onRefreshData();
      } else {
        const err = await response.json();
        setFormError(err.error || 'Failed to save gemstone.');
      }
    } catch (err) {
      console.error('Error saving:', err);
      setFormError('Server error while saving.');
    } finally {
      setIsSavingForm(false);
    }
  };

  // Inline Quick Toggle for Featured Badge
  const toggleFeaturedQuick = async (gem: Gemstone) => {
    try {
      await fetch(`/api/gemstones/${gem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken || ''
        },
        body: JSON.stringify({ featured: !gem.featured })
      });
      await onRefreshData();
    } catch (err) {
      console.error('Quick toggle error:', err);
    }
  };

  // Inline Quick Change for Availability Status
  const changeStatusQuick = async (gem: Gemstone, status: GemStatus) => {
    try {
      await fetch(`/api/gemstones/${gem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken || ''
        },
        body: JSON.stringify({ status })
      });
      await onRefreshData();
    } catch (err) {
      console.error('Quick status error:', err);
    }
  };

  // Reorder Item Up
  const moveGemUp = async (index: number) => {
    if (index === 0) return;
    const reorderedList = [...gemstones];
    
    // Swap elements in list
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[index - 1];
    reorderedList[index - 1] = temp;

    const orderedIds = reorderedList.map(g => g.id);
    await sendReorderRequest(orderedIds);
  };

  // Reorder Item Down
  const moveGemDown = async (index: number) => {
    if (index === gemstones.length - 1) return;
    const reorderedList = [...gemstones];
    
    // Swap elements in list
    const temp = reorderedList[index];
    reorderedList[index] = reorderedList[index + 1];
    reorderedList[index + 1] = temp;

    const orderedIds = reorderedList.map(g => g.id);
    await sendReorderRequest(orderedIds);
  };

  const sendReorderRequest = async (orderedIds: string[]) => {
    try {
      const response = await fetch('/api/gemstones/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken || ''
        },
        body: JSON.stringify({ orderedIds })
      });

      if (response.ok) {
        await onRefreshData();
      } else {
        alert('Failed to save display order to the server.');
      }
    } catch (err) {
      console.error('Reorder request error:', err);
    }
  };

  // Confirm delete handler
  const handleDeleteGem = async () => {
    if (!deletingGemId) return;
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/gemstones/${deletingGemId}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': adminToken || '' }
      });

      if (response.ok) {
        setDeletingGemId(null);
        await onRefreshData();
      } else {
        alert('Failed to delete gemstone.');
      }
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  // --- RENDERING SECURITY GATE (LOGIN SCREEN) ---
  if (!isAdminLoggedIn) {
    return (
      <div className="bg-transparent text-[#F5F2ED] flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="absolute top-1/4 w-96 h-96 bg-gold-950/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto text-gold-300 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-serif text-2xl text-white font-medium">Admin Sourcing Gate</h1>
            <p className="text-xs text-gray-400 font-light max-w-xs mx-auto">
              Authenticating access to Zaheen Global Services gemstone registry.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">
                Security Identity (Email)
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zaheen-global.com"
                  className="w-full bg-black/20 border border-white/10 focus:border-gold-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-300 outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block">
                Credentials Code (Password)
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 focus:border-gold-300 rounded-xl py-2.5 pl-10 pr-4 text-xs text-gray-300 outline-none transition-all font-mono"
                  required
                />
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-black font-serif font-medium text-sm tracking-wide rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_15px_rgba(220,175,59,0.2)] hover:shadow-[0_4px_20px_rgba(220,175,59,0.35)] transition-all"
            >
              {isLoggingIn ? 'Verifying...' : 'Authenticate'}
            </button>
          </form>

          {/* Secure Hint Info block */}
          <div className="border-t border-gold-300/5 pt-4 text-center space-y-1">
            <span className="text-[9px] font-mono text-gold-400 block uppercase tracking-widest">
              Access Credentials Note
            </span>
            <p className="text-[10px] text-gray-500 font-light leading-relaxed">
              Default Development Password: <span className="text-gold-200 font-mono">zaheengems</span>
            </p>
          </div>

        </div>
      </div>
    );
  }

  // --- RENDERING SECURE ADMIN REGISTRY PANEL ---
  return (
    <div className="bg-transparent text-[#F5F2ED] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6 mb-8 gap-4">
          <div>
            <span className="text-xs font-mono tracking-widest text-gold-300 uppercase block mb-1">
              Secure Registry Management
            </span>
            <h1 className="font-serif text-3xl text-white tracking-tight">
              Gemstone Inventory Registry
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onRefreshData}
              className="p-2.5 rounded-xl border border-white/10 bg-black/20 text-gray-400 hover:text-gold-300 cursor-pointer flex items-center gap-1.5 text-xs font-mono transition-all"
              title="Refresh Sourced Data"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Sync
            </button>
            <button
              onClick={openAddDrawer}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 text-[#070a13] font-serif font-medium text-xs tracking-wide flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Source New Stone
            </button>
          </div>
        </div>

        {/* INVENTORY DATABASE TABLE */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
          {gemstones.length === 0 ? (
            <div className="text-center py-20">
              <FileSpreadsheet className="w-12 h-12 text-gold-300/30 mx-auto mb-4" />
              <p className="font-serif text-lg text-white mb-1">Registry is Empty</p>
              <p className="text-xs text-gray-500">Source your first gemstone by clicking the button above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono uppercase tracking-widest text-gold-400">
                    <th className="py-4 px-4 text-center">Order</th>
                    <th className="py-4 px-4">Gem Image</th>
                    <th className="py-4 px-4">Stone Name</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Weight (Carats)</th>
                    <th className="py-4 px-4">Featured</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {gemstones.map((gem, index) => {
                    return (
                      <tr key={gem.id} className="hover:bg-white/5 transition-colors">
                        
                        {/* Display Reorder arrows */}
                        <td className="py-4 px-4 text-center">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <button
                              onClick={() => moveGemUp(index)}
                              disabled={index === 0}
                              className={`p-0.5 rounded hover:bg-white/10 border border-transparent transition-all cursor-pointer ${
                                index === 0 ? 'opacity-20 pointer-events-none' : 'text-gold-300'
                              }`}
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-[10px] font-mono text-gray-500">{gem.displayOrder}</span>
                            <button
                              onClick={() => moveGemDown(index)}
                              disabled={index === gemstones.length - 1}
                              className={`p-0.5 rounded hover:bg-white/10 border border-transparent transition-all cursor-pointer ${
                                index === gemstones.length - 1 ? 'opacity-20 pointer-events-none' : 'text-gold-300'
                              }`}
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Image Thumbnail */}
                        <td className="py-4 px-4">
                          <div className="w-12 h-12 rounded-lg bg-black/20 border border-white/10 overflow-hidden">
                            <img
                              src={gem.images[0] || 'https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=800'}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Name & ID */}
                        <td className="py-4 px-4 font-serif text-white font-medium">
                          <div className="truncate max-w-[180px]">
                            {gem.name}
                          </div>
                          <span className="text-[9px] font-mono text-gray-500 block">{gem.id}</span>
                        </td>

                        {/* Category family */}
                        <td className="py-4 px-4 font-serif">
                          {gem.category}
                        </td>

                        {/* Weight in Carats */}
                        <td className="py-4 px-4 font-mono text-xs">
                          {gem.weight.toFixed(2)} cts
                        </td>

                        {/* Featured Toggle checkbox */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleFeaturedQuick(gem)}
                            className={`p-1 px-2.5 rounded-md border text-[10px] font-mono transition-all cursor-pointer flex items-center gap-1 ${
                              gem.featured
                                ? 'bg-white/10 border-white/20 text-gold-300'
                                : 'bg-transparent border-white/5 text-gray-500 hover:text-gray-400'
                            }`}
                          >
                            <Sparkles className={`w-3 h-3 ${gem.featured ? 'text-gold-300 animate-pulse' : ''}`} />
                            {gem.featured ? 'Featured' : 'Standard'}
                          </button>
                        </td>

                        {/* Status dropdown selector */}
                        <td className="py-4 px-4">
                          <select
                            value={gem.status}
                            onChange={(e) => changeStatusQuick(gem, e.target.value as GemStatus)}
                            className={`bg-black/40 border border-white/10 text-xs font-mono rounded px-2 py-1 outline-none cursor-pointer ${
                              gem.status === 'Available'
                                ? 'border-green-800/60 text-green-400'
                                : gem.status === 'Reserved'
                                ? 'border-yellow-800/60 text-yellow-400'
                                : 'border-gray-800 text-gray-500'
                            }`}
                          >
                            <option value="Available">Available</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Sold">Sold</option>
                          </select>
                        </td>

                        {/* Row Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditDrawer(gem)}
                              className="p-1.5 rounded-lg bg-black/20 hover:bg-white/10 text-gray-400 hover:text-gold-300 border border-white/5 cursor-pointer transition-all"
                              title="Edit Stone Specs"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeletingGemId(gem.id)}
                              className="p-1.5 rounded-lg bg-black/20 hover:bg-red-950/40 text-gray-400 hover:text-red-400 border border-white/5 cursor-pointer transition-all"
                              title="Delete Stone"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* 1. ADD / EDIT DRAWER FORM OVERLAY */}
      {isDrawerOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-[#090d16] border-l border-white/10 shadow-2xl flex flex-col h-full overflow-hidden text-[#F5F2ED]">
            
            {/* Drawer Header (Pinned at top) */}
            <div className="flex items-center justify-between border-b border-white/10 p-6 md:p-8 bg-[#090d16] shrink-0 z-10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-gold-300 uppercase block">Registry Record</span>
                <h3 className="font-serif text-xl text-white font-medium">
                  {editingGem ? `Edit Spec: ${editingGem.name}` : 'Source New Saturated Stone'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM CONTAINER (Scrollable Body) */}
            <form id="gemstone-form" onSubmit={handleFormSubmit} className="space-y-6 flex-1 overflow-y-auto p-6 md:p-8">
              
              {/* Form level errors */}
              {formError && (
                <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Basic spec group */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Gem Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Stone Name
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Imperial pigeon Blood Ruby"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-300 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none font-serif"
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Category Family
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as GemCategory)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-300 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none"
                  >
                    <option value="Emerald">Emerald</option>
                    <option value="Ruby">Ruby</option>
                    <option value="Sapphire">Sapphire</option>
                    <option value="Amethyst">Amethyst</option>
                    <option value="Topaz">Topaz</option>
                    <option value="Tourmaline">Tourmaline</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Weight in Carats */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Weight (Carats)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formWeight || ''}
                    onChange={(e) => setFormWeight(Number(e.target.value))}
                    placeholder="e.g. 3.50"
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-300 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none font-mono"
                    required
                  />
                </div>

                {/* Availability Status */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                    Registry Availability Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as GemStatus)}
                    className="w-full bg-black/40 border border-white/10 focus:border-gold-300 rounded-xl px-4 py-2.5 text-xs text-gray-300 outline-none"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                {/* Featured Checkbox toggle */}
                <div className="space-y-1.5 flex flex-col justify-end pb-1.5">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="w-4 h-4 rounded border-white/10 bg-black/40 text-gold-500 focus:ring-gold-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-serif text-white block">Curate on Homepage</span>
                      <span className="text-[10px] font-mono text-gray-500 block">Mark as featured hero gemstone catalog piece</span>
                    </div>
                  </label>
                </div>

              </div>

              {/* Rich Text / Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                  Gemstone Narrative / Rich Description (HTML/Paragraphs supported)
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="<p>Enter details about gemstone lineage, color clarity, cut profiles, origins, etc...</p>"
                  rows={4}
                  className="w-full bg-black/40 border border-white/10 focus:border-gold-300 rounded-xl p-4 text-xs text-gray-300 outline-none font-sans"
                />
              </div>

              {/* IMAGES UPLOADS PANEL */}
              <div className="space-y-3">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                  Gemstone Portfolio Images (Upload multiple)
                </label>
                
                {/* Upload drag block */}
                <div className="border border-dashed border-white/15 rounded-xl p-6 bg-black/40 text-center hover:border-white/30 transition-all relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImagesUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <Upload className="w-8 h-8 text-gold-300/60 mx-auto mb-2" />
                  <span className="text-xs text-gold-100 font-serif block">Upload Photos</span>
                  <span className="text-[10px] font-mono text-gray-500 block">PNG, JPEG up to 5MB. Multiple allowed.</span>
                </div>

                {/* Previews Grid list */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-5 gap-3 pt-2">
                    {formImages.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-black/30">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFormImage(idx)}
                          className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CERTIFICATE FILE UPLOAD */}
              <div className="space-y-3 border-t border-white/5 pt-4">
                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 block">
                  Geological Certificate / Verification Document (Image or PDF)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  
                  {/* File input button */}
                  <div className="relative border border-dashed border-white/15 rounded-xl p-4 bg-black/40 text-center hover:border-white/30 transition-all">
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleCertificateUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <FileSpreadsheet className="w-6 h-6 text-gold-300/60 mx-auto mb-1" />
                    <span className="text-[10px] font-mono text-gold-200 block">Attach Certificate File</span>
                  </div>

                  {/* Preview block if present */}
                  {formCertificate && (
                    <div className="p-3 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl flex items-center justify-between shadow-xl">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                        <span className="text-[10px] font-mono text-gold-100">Certificate Attached</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormCertificate('')}
                        className="p-1 rounded bg-gray-800 text-red-400 hover:bg-red-950"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </form>

            {/* Sticky Action Footer (Always visible at bottom) */}
            <div className="border-t border-white/10 p-4 md:p-6 bg-[#090d16] flex justify-end gap-3 shrink-0 z-10">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-serif text-xs rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="gemstone-form"
                disabled={isSavingForm}
                className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-400 text-[#070a13] font-serif font-medium text-xs rounded-xl shadow-lg cursor-pointer hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSavingForm ? 'Saving Record...' : 'Save Gemstone Record'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* 2. CONFIRM DELETE MODAL */}
      {deletingGemId && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#090d16] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            
            <div className="text-center space-y-2">
              <div className="w-10 h-10 bg-red-950/40 border border-red-800/20 rounded-full flex items-center justify-center mx-auto text-red-400">
                <Trash2 className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-serif text-lg text-white font-medium">Decommission Sourced Gem?</h3>
              <p className="text-xs text-gray-400 font-light leading-relaxed">
                This action will permanently delete this gemstone specification record from the database registry in Rikkos.
              </p>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setDeletingGemId(null)}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-serif rounded-lg cursor-pointer flex-1"
              >
                No, Retain Spec
              </button>
              <button
                type="button"
                onClick={handleDeleteGem}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-serif rounded-lg cursor-pointer flex-1"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
