require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvfakjl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
console.log(`db connected successfully`);

const run = async () => {
  try {
    const db = client.db("pc-component");
    const productCollection = db.collection("product");

    app.get("/products", async (req, res) => {
      const category = req.query.category;

      let cursor;
      if (category) {
        cursor = productCollection.find({ category });
      } else {
        cursor = productCollection.find({});
      }

      const products = await cursor.toArray();
      res.send({ status: true, data: products });
    });

    app.get("/product/:productId", async (req, res) => {
      const id = req.params.productId;

      const result = await productCollection.findOne({ _id: new ObjectId(id) });
      // console.log(result);
      res.send(result);
    });
  } finally {
  }
};

run().catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
