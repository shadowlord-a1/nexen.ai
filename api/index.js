const express = require('express');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const app = express();

// Middleware
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/public', express.static(path.join(__dirname, '../public')));

// In-memory storage
let newsData = [
  { emoji: '🤖', headline: 'Claude 3.5 Releases New Vision Capabilities' },
  { emoji: '🚀', headline: 'AI Agents Automate Enterprise Workflows' },
  { emoji: '💡', headline: 'LLM Fine-Tuning Breakthrough in Production' },
  { emoji: '🔗', headline: 'Multi-Agent Systems Show Promise in Testing' },
  { emoji: '📊', headline: 'Automation Drives 40% Efficiency Gains' }
];

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

    const contact = {
      id: Date.now(),
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    };

    contactsData.push(contact);

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
          body: JSON.stringify({ name, email, message, created_at: contact.timestamp })
        });
        if (supabaseRes.ok) {
          console.log('📊 ✅ Stored in Supabase');
        } else {
          console.error('⚠️ Supabase response:', supabaseRes.status);
        }
      } catch (err) {
        console.error('⚠️ Supabase storage failed:', err.message);
      }
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
        }
      } catch (err) {
        console.error('⚠️ Telegram alert failed:', err.message);
      }
    }

    res.json({ success: true, message: 'Contact received' });
  } catch (err) {
    console.error('Error processing contact:', err);
    res.status(500).json({ error: 'Failed to process contact' });
  }
});

app.get('/api/contacts', (req, res) => {
  res.json(contactsData);
});

app.get('/api/projects', (req, res) => {
  try {
    const projectsPath = path.join(__dirname, '../data/projects.json');
    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    res.json(projects);
  } catch (err) {
    console.error('Error loading projects:', err);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;
