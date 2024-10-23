const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API endpoint example (if you have API routes)
app.get('/api/cards', (req, res) => {
  res.json([
    { id: 1, name: 'Pikachu', type: 'Electric' },
    { id: 2, name: 'Charizard', type: 'Fire' },
    { id: 3, name: 'Bulbasaur', type: 'Grass' },
  ]);
});

// Serve React app for any unknown paths
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




