const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');

const app = express();

const port = process.env.PORT

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://wearmade.vercel.app',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', require('./routes/userRoute'));
app.use('/api/posts', require('./routes/postRoute'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
