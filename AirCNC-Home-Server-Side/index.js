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

    // allPost added post mongoDB start
    app.post('/rooms', async (req, res) => {
      const newAdd = req.body;
      const result = await roomsCollection.insertOne(newAdd)
      res.send(result);
    });
    // allPost added post mongoDB end

    // get allPost data server start
    app.get('/rooms', async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await roomsCollection.find(query).toArray();
      res.send(result);
    })
    //  get allPost data server end 

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

    // admin user information get  start
    app.get('/users', async (req, res) => {
      const cursor = usersCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    // admin user information get end

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

    // user admin check start
    app.get('/users/admin/:email', verifyJwt, async (req, res) => {
      const email = req.params.email;

      if (req.decoded.email !== email) {
        res.send({ admin: false })
      }

      // jwt verifyJwt start
      const decodedEmail = req.decoded.email;
      if (email !== decodedEmail) {
        return res.status(403).send({ error: true, message: 'forbidden access' })
      }
      // jwt verifyJwt end

      const query = { email: email }
      const user = await usersCollection.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result);
    })
    // user admin check end

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

