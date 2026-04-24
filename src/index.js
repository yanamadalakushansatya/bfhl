

const express = require('express');
const cors = require('cors');
const path = require('path');

const { processRequest } = require('./processor');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: '"data" must be an array of strings.' });
  }

  try {
    const result = processRequest(data);
    return res.status(200).json(result);
  } catch (err) {
    console.error('Processing error:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BFHL server running on http://localhost:${PORT}`);
});
