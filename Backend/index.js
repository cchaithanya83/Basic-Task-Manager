const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
const {
  getFirestore,
  Timestamp,
  FieldValue,
  Filter,
} = require("firebase-admin/firestore");
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

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// User Signup
app.post("/api/signup", async (req, res) => {
  try {
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

// User Login
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
    res.status(401).send({ error: error.message });
  }
});

// Create Task
app.post("/api/tasks", async (req, res) => {
  const { title, dueDate, description } = req.body;
  const uid = req.headers["authorization"]?.split(" ")[1];

  try {
    const newTask = {
      title: title,
      dueDate: dueDate,
      description: description,
      status: "pending",
      uid: uid,
    };
    console.log(newTask);

    const docRef = db.collection("tasks").doc();
    await docRef.set(newTask);

    res.status(201).send({ id: docRef.id, ...newTask });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Get All Tasks
app.get("/api/tasks/:uid", async (req, res) => {
  const uid = req.params.uid;
  console.log(uid);

  try {
    console.log(db.collection("tasks").get());
    const tasksSnapshot = await db
      .collection("tasks")
      .where("uid", "==", uid)
      .get();
    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).send(tasks);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Update Task
app.post("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, dueDate, description } = req.body;
  const uid = req.headers["authorization"]?.split(" ")[1];

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists || taskDoc.data().uid !== uid) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await taskRef.update({ title, dueDate, description });
    console.log("ttts");

    const updatedTask = (await taskRef.get()).data();
    res.status(200).send({ id: taskId, ...updatedTask });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Delete Task
app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const uid = req.headers["authorization"]?.split(" ")[1];

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists || taskDoc.data().uid !== uid) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await taskRef.delete();
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
