import express from 'express';
import dotenv from 'dotenv';
import pool from './db.js';

// cookies
import cookieParser from 'cookie-parser';

// routes
import authRoutes from './routes/authRoute.js';
import adminRoutes from './routes/adminRoute.js';


dotenv.config({ path: './.env' });

console.log('Database User Check:', process.env.DB_USER);


const app = express();

app.use(cookieParser());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Server is running smoothly' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(pool.connect);
});