const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfpdn.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 5000;

//root get the

app.get("/", (req, res) => {
  res.send("Db Working ....");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const charitry = client.db("volunterr").collection("items");

  //data posted || addData codes start

  app.post("/addItem", (req, res) => {
    const newItem = req.body;
    charitry.insertOne(newItem).then((result) => {
      res.send(result.insertedCount > 0);
    });
    console.log(newItem);
  });
  //Data posted code End

  //data read code start

  app.get("/items", (req, res) => {
    charitry.find({ email: req.query.email }).toArray((err, document) => {
      res.send(document);
    });
  });

  //reding code end
});

app.listen(process.env.PORT || port);
