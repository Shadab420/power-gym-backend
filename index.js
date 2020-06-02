const express = require('express');
var multer = require('multer')
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectID  } = require("mongodb");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT;
const uri = process.env.DB_PATH;

//file storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
      console.log(file)
      cb(null, file.originalname)
    }
})

// var upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
//         }
//     }
// });


//image upload function cloudinary
// app.post('/upload', (req, res, next) => {
//     const upload = multer({ storage }).single('image')
//     upload(req, res, function(err) {
//       if (err) {
//         return res.send(err)
//       }
//       console.log('file uploaded to server')
//       console.log(req.file)
  
//       // SEND FILE TO CLOUDINARY
//       const cloudinary = require('cloudinary').v2
//       cloudinary.config({
//         cloud_name: process.env.CLOUD_NAME,
//         api_key: process.env.API_KEY,
//         api_secret: process.env.API_SECRET
//       })
      
//       const path = req.file.path
//       const uniqueFilename = new Date().toISOString()
  
//       cloudinary.uploader.upload(
//         path,
//         { public_id: `images/${uniqueFilename}`, tags: `image` }, // directory and tags are optional
//         function(err, image) {
//           if (err) return res.send(err)
//           console.log('file uploaded to Cloudinary')
//           // remove file from server
//           const fs = require('fs')
//           fs.unlinkSync(path)
//           // return image details
//           res.json(image)
//         }
//       )
//     })
//   })

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

    let training;

    const upload = multer({ storage }).single('image')
    upload(req, res, function(err) {
        if (err) {
          return res.send(err)
        }
        console.log('file uploaded to server')
        console.log(req.file)
    
        // SEND FILE TO CLOUDINARY
        const cloudinary = require('cloudinary').v2
        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET
        })
        
        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
    
        cloudinary.uploader.upload(
          path,
          { public_id: `images/${uniqueFilename}`, tags: `image` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            console.log('file uploaded to Cloudinary')
            // remove file from server
            const fs = require('fs')
            fs.unlinkSync(path)
            return image;
            
          }
        )
        .then(image => {
            training = {
           
                name: req.body.name,
                description: req.body.description,
                image: image.url,
                duration: req.body.duration,
                schedules: req.body.schedules
            };
    
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
      })
      
    

    // const url = req.protocol + '://' + req.get('host')
     

    
    
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

    let newClass;

    const upload = multer({ storage }).single('image')
    upload(req, res, function(err) {
        if (err) {
          return res.send(err)
        }
        console.log('file uploaded to server')
        console.log(req.file)
    
        // SEND FILE TO CLOUDINARY
        const cloudinary = require('cloudinary').v2
        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET
        })
        
        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
    
        cloudinary.uploader.upload(
          path,
          { public_id: `images/${uniqueFilename}`, tags: `image` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            console.log('file uploaded to Cloudinary')
            // remove file from server
            const fs = require('fs')
            fs.unlinkSync(path)
            return image;
            
          }
        )
        .then(image => {
            newClass = {
           
                name: req.body.name,
                description: req.body.description,
                duration: req.body.duration,
                image: image.url,
                benefits: req.body.benefits,
                schedules: req.body.schedules
            };
    
            const client = new MongoClient(uri, { useNewUrlParser: true });
    
        client.connect(err => {
            const collection = client.db(dbName).collection("classes");
    
            // perform actions on the collection object
            collection.insertOne(newClass, (err, documents) => {
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
      })

    

    
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

    let newPricing;

    const upload = multer({ storage }).single('image')
    upload(req, res, function(err) {
        if (err) {
          return res.send(err)
        }
        console.log('file uploaded to server')
        console.log(req.file)
    
        // SEND FILE TO CLOUDINARY
        const cloudinary = require('cloudinary').v2
        cloudinary.config({
          cloud_name: process.env.CLOUD_NAME,
          api_key: process.env.API_KEY,
          api_secret: process.env.API_SECRET
        })
        
        const path = req.file.path
        const uniqueFilename = new Date().toISOString()
    
        cloudinary.uploader.upload(
          path,
          { public_id: `images/${uniqueFilename}`, tags: `image` }, // directory and tags are optional
          function(err, image) {
            if (err) return res.send(err)
            console.log('file uploaded to Cloudinary')
            // remove file from server
            const fs = require('fs')
            fs.unlinkSync(path)
            return image;
            
          }
        )
        .then(image => {
            newPricing = {
           
                name: req.body.name,
                category: req.body.category,
                bill: req.body.bill,
                image: image.url,
                features: req.body.features,
            };
    
            const client = new MongoClient(uri, { useNewUrlParser: true });
    
        client.connect(err => {
            const collection = client.db(dbName).collection("pricings");
    
            // perform actions on the collection object
            collection.insertOne(newPricing, (err, documents) => {
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
      })

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
app.delete('/pricings/:id', (req, res) => {

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

 /**
 * api : Get all members
 */

app.get('/members', (req, res) => {
    const client = new MongoClient(uri, { useNewUrlParser: true });

    client.connect(err => {
        const collection = client.db(dbName).collection("members");

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



app.listen(port, () => console.log(`listening at http://localhost:${port}`))