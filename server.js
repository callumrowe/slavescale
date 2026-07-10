import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dbPath = path.join(__dirname, 'data', 'ratings.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS ratings (
    date TEXT PRIMARY KEY,
    stars INTEGER NOT NULL,
    sealedAt TEXT NOT NULL
  )
`);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/ratings', (req, res) => {
  const ratings = db.prepare('SELECT * FROM ratings ORDER BY date DESC').all();
  const log = {};
  ratings.forEach(r => {
    log[r.date] = { stars: r.stars, sealedAt: r.sealedAt };
  });
  res.json(log);
});

app.post('/api/ratings', (req, res) => {
  const { date, stars, sealedAt } = req.body;
  if (!date || !stars) return res.status(400).json({ error: 'Missing fields' });

  db.prepare('INSERT OR REPLACE INTO ratings (date, stars, sealedAt) VALUES (?, ?, ?)')
    .run(date, stars, sealedAt);

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
