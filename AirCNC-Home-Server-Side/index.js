require('dotenv').config();
const express = require('express');
const cors = require('cors');
// // jwt
const jwt = require('jsonwebtoken');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2a9l2qr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


// jwt verify start 
const verifyJwt = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' })
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ error: true, message: 'unauthorized access' })
    }
    req.decoded = decoded;
    next();
  })
}
// jwt verify end


async function run() {
  try {

    // server link start
    const usersCollection = client.db('AirCNC-Home').collection('users');
    const roomsCollection = client.db('AirCNC-Home').collection('rooms');
    const bookingsCollection = client.db('AirCNC-Home').collection('bookings');
    // server link end 

    // jwt localhost start
    app.post('/jwt', (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d'
      });
      res.send({ token });
    })
    // jwt localhost end

    // Warning: use verifyJWT before using verifyAdmin
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email }
      const user = await usersCollection.findOne(query);
      if (user?.role !== 'admin') {
        return res.status(403).send({ error: true, message: 'forbidden message' });
      }
      next();
    }

    // add a room mongoDB start
    app.post('/rooms', async (req, res) => {
      const newAdd = req.body;
      const result = await roomsCollection.insertOne(newAdd)
      res.send(result);
    });
    // add a room mongoDB end

    // get all rooms data start
    app.get('/rooms', async (req, res) => {
      const result = await roomsCollection.find().toArray();
      res.send(result);
    })
    //  get all rooms data end 

    // get a single room data start
    app.get('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollection.findOne(query);
      res.send(result);
    })
    //  get a single room data end 

    // post data search part start
    app.get("/roomsSearchText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await roomsCollection
        .find({
          $or: [
            { displayName: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });
    // post data search part exit 

    // server data update start
    app.put('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatePost = req.body;
      const addPost = {
        $set: {
          Bio: updatePost.Bio,
          fileImg: updatePost.fileImg,
        }
      }
      const result = await roomsCollection.updateOne(filter, addPost, options);
      res.send(result)
    })
    // server data update end 

    // selected data delete mongoDB start
    app.delete('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await roomsCollection.deleteOne(query);
      res.send(result);
    })
    // selected data delete mongoDB  exit

    //  allPost data patch start 
    app.patch('/rooms/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedClasses = req.body;
      const updateDoc = {
        $set: {
          status: updatedClasses.status
        }
      }
      const result = await roomsCollection.updateOne(filter, updateDoc)
      res.send(result)
    })
    //  allPost data patch end

    //  update booking patch start 
    app.patch('/rooms/status/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const status = req.body.status;
      const updateDoc = {
        $set: {
          booked: status,
        }
      }
      const result = await roomsCollection.updateOne(query, updateDoc)
      res.send(result)
    })
    //  update booking patch end

    // user data post dataBD start 
    app.post('/users', async (req, res) => {
      const user = req.body;
      // google sign up part start
      const query = { email: user.email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists' })
      }
      // google sign up part end
      else {
        const result = await usersCollection.insertOne(user)
        res.send(result);
      }
    });
    // user data post dataBD exit

    // server data update start
    app.put('/users/:email', async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email }
      const options = { upsert: true };
      const upDataDoc = {
        $set: user,
      }
      const result = await usersCollection.updateOne(query, upDataDoc, options);
      res.send(result)
    })
    // server data update end 

    // all user information get  start
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // all user information get end

    // one role check start
    app.get('/users/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const result = await usersCollection.findOne(query);
      res.send(result);
    })
    // user role check end

    // allUser data search part start
    app.get("/userSearchText/:text", async (req, res) => {
      const text = req.params.text;
      const result = await usersCollection
        .find({
          $or: [
            { name: { $regex: text, $options: "i" } },
            { email: { $regex: text, $options: "i" } },
          ],
        })
        .toArray();
      res.send(result);
    });
    // allUser data search part exit 

    // user data delete mongoDB start
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })
    // user data delete mongoDB  exit

    // get my bookings data server start
    app.get('/bookings', async (req, res) => {
      const email = req.query?.email
      if (!email) {
        res.send([])
      }
      const query = { 'guest.email': email }
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    })
    //  get my bookings data server end 

    // save a booking mongoDB start
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result = await bookingsCollection.insertOne(booking)
      res.send(result);
    });
    // add a booking mongoDB end

    //delete a booking mongoDB start
    app.delete('/bookings/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    })
    //delete a booking mongoDB end

    // user data delete mongoDB start
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    })
    // user data delete mongoDB  exit

    // user admin role added start
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    })
    // user admin role added exit


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('AirCNC-Home running')
})

app.listen(port, () => {
  console.log(`server is running on port: ${port}`);
})

