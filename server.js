import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import parameterRoutes from './routes/parameters.js';


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