const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//  MongoDB uri
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.mx4iiz8.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// mongoBd route set Function
async function run() {
  try {
    await client.connect;

    const sectorsCollection = client.db("test").collection("sectors-option");
    const usersCollection = client.db("test").collection("user-data");
    console.log("mongo connect");

    app.get("/sectors", async (req, res) => {
      const query = {};
      const cursor = await sectorsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/create-user-data", async (req, res) => {
      const items = req.body;
      const result = await usersCollection.insertOne(items);
      res.send(result);
    });

    app.get("/user-data", async (req, res) => {
      const query = {};
      const cursor = await usersCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/get-user/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await usersCollection.findOne(query);

      res.send(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World! code challenge Server is Running successfully");
});

app.listen(port, () => {
  console.log(`code challenge Server is Running On Port: ${port}`);
});
