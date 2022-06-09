const express = require('express');
const mongoose = require('mongoose');
const { routes } = require('./routes');

const { PORT = 3000 } = process.env;

const app = express();

app.use((req, res, next) => {
  req.user = {
    _id: '62a10fde5c81dbcde46afd82',
  };

  next();
});

app.use(express.json());
app.use(routes);

async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb', {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    app.listen(PORT);
  } catch (err) {
    console.error(err);
  }
}

main();
