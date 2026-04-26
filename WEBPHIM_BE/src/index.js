require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// 1. Middleware
app.use(cors());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(express.json());

// 2. Routes
const allRoutes = require('./routes');
app.use('/api', allRoutes);

// 4. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}/api`);
});