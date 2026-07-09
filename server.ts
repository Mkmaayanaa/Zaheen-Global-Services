/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { Gemstone, GemCategory, GemStatus } from './src/types.js';

dotenv.config();

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), 'gemstones-db.json');

// Default Admin Password (can be overridden in environment variables)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'zaheengems';
// A simple active admin session store in memory
const ACTIVE_TOKENS = new Set<string>();

// Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to read and write database
function getGemstones(): Gemstone[] {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // Seed initial data
      const seedData: Gemstone[] = [
        {
          id: 'gem-1',
          name: 'The Royal Rikkos Emerald',
          category: 'Emerald',
          description: '<p>A magnificent, deeply saturated green emerald with excellent clarity. Mined from the finest deposits of Rikkos and cut into a perfect octagon. Features minor traditional oil treatment to enhance its stunning natural glow.</p><p>Its facets are flawless and look spectacular in natural light, making it a masterpiece for collectors and connoisseurs alike.</p>',
          weight: 4.82,
          price: 12500,
          images: ['https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&q=80&w=800'],
          certificate: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800',
          status: 'Available',
          featured: true,
          displayOrder: 1,
          createdAt: new Date('2026-07-01T10:00:00Z').toISOString()
        },
        {
          id: 'gem-2',
          name: 'The Skysun Sunrise Sapphire',
          category: 'Sapphire',
          description: '<p>A breathtaking cornflower blue sapphire with intense color play. Its facets catch the light, resembling the morning sun rising behind Skysun.</p><p>Completely unheated and untreated, with a pristine cushion cut, this gem showcases magnificent saturation and a brilliant spark from every angle.</p>',
          weight: 3.54,
          price: 9800,
          images: ['https://images.unsplash.com/photo-1615655406736-b37c4fedf906?auto=format&fit=crop&q=80&w=800'],
          status: 'Available',
          featured: true,
          displayOrder: 2,
          createdAt: new Date('2026-07-02T11:30:00Z').toISOString()
        },
        {
          id: 'gem-3',
          name: 'Imperial Pigeon Blood Ruby',
          category: 'Ruby',
          description: '<p>An extraordinary oval-cut ruby exhibiting the rare and highly coveted "Pigeon Blood" red hue. Extremely vivid saturation with a brilliant polish.</p><p>Mined from deep geological reserves, this ruby has been carefully faceted to emphasize its rich internal crimson fire. Truly a gemstone of royal lineage.</p>',
          weight: 2.15,
          price: 15400,
          images: ['https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?auto=format&fit=crop&q=80&w=800'],
          certificate: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&q=80&w=800',
          status: 'Available',
          featured: true,
          displayOrder: 3,
          createdAt: new Date('2026-07-03T14:15:00Z').toISOString()
        },
        {
          id: 'gem-4',
          name: 'Amethyst Star of Skysun',
          category: 'Amethyst',
          description: '<p>A deep royal purple amethyst crystal cut into a brilliant round shape. Known for its intense purple flashes and flawless clarity under magnifying inspection.</p><p>Perfect for a show-stopping pendant or custom ring setting. Responsibly sourced from the foothills behind Skysun.</p>',
          weight: 12.4,
          price: 1200,
          images: ['https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?auto=format&fit=crop&q=80&w=800'],
          status: 'Available',
          featured: false,
          displayOrder: 4,
          createdAt: new Date('2026-07-04T09:00:00Z').toISOString()
        },
        {
          id: 'gem-5',
          name: 'Golden Sun Topaz',
          category: 'Topaz',
          description: '<p>A brilliant, rich golden-yellow imperial topaz. Meticulously faceted to showcase its exquisite light refraction and natural, fiery brilliance.</p><p>This topaz represents abundance and solar energy, bringing a radiant golden glow that stands out beautifully in any luxury jewelry collection.</p>',
          weight: 8.65,
          price: 3400,
          images: ['https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800'],
          status: 'Reserved',
          featured: false,
          displayOrder: 5,
          createdAt: new Date('2026-07-05T16:45:00Z').toISOString()
        },
        {
          id: 'gem-6',
          name: 'Watermelon Tourmaline Prism',
          category: 'Tourmaline',
          description: '<p>A striking bi-color pink and green tourmaline showcasing a sharp, clean color separation. Cut into a sleek emerald-cut bar to highlight its unique natural symmetry.</p><p>This tourmaline is an exceptional collector\'s piece due to the absolute distinction between its lush green skin and warm, rosy heart.</p>',
          weight: 5.22,
          price: 2100,
          images: ['https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=800'],
          status: 'Available',
          featured: true,
          displayOrder: 6,
          createdAt: new Date('2026-07-06T12:00:00Z').toISOString()
        }
      ];
      fs.writeFileSync(DB_FILE, JSON.stringify(seedData, null, 2));
      return seedData;
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading/writing gemstones DB:', err);
    return [];
  }
}

function saveGemstones(gems: Gemstone[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(gems, null, 2));
  } catch (err) {
    console.error('Error writing gemstones DB:', err);
  }
}

// Authentication Middleware
function checkAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = req.headers['x-admin-token'] as string;
  if (token && ACTIVE_TOKENS.has(token)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized admin access' });
  }
}

// --- API ENDPOINTS ---

// Admin Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    ACTIVE_TOKENS.add(token);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ error: 'Invalid admin password' });
  }
});

// Admin Logout
app.post('/api/auth/logout', (req, res) => {
  const token = req.headers['x-admin-token'] as string;
  if (token) {
    ACTIVE_TOKENS.delete(token);
  }
  res.json({ success: true });
});

// Check Admin Auth Status
app.get('/api/auth/status', (req, res) => {
  const token = req.headers['x-admin-token'] as string;
  if (token && ACTIVE_TOKENS.has(token)) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

// Get Gemstones (sorted by displayOrder ascending, then createdAt descending)
app.get('/api/gemstones', (req, res) => {
  const gems = getGemstones();
  const sortedGems = [...gems].sort((a, b) => {
    if (a.displayOrder !== b.displayOrder) {
      return a.displayOrder - b.displayOrder;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  res.json(sortedGems);
});

// Get single Gemstone
app.get('/api/gemstones/:id', (req, res) => {
  const gems = getGemstones();
  const gem = gems.find(g => g.id === req.params.id);
  if (gem) {
    res.json(gem);
  } else {
    res.status(404).json({ error: 'Gemstone not found' });
  }
});

// Add Gemstone
app.post('/api/gemstones', checkAdminAuth, (req, res) => {
  const gems = getGemstones();
  const { name, category, description, weight, price, images, certificate, status, featured } = req.body;

  if (!name || !category || weight === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Calculate next display order
  const maxOrder = gems.reduce((max, g) => g.displayOrder > max ? g.displayOrder : max, 0);

  const newGem: Gemstone = {
    id: 'gem-' + Math.random().toString(36).substring(2) + Date.now().toString(36),
    name,
    category,
    description: description || '',
    weight: Number(weight),
    price: price !== undefined ? Number(price) : 0,
    images: Array.isArray(images) ? images : [],
    certificate,
    status: status || 'Available',
    featured: !!featured,
    displayOrder: maxOrder + 1,
    createdAt: new Date().toISOString()
  };

  gems.push(newGem);
  saveGemstones(gems);
  res.status(201).json(newGem);
});

// Edit Gemstone
app.put('/api/gemstones/:id', checkAdminAuth, (req, res) => {
  const gems = getGemstones();
  const index = gems.findIndex(g => g.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Gemstone not found' });
  }

  const existingGem = gems[index];
  const { name, category, description, weight, price, images, certificate, status, featured, displayOrder } = req.body;

  const updatedGem: Gemstone = {
    ...existingGem,
    name: name !== undefined ? name : existingGem.name,
    category: category !== undefined ? category : existingGem.category,
    description: description !== undefined ? description : existingGem.description,
    weight: weight !== undefined ? Number(weight) : existingGem.weight,
    price: price !== undefined ? Number(price) : (existingGem.price !== undefined ? existingGem.price : 0),
    images: Array.isArray(images) ? images : existingGem.images,
    certificate: certificate !== undefined ? certificate : existingGem.certificate,
    status: status !== undefined ? status : existingGem.status,
    featured: featured !== undefined ? !!featured : existingGem.featured,
    displayOrder: displayOrder !== undefined ? Number(displayOrder) : existingGem.displayOrder,
  };

  gems[index] = updatedGem;
  saveGemstones(gems);
  res.json(updatedGem);
});

// Delete Gemstone
app.delete('/api/gemstones/:id', checkAdminAuth, (req, res) => {
  let gems = getGemstones();
  const index = gems.findIndex(g => g.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Gemstone not found' });
  }

  gems.splice(index, 1);
  // Re-adjust displayOrder to be sequential and without gaps
  gems = gems.sort((a, b) => a.displayOrder - b.displayOrder);
  gems.forEach((g, i) => {
    g.displayOrder = i + 1;
  });

  saveGemstones(gems);
  res.json({ success: true });
});

// Reorder Gemstones (Admin)
app.post('/api/gemstones/reorder', checkAdminAuth, (req, res) => {
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array of gemstone IDs' });
  }

  const gems = getGemstones();
  
  // Assign new displayOrder based on the array position
  orderedIds.forEach((id, index) => {
    const gem = gems.find(g => g.id === id);
    if (gem) {
      gem.displayOrder = index + 1;
    }
  });

  saveGemstones(gems);
  res.json({ success: true });
});

// Ensure initial database configuration is loaded on start
getGemstones();

// --- BIND DEV/PROD VITE OR STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Dev server running with Vite middleware');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production server running with static assets from dist/');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zaheen Global Services app running at http://localhost:${PORT}`);
  });
}

startServer();
