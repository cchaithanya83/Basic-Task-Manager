import React, { useState } from "react";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSignUp = async () => {
    if (!email || !password) {
      setError("Email and password are required.");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch(
        "https://basic-task-manager.onrender.com/api/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("User created successfully!");
        setError("");
      } else {
        setError(data.error || "Signup failed.");
        setSuccess("");
      }
    } catch (err: unknown) {
      // Assert the error to be of type Error
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message || "Signup failed."}`);
      } else {
        setError("An unexpected error occurred.");
      }
      setSuccess("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <nav className="flex justify-between items-center bg-white w-full max-w-screen-2xl p-4 shadow-md">
        <div className="text-xl font-bold">TaskMate</div>
      </nav>
      <div className="flex-grow flex items-center justify-center w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Sign Up
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
              onClick={handleSignUp}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {success && (
            <p className="text-green-500 text-center mt-4">{success}</p>
          )}
          <p className="text-center mt-4">
            Already have an account?{" "}
            <a href="/" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
