import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { ToolUsageDB } from './mcp/database/toolUsageDB.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 8000;

// Serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// API endpoint to get tool usage statistics
app.get('/api/tool-stats', async (req, res) => {
  try {
    const stats = await ToolUsageDB.getToolUsageStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get tool usage history
app.get('/api/tool-history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const history = await ToolUsageDB.getToolUsageHistory(limit);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Web server running at http://localhost:${PORT}`);
  console.log('View tool usage statistics and history in your browser!');
});