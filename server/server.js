const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT
const app = express();


app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', require('./routes/userRoute'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
