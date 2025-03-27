const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/api/users', require('./routes/userRoute'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
