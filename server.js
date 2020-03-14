const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require('colors');
require('dotenv').config();

const app = express();

// connect to DB
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB connected'.blue.bold.underline))
  .catch(err => {
    console.log('MongoDB connection error: '.red.bold, err);
  });

// import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// app middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());

// app.use(cors()); //allows all origins
if (process.env.NODE_ENV === 'development') {
  app.use(cors({ origin: `http://localhost:3000` })); //<-- make sure the frontend (REACT) is running on PORT 3000
}

// middleware
app.use('/api', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API is running on PORT ${PORT} - ${process.env.NODE_ENV}`);
});
