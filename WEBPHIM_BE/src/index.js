require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();

// 1. Middleware
app.use(cors());

app.use(express.json());

// 2. Routes
const allRoutes = require('./routes');
app.use('/api', allRoutes);

// 3. Error handler (LUÔN TRƯỚC listen cũng được, nhưng phải sau routes)
app.use((err, req, res, next) => {
    console.error("ERROR:", err);

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 4. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}/api`);
});