import cors from 'cors';
import crypto from 'node:crypto';
import express from 'express';
import https from 'node:https';
import fs from 'node:fs';
import mysql from 'mysql2/promise';

const app = express();
const port = Number(process.env.PORT || 8000);

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'u746092276_turflow',
  user: process.env.DB_USER || 'u746092276_admin',
  password: process.env.DB_PASS || 'Admin@yash@123',
  waitForConnections: true,
  connectionLimit: 10
};

const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@yash@123';
const sessions = new Map();

const pool = mysql.createPool(dbConfig);

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:8000',
      'https://127.0.0.1:8000',
      'https://turflow.in',
      'http://turflow.in',
      'https://darkslategrey-crab-676999.hostingersite.com',
      'http://darkslategrey-crab-676999.hostingersite.com'
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
app.use(express.json({ limit: '25mb' }));

const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
};

const verifyPassword = (password, storedHash) => {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, hash] = storedHash.split(':');
  return hashPassword(password, salt) === `${salt}:${hash}`;
};

const requireAdmin = (req, res, next) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  req.admin = sessions.get(token);
  next();
};

const parseJsonColumn = (value, fallback = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    // Plain comma-separated string (corrupt legacy data) — convert it
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
};

const venueFromRow = (row) => ({
  id: Number(row.id),
  name: row.name,
  location: row.location,
  city: row.city || '',
  description: row.description || '',
  price: String(Number(row.price || 0)),
  rating: Number(row.rating || 0),
  sports: parseJsonColumn(row.sports),
  image: row.image || '',
  gallery: parseJsonColumn(row.gallery),
  badge: row.badge || '',
  isFeatured: Boolean(row.is_featured)
});

const bookingFromRow = (row) => ({
  id: Number(row.id),
  venueId: row.venue_id ? Number(row.venue_id) : null,
  venueName: row.venue_name,
  venueLocation: row.venue_location,
  date: row.booking_date,
  dateLabel: row.date_label,
  time: row.booking_time,
  duration: Number(row.duration || 1),
  amount: Number(row.amount || 0),
  customerName: row.customer_name,
  customerPhone: row.customer_phone,
  status: row.status,
  createdAt: row.created_at
});

const createTables = async () => {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(120) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS venues (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      location TEXT NOT NULL,
      city VARCHAR(100) NOT NULL DEFAULT '',
      description TEXT NULL,
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      rating DECIMAL(2,1) NOT NULL DEFAULT 0,
      sports JSON NULL,
      image LONGTEXT NULL,
      gallery JSON NULL,
      badge VARCHAR(40) NULL,
      is_featured TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);

  await pool.execute(`
    CREATE TABLE IF NOT EXISTS bookings (
      id BIGINT AUTO_INCREMENT PRIMARY KEY,
      venue_id INT NULL,
      venue_name VARCHAR(255) NOT NULL,
      venue_location TEXT NOT NULL,
      booking_date DATE NULL,
      date_label VARCHAR(80) NOT NULL,
      booking_time VARCHAR(40) NOT NULL,
      duration INT NOT NULL DEFAULT 1,
      amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      customer_name VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'New',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
};

const seedData = async () => {
  const [[adminCount]] = await pool.query('SELECT COUNT(*) AS count FROM admin_users');
  if (Number(adminCount.count) === 0) {
    await pool.execute(
      'INSERT INTO admin_users (username, password_hash) VALUES (?, ?)',
      [adminUsername, hashPassword(adminPassword)]
    );
  }

  const [[venueCount]] = await pool.query('SELECT COUNT(*) AS count FROM venues');
  if (Number(venueCount.count) > 0) return;

  const starterVenues = [
    [
      'Ball N Goal',
      'Gate No. 1, MI Rustle Court, Sector 6, Gomti Nagar, Lucknow',
      'Multi-sport turf with cricket, football and pickleball slots.',
      1100,
      4.8,
      ['Cricket', 'Football', 'Pickleball'],
      'https://images.unsplash.com/photo-1550881111-7cfde14b8073?auto=format&fit=crop&w=900&q=80',
      [],
      'NEW',
      1
    ],
    [
      'Elite Sports Arena',
      'A-1/26, Viram Khand 1, Gomti Nagar, Lucknow',
      'Floodlit turf for evening football and box cricket bookings.',
      1100,
      4.8,
      ['Cricket', 'Football'],
      'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=900&q=80',
      [],
      '',
      1
    ],
    [
      'Players Town',
      'S-524 Vishal Khand, Gomti Nagar, Lucknow',
      'Compact neighborhood venue with fast booking availability.',
      1100,
      4.7,
      ['Cricket', 'Football'],
      'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=80',
      [],
      'NEW',
      1
    ]
  ];

  for (const venue of starterVenues) {
    await pool.execute(
      `INSERT INTO venues
        (name, location, description, price, rating, sports, image, gallery, badge, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        venue[0],
        venue[1],
        venue[2],
        venue[3],
        venue[4],
        JSON.stringify(venue[5]),
        venue[6],
        JSON.stringify(venue[7]),
        venue[8],
        venue[9]
      ]
    );
  }
};

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: dbConfig.database });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.post('/api/setup', async (req, res) => {
  try {
    await createTables();
    // Migrate existing tables: add city column if missing
    await pool.execute(`
      ALTER TABLE venues ADD COLUMN IF NOT EXISTS city VARCHAR(100) NOT NULL DEFAULT ''
    `).catch(() => {}); // ignore if already exists or DB doesn't support IF NOT EXISTS
    await seedData();
    res.json({ success: true, message: 'Local TurFlow database is ready.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/admin-login.php', async (req, res) => {
  const { username = '', password = '' } = req.body;
  const [rows] = await pool.execute(
    'SELECT id, username, password_hash FROM admin_users WHERE username = ? LIMIT 1',
    [username]
  );
  const admin = rows[0];
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    res.status(401).json({ error: 'Invalid admin username or password' });
    return;
  }

  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, { id: admin.id, username: admin.username });
  res.json({ success: true, token, username: admin.username });
});

app.post('/api/admin-logout.php', (req, res) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (token) sessions.delete(token);
  res.json({ success: true });
});

app.get('/api/admin-session.php', (req, res) => {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  res.json({
    authenticated: Boolean(token && sessions.has(token)),
    admin: token ? sessions.get(token) || null : null
  });
});

app.get('/api/venues.php', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM venues ORDER BY id DESC');
  res.json(rows.map(venueFromRow));
});

app.post('/api/venues.php', requireAdmin, async (req, res) => {
  const venue = req.body;
  const [result] = await pool.execute(
    `INSERT INTO venues
      (name, location, city, description, price, rating, sports, image, gallery, badge, is_featured)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      venue.name || '',
      venue.location || '',
      venue.city || '',
      venue.description || '',
      Number(venue.price || 0),
      Number(venue.rating || 0),
      JSON.stringify(venue.sports || []),
      venue.image || '',
      JSON.stringify(venue.gallery || []),
      venue.badge || '',
      venue.isFeatured ? 1 : 0
    ]
  );
  const [rows] = await pool.execute('SELECT * FROM venues WHERE id = ?', [result.insertId]);
  res.json(venueFromRow(rows[0]));
});

app.patch('/api/venues.php', requireAdmin, async (req, res) => {
  const venue = req.body;
  await pool.execute(
    `UPDATE venues
      SET name = ?, location = ?, city = ?, description = ?, price = ?, rating = ?,
          sports = ?, image = ?, gallery = ?, badge = ?, is_featured = ?
      WHERE id = ?`,
    [
      venue.name || '',
      venue.location || '',
      venue.city || '',
      venue.description || '',
      Number(venue.price || 0),
      Number(venue.rating || 0),
      JSON.stringify(venue.sports || []),
      venue.image || '',
      JSON.stringify(venue.gallery || []),
      venue.badge || '',
      venue.isFeatured ? 1 : 0,
      venue.id
    ]
  );
  const [rows] = await pool.execute('SELECT * FROM venues WHERE id = ?', [venue.id]);
  res.json(venueFromRow(rows[0]));
});

app.delete('/api/venues.php', requireAdmin, async (req, res) => {
  await pool.execute('DELETE FROM venues WHERE id = ?', [req.query.id]);
  res.json({ success: true });
});

app.get('/api/bookings.php', requireAdmin, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC, id DESC');
  res.json(rows.map(bookingFromRow));
});

app.post('/api/bookings.php', async (req, res) => {
  const booking = req.body;
  const [result] = await pool.execute(
    `INSERT INTO bookings
      (venue_id, venue_name, venue_location, booking_date, date_label, booking_time,
       duration, amount, customer_name, customer_phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      booking.venueId || null,
      booking.venueName || '',
      booking.venueLocation || '',
      booking.date || null,
      booking.dateLabel || '',
      booking.time || '',
      Number(booking.duration || 1),
      Number(booking.amount || 0),
      booking.customerName || '',
      booking.customerPhone || '',
      booking.status || 'New'
    ]
  );
  const [rows] = await pool.execute('SELECT * FROM bookings WHERE id = ?', [result.insertId]);
  res.json(bookingFromRow(rows[0]));
});

app.patch('/api/bookings.php', requireAdmin, async (req, res) => {
  await pool.execute('UPDATE bookings SET status = ? WHERE id = ?', [
    req.body.status || 'New',
    req.body.id
  ]);
  res.json({ success: true });
});

app.delete('/api/bookings.php', requireAdmin, async (req, res) => {
  await pool.execute('DELETE FROM bookings WHERE id = ?', [req.query.id]);
  res.json({ success: true });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Load SSL certificates - try production paths first, fallback to self-signed
let sslOptions = null;
let useHttps = false;

// Set USE_HTTPS=false in your local .env to force HTTP for local development
if (process.env.USE_HTTPS === 'false') {
  console.log('USE_HTTPS=false — running HTTP only');
} else {

try {
  // Try production Let's Encrypt paths (Hostinger)
  const keyPath = process.env.SSL_KEY_PATH || '/etc/letsencrypt/live/turflow.in/privkey.pem';
  const certPath = process.env.SSL_CERT_PATH || '/etc/letsencrypt/live/turflow.in/fullchain.pem';

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    sslOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    useHttps = true;
  }
} catch (err) {
  console.log('Could not load production certificates:', err.message);
}

// Fallback to self-signed certificates for development
if (!sslOptions) {
  try {
    if (fs.existsSync('./key.pem') && fs.existsSync('./cert.pem')) {
      sslOptions = {
        key: fs.readFileSync('./key.pem'),
        cert: fs.readFileSync('./cert.pem')
      };
      useHttps = true;
    }
  } catch (err) {
    console.log('Could not load self-signed certificates:', err.message);
  }
}

}

if (useHttps && sslOptions) {
  https.createServer(sslOptions, app)
    .listen(port, () => {
      console.log(`TurFlow backend running at https://localhost:${port}`);
    });
} else {
  // Fallback to HTTP if no certificates available
  app.listen(port, () => {
    console.log(`TurFlow backend running at http://localhost:${port}`);
  });
}