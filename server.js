const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const parameterRoutes = require('./routes/parameters');

dotenv.config();

const app = express();             // יוצרת מופע של שרת אקספרס
app.use(cors());                  // מאפשר לתקשורת להגיע ממקורות חיצוניים 
app.use(express.json());         // מאפשר לשרת להבין בקשות שמגיעות בפורמט JSON


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch((err) =>console.error('MongoDB connection error:', err));

app.use('/api/parameters', parameterRoutes);

// הפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});