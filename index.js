const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectID  } = require("mongodb");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;
const uri = process.env.DB_PATH;

//connection to mongo atlas
const client = new MongoClient(uri, { useNewUrlParser: true });

//welcome api
app.get('/', (req, res) => res.send('Welcome to  Power X Gym Backend!'))


app.listen(port, () => console.log(`listening at http://localhost:${port}`))