import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true); // Show the spinner

    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      const idToken = await userCredential.user?.getIdToken();

      if (idToken) {
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
          navigate("/dashboard");
        } else {
          setError(data.error || "Invalid credentials.");
        }
      }
    } catch (error) {
      setError(
        error.code === "auth/user-not-found"
          ? "User does not exist."
          : error.code === "auth/wrong-password"
          ? "Password invalid."
          : "Invalid input."
      );
    } finally {
      setLoading(false); // Hide the spinner
    }
  };

  return (
    <div className="items-center justify-center bg-gray-100">
      <nav className="flex justify-between items-center bg-white p-4 shadow-md">
        <div className="text-xl font-bold">TaskMate</div>
      </nav>
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 justify-center rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Login
          </h2>
          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Loading..." : "Login"} {/* Show loading text */}
            </button>
          </div>
          {loading && (
            <div className="text-center mt-4">
              <div
                className="spinner-border animate-spin inline-block w-6 h-6 border-4 rounded-full border-blue-500"
                role="status"
              ></div>
            </div>
          )}
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
