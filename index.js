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
  const charitry = client.db("mamarede").collection("products");
  const volunterrUser = client.db("mamarede").collection("users");

  //data posted || addData codes start

  app.post("/addItem", (req, res) => {
    const newItem = req.body;
    volunterrUser.insertOne(newItem).then((result) => {
      res.redirect("/event");
    });
    console.log(newItem);
  });
  //Data posted code End

  //data  dedicated user  read code start

  app.get("/orderItem", (req, res) => {
    volunterrUser.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //data  dedicated user  read code end

  //admin user loded code ||red code
  app.get("/allUser", (req, res) => {
    volunterrUser.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //admin reding code end

  //product loded All read code

  app.get("/items", (req, res) => {
    charitry.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //delet codes
  app.delete("/delete/:id", (req, res) => {
    volunterrUser.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  //Delet code End
});

app.listen(process.env.PORT || port);
