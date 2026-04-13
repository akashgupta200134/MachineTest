const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' })); // Allow React dev server
app.use(bodyParser.json());

app.use('/api/categories', require('./routes/categories'));
app.use('/api/products',   require('./routes/products'));

app.listen(5000, () => console.log('API running on http://localhost:5000'));