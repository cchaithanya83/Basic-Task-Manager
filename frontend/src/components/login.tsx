import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDX5stClUDXjcMYavHDf2Yl0xu8UancXjc",
  authDomain: "basic-task-manager-b65b3.firebaseapp.com",
  projectId: "basic-task-manager-b65b3",
  storageBucket: "basic-task-manager-b65b3.appspot.com",
  messagingSenderId: "73242926",
  appId: "1:73242926:web:5d86331c5a29aa90f782bf",
  measurementId: "G-ZT0W4J0BYY",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const idToken = await userCredential.user?.getIdToken();

      if (idToken) {
        // Send ID token to backend to get UID
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        });

        const data = await response.json();
        if (response.ok) {
          sessionStorage.setItem("uid", data.uid);
          navigate("/dashboard"); // Redirect to dashboard
        } else {
          setError(data.error || "Login failed");
        }
      }
    } catch (error) {
      setError("Login error: " + error.message);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {error && <p>{error}</p>}
      <p>
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
};

export default Login;
