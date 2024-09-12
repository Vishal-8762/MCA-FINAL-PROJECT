const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Parse incoming requests as JSON

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/inquiries', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Inquiry Schema
const inquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  number: { type: String, required: true },
  message: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

// Inquiry Model
const Inquiry = mongoose.model('Inquiry', inquirySchema);

// Routes
app.post('/api/inquiry', async (req, res) => {
  const { name, email, number, message } = req.body;

  if (!name || !email || !number || !message) {
    return res.status(400).json({ error: 'Please fill in all fields' });
  }

  try {
    const newInquiry = new Inquiry({
      name,
      email,
      number,
      message
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Inquiry saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
