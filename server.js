const express = require('express');
const path = require('path');
const fs = require('fs');
// Load .env.local if it exists, otherwise fallback to .env
const envPath = fs.existsSync(path.join(__dirname, '.env.local')) 
  ? path.join(__dirname, '.env.local') 
  : path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });

// Load environment variables for Supabase & Telegram
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory news storage
let newsData = [
  { emoji: '🤖', headline: 'Claude 3.5 Releases New Vision Capabilities' },
  { emoji: '🚀', headline: 'AI Agents Automate Enterprise Workflows' },
  { emoji: '💡', headline: 'LLM Fine-Tuning Breakthrough in Production' },
  { emoji: '🔗', headline: 'Multi-Agent Systems Show Promise in Testing' },
  { emoji: '📊', headline: 'Automation Drives 40% Efficiency Gains' }
];

// In-memory contacts storage (for local development)
let contactsData = [];

// API Routes
app.get('/api/news', (req, res) => {
  res.json(newsData);
});

app.post('/api/news', (req, res) => {
  newsData = req.body.news || newsData;
  res.json({ success: true });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create contact object
    const contact = {
      id: Date.now(),
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    // Store contact locally
    contactsData.push(contact);

    // Log to console for verification
    console.log('\n✅ NEW CONTACT SUBMISSION:');
    console.log('─'.repeat(50));
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log(`Time: ${contact.timestamp}`);
    console.log('─'.repeat(50) + '\n');

    // Send to Supabase if credentials exist
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            name,
            email,
            message,
            created_at: contact.timestamp
          })
        });
        if (supabaseRes.ok) {
          console.log('📊 ✅ Stored in Supabase');
        } else {
          console.error('⚠️ Supabase response:', supabaseRes.status);
        }
      } catch (err) {
        console.error('⚠️ Supabase storage failed:', err.message);
      }
    } else {
      console.log('⚠️  Supabase credentials not configured');
    }

    // Send Telegram alert if credentials exist
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      try {
        const telegramRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `🚀 *New Lead from Nexen.AI*\n\n📝 *Name:* ${name}\n📧 *Email:* ${email}\n💬 *Message:* ${message}`,
            parse_mode: 'Markdown'
          })
        });
        if (telegramRes.ok) {
          console.log('💬 ✅ Telegram alert sent');
        } else {
          console.error('⚠️ Telegram response:', telegramRes.status);
        }
      } catch (err) {
        console.error('⚠️ Telegram alert failed:', err.message);
      }
    } else {
      console.log('⚠️  Telegram credentials not configured');
    }

    res.json({ success: true, message: 'Contact received' });
  } catch (err) {
    console.error('Error processing contact:', err);
    res.status(500).json({ error: 'Failed to process contact' });
  }
});

// Get stored contacts (for admin view)
app.get('/api/contacts', (req, res) => {
  res.json(contactsData);
});

app.get('/api/projects', (req, res) => {
  try {
    const projectsPath = path.join(__dirname, 'data', 'projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));

    // Ensure image paths are correct
    const updatedProjects = projects.map(p => ({
      ...p,
      image: p.image.replace('/public/', '/images/')
    }));

    res.json(updatedProjects);
  } catch (err) {
    console.error('Error loading projects:', err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                    🚀 NEXEN.AI LOCAL SERVER                ║
╚════════════════════════════════════════════════════════════╝

  📍 Server running at: http://localhost:${PORT}

  💻 Open in your browser: http://localhost:${PORT}

  📝 Endpoints available:
     - GET  /api/news       (Get live news feed)
     - POST /api/news       (Update news feed)
     - GET  /api/projects   (Get portfolio projects)
     - POST /api/contact    (Submit contact form)
     - GET  /api/contacts   (View all contacts)

  Press Ctrl+C to stop the server

╚════════════════════════════════════════════════════════════╝
  `);
});
