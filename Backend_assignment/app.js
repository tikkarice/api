const express = require('express');
const bodyParser = require('body-parser');


const dbConnection = require('./util/dbConnection');
const router = require('./routes/route');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static'));

const routeFn = async () => {
  await dbConnection.connectToDb();
  app.use(router);
}



app.listen(3030, () => {
  console.log(`Server running at 3030`);
  routeFn();
});
