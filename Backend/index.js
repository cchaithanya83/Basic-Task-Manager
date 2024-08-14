const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const firebase = require("firebase/app");

const firebaseauth = require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyDX5stClUDXjcMYavHDf2Yl0xu8UancXjc",
  authDomain: "basic-task-manager-b65b3.firebaseapp.com",
  projectId: "basic-task-manager-b65b3",
  storageBucket: "basic-task-manager-b65b3.appspot.com",
  messagingSenderId: "73242926",
  appId: "1:73242926:web:5d86331c5a29aa90f782bf",
  measurementId: "G-ZT0W4J0BYY",
};
const serviceAccount = require("./auth/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const firebaseapp = firebase.initializeApp(firebaseConfig);
const firebaseau = firebaseauth.initializeAuth(firebaseapp);
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/signup", async (req, res) => {
  try {
    console.log(req.body);
    const userRecord = await admin.auth().createUser({
      email: req.body.email,
      password: req.body.password,
      emailVerified: false,
      disabled: false,
    });
    res.status(200).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  const { idToken } = req.body;

  try {
    if (idToken) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const uid = decodedToken.uid;

      res.status(200).send({ uid: uid });
    } else {
      res.status(401).send({ error: "Unable to get ID token" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).send({ error: error.message });
  }
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
