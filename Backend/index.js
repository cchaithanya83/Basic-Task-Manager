const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");
require("dotenv").config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// User Signup
app.post("/api/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      emailVerified: false,
      disabled: false,
    });
    res.status(200).send({ uid: userRecord.uid });
  } catch (error) {
    res.status(400).send({ error: "Signup failed: " + error.message });
  }
});

// User Login
app.post("/api/login", async (req, res) => {
  const { idToken } = req.body;

  try {
    if (idToken) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      res.status(200).send({ uid: decodedToken.uid });
    } else {
      res.status(401).send({ error: "ID token is missing" });
    }
  } catch (error) {
    res.status(401).send({ error: "Invalid ID token: " + error.message });
  }
});

// Create Task
app.post("/api/tasks", async (req, res) => {
  const { title, dueDate, description } = req.body;
  const uid = req.headers["authorization"]?.split(" ")[1];

  if (!uid) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const newTask = {
      title,
      dueDate,
      description,
      status: "pending",
      uid,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const docRef = db.collection("tasks").doc();
    await docRef.set(newTask);

    res.status(201).send({ id: docRef.id, ...newTask });
  } catch (error) {
    res.status(400).send({ error: "Failed to create task: " + error.message });
  }
});

// Get All Tasks
app.get("/api/tasks/:uid", async (req, res) => {
  const uid = req.params.uid;

  try {
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
    res.status(400).send({ error: "Failed to fetch tasks: " + error.message });
  }
});

// Update Task
app.post("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const { title, dueDate, description } = req.body;
  const uid = req.headers["authorization"]?.split(" ")[1];

  if (!uid) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists || taskDoc.data().uid !== uid) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await taskRef.update({ title, dueDate, description });
    const updatedTask = (await taskRef.get()).data();

    res.status(200).send({ id: taskId, ...updatedTask });
  } catch (error) {
    res.status(400).send({ error: "Failed to update task: " + error.message });
  }
});

// Delete Task
app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;
  const uid = req.headers["authorization"]?.split(" ")[1];

  if (!uid) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists || taskDoc.data().uid !== uid) {
      return res.status(403).send({ error: "Forbidden" });
    }

    await taskRef.delete();
    res.status(200).send({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).send({ error: "Failed to delete task: " + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
