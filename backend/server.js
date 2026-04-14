const express    = require('express');
const cors       = require('cors');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/categories', require('./routes/categories'));
app.use('/api/products',   require('./routes/products'));

// Health check — test this in browser: http://localhost:5000/api/health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running!' });
});

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`\n Backend running at http://localhost:${PORT}`);
  console.log(`   Test: http://localhost:${PORT}/api/health\n`);
});