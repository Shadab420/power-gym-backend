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
 * api : Get all trainings
 */

 app.get('/trainings', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("trainings");

        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               res.status(200).send(documents);
           } 
            
        })
        client.close();
    });
 })


 /**
 * api : Get a training by id
 */

app.get('/trainings/:id', (req, res) => {

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("trainings");

        // perform actions on the collection object
        collection.findOne({ _id: new ObjectID(req.params.id) }, (err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({message: err.message});
            }
            else{
                res.status(200).send(documents);
            } 
             
         })
        client.close();
    });
 })

/**
 * api : Add a training
 */
app.post('/trainings', (req, res) => {

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

/**
 * api : update a training
 */
app.put('/trainings/:id', (req, res) => {

    const updatedTraining = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("trainings");

        // perform actions on the collection object
        collection.findOneAndUpdate(
            { _id: new ObjectID(req.params.id)}, {$set: {...updatedTraining}}, {
            returnOriginal: false, 
            upsert: true
        },
            
            (err, documents) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({message: err.message});
                }
                else{
                    res.status(200).send(documents.value);
                } 
            
        })
        client.close();
    });
  })


/**
 * api : Delete a training
 */
app.delete('/trainings/:id', (req, res) => {

    const updatedTraining = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("trainings");

        // perform actions on the collection object
        
        try {
            collection.deleteOne( { _id: new ObjectID(req.params.id) } );
            res.status(200).send("Deleted!");
         } catch (e) {
            res.status(500).send({message: err.message});
         }
        client.close();
    });
  })



//class apis

/**
 * api : Get all classes
 */

 app.get('/classes', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("classes");

        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               res.status(200).send(documents);
           } 
            
        })
        client.close();
    });
 })


 /**
 * api : Get a class by id
 */

app.get('/classes/:id', (req, res) => {

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("classes");

        // perform actions on the collection object
        collection.findOne({ _id: new ObjectID(req.params.id) }, (err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({message: err.message});
            }
            else{
                res.status(200).send(documents);
            } 
             
         })
        client.close();
    });
 })

/**
 * api : Add a class
 */
app.post('/classes', (req, res) => {

    const training = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("classes");

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

/**
 * api : update a class
 */
app.put('/classes/:id', (req, res) => {

    const updatedTraining = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("classes");

        // perform actions on the collection object
        collection.findOneAndUpdate(
            { _id: new ObjectID(req.params.id)}, {$set: {...updatedTraining}}, {
            returnOriginal: false, 
            upsert: true
        },
            
            (err, documents) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({message: err.message});
                }
                else{
                    res.status(200).send(documents.value);
                } 
            
        })
        client.close();
    });
  })


/**
 * api : Delete a class
 */
app.delete('/classes/:id', (req, res) => {

    const updatedTraining = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("classes");

        // perform actions on the collection object
        
        try {
            collection.deleteOne( { _id: new ObjectID(req.params.id) } );
            res.status(200).send("Deleted!");
         } catch (e) {
            res.status(500).send({message: err.message});
         }
        client.close();
    });
  })


//Pricing plan apis

/**
 * api : Get all pricing plan
 */

app.get('/pricings', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("pricings");

        // perform actions on the collection object
        collection.find().toArray((err, documents) => {
           if(err) {
               console.log(err);
               res.status(500).send({message: err.message});
           }
           else{
               res.status(200).send(documents);
           } 
            
        })
        client.close();
    });
 })


 /**
 * api : Get a pricing by id
 */

app.get('/pricings/:id', (req, res) => {

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("pricings");

        // perform actions on the collection object
        collection.findOne({ _id: new ObjectID(req.params.id) }, (err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({message: err.message});
            }
            else{
                res.status(200).send(documents);
            } 
             
         })
        client.close();
    });
 })

/**
 * api : Add a pricing
 */
app.post('/pricings', (req, res) => {

    const training = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("pricings");

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

/**
 * api : update a pricing
 */
app.put('/pricings/:id', (req, res) => {

    const updatedTraining = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("pricings");

        // perform actions on the collection object
        collection.findOneAndUpdate(
            { _id: new ObjectID(req.params.id)}, {$set: {...updatedTraining}}, {
            returnOriginal: false, 
            upsert: true
        },
            
            (err, documents) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({message: err.message});
                }
                else{
                    res.status(200).send(documents.value);
                } 
            
        })
        client.close();
    });
  })


/**
 * api : Delete a pricing
 */
app.delete('/classes/:id', (req, res) => {

    const updatedTraining = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("pricings");

        // perform actions on the collection object
        
        try {
            collection.deleteOne( { _id: new ObjectID(req.params.id) } );
            res.status(200).send("Deleted!");
         } catch (e) {
            res.status(500).send({message: err.message});
         }
        client.close();
    });
  })


  //Membership apis

/**
 * api : Add a member
 */
app.post('/members', (req, res) => {

    const member = req.body;

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("members");

        // perform actions on the collection object
        collection.insertOne(member, (err, documents) => {
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

/**
 * api : update a member info
 */
app.put('/members/:id', (req, res) => {

    const updatedMember = req.body
    
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("members");

        // perform actions on the collection object
        collection.findOneAndUpdate(
            { _id: new ObjectID(req.params.id)}, {$set: {...updatedMember}}, {
            returnOriginal: false, 
            upsert: true
        },
            
            (err, documents) => {
                if(err) {
                    console.log(err);
                    res.status(500).send({message: err.message});
                }
                else{
                    res.status(200).send(documents.value);
                } 
            
        })
        client.close();
    });
  })

  /**
 * api : Get a member by id
 */

app.get('/members/:id', (req, res) => {

    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("members");

        // perform actions on the collection object
        collection.findOne({ _id: new ObjectID(req.params.id) }, (err, documents) => {
            if(err) {
                console.log(err);
                res.status(500).send({message: err.message});
            }
            else{
                res.status(200).send(documents);
            } 
             
         })
        client.close();
    });
 })


app.listen(port, () => console.log(`listening at http://localhost:${port}`))