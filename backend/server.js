const express    = require('express');
const cors       = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/categories', require('./routes/categories'));
app.use('/api/products',   require('./routes/products'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = 5000;

app.listen(PORT, () => {

  console.log(`Backend running at http://localhost:${PORT}`);

});