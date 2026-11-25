const express = require("express");
const app = express();
const cors = require('cors');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const locationRoutes = require('./routes/locationRoutes');

app.use(cors({
    origin: [
        'http://localhost:4000',
        'http://localhost:4200',
        'http://127.0.0.1:4200',
        'https://rojgaar-one.vercel.app'
    ],
    credentials: true
}));

// this line is used to parse incoming JSON requests and make the data available in req.body
app.use(express.json());

// app.get('/', (req, res) => {
//     res.send('backend is running...');
// });
app.use('/', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/locations', locationRoutes);

module.exports = app;