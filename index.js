const functions = require("firebase-functions");

const admin = require('firebase-admin');

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const express = require('express');
const cors = require('cors');
const { response } = require("express");
const app = express();
app.use(cors({origin: true}));
const db = admin.firestore();


app.get("/",(req, res)=>{ 
    return res.status(200).send("Welcome to my finalapp")

});
// post...create user
app.post("/api/users", (req, res) => {
    (async () => {
      try {
        await db.collection("userdetails").doc(`/${Date.now()}/`).create({
          id: Date.now(),
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });

        return res.status(200).send({ status: "Success", msg: "Data Saved" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "Failed", msg: error });
    }
  })();
});

//get...list all users
app.get("/api/users", (req, res) => {
    (async () => {
      try {
        let query = db.collection("userdetails");
        let response = [];
  
        await query.get().then((data) => {
          let docs = data.docs; 
  
          docs.map((doc) => {
            const selectedData = {
              name: doc.data().name,
              email: doc.data().email,
              password: doc.data().password,
            };
  
            response.push(selectedData);
          });
          return response;
        });
  
        return res.status(200).send({ status: "Success", data: response });
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Failed", msg: error });
      }
    })();
  });
//get...fetch a user
app.get("/api/users/:userid", (req, res) => {
    (async () => {
      try {
        const reqDoc = db.collection("userdetails").doc(req.params.id);
        let userDetail = await reqDoc.get();
        let response = userDetail.data();
  
        return res.status(200).send({ status: "Success", data: response });
      } catch (error) {
        console.log(error);
        res.status(500).send({ status: "Failed", msg: error });
      }
    })();
  });








//put...update a user
//delete...delete a user
//post...user sign in 
exports.app = functions.https.onRequest(app);