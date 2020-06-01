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


const dbName = "powerxGym";

//Training apis

/**
 * api : Add a training
 */
app.post('/addTraining', (req, res) => {

    const training = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("trainings");

        // perform actions on the collection object
        collection.insertOne(training, (err, documents) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               res.status(200).send(documents.ops[0]);
           } 
            
        })
        client.close();
    });
})

app.listen(port, () => console.log(`listening at http://localhost:${port}`))