const mongoose = require('mongoose');

require('dotenv').config();

//Create connection

const connection = () => {
     mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
          .then(() => console.log('Connected to MongoDB sucessfully!!'))
          .catch(err => console.error('Error connecting to MongoDB:', err));
};

module.exports = connection;
