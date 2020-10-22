const express = require('express');

const connectDB = require('./config/db');
const cors = require('cors')
const app = express();

require('dotenv').config({path: __dirname + '/.env'})
// Connect to database
connectDB();

app.use(express.json());
app.use(cors());

// Define Routes
//app.use('/', require('./routes/index'));
app.use('/api/registration', require('./routes/registration'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/crud', require('./routes/crud'));
app.use('/api/income', require('./routes/income'));
app.use('/api/ledger', require('./routes/ledger'));
app.use('/api/forgotpasswordmail', require('./routes/email'));
app.use('/api/export', require('./routes/export'));
app.use('/api/statement', require('./routes/statement'));
app.use('/api/v1', require('./routes/changepassword'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));