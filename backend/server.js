const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes.js');
const jobRoutes = require('./routes/jobRoutes.js');
const connectDB = require('./config/db.js');

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // to accept JSON Data

app.use('/api/user', userRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started On Port ${PORT}`.yellow.bold));