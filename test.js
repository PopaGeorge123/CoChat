const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Define a sample API endpoint
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
