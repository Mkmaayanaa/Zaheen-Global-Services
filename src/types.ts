/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GemCategory = 'Emerald' | 'Ruby' | 'Sapphire' | 'Amethyst' | 'Topaz' | 'Tourmaline' | 'Other';

export type GemStatus = 'Available' | 'Reserved' | 'Sold';

export interface Gemstone {
  id: string;
  name: string;
  category: GemCategory;
  description: string;
  weight: number; // in carats
  price: number; // USD/Any currency
  images: string[]; // URLs or base64 data strings
  certificate?: string; // Optional image URL/Base64 or PDF data
  status: GemStatus;
  featured: boolean;
  displayOrder: number;
  createdAt: string; // ISO date string
}

export interface AdminSession {
  authenticated: boolean;
  token?: string;
}

export interface GemFilter {
  category: GemCategory | 'All';
  status: GemStatus | 'All' | 'AvailableOrReserved';
  minPrice: number;
  maxPrice: number;
  search: string;
  sortBy: 'price-asc' | 'price-desc' | 'weight-asc' | 'weight-desc' | 'newest' | 'order';
}
