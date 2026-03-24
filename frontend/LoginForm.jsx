import React, { useState } from "react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Example validation logic
    if (username === "admin" && password === "1234") {
      alert("Login successful!");
    } else {
      alert("Invalid credentials.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #6a11cb, #2575fc)",
    },
    formBox: {
      background: "#fff",
      padding: "2rem",
      borderRadius: "10px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      width: "300px",
    },
    heading: {
      textAlign: "center",
      marginBottom: "1.5rem",
      color: "#333",
    },
    input: {
      width: "100%",
      padding: "0.8rem",
      margin: "0.5rem 0",
      border: "1px solid #ccc",
      borderRadius: "5px",
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "0.8rem",
      background: "#2575fc",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
      marginTop: "1rem",
    },
    link: {
      textAlign: "center",
      marginTop: "1rem",
    },
    linkAnchor: {
      color: "#2575fc",
      textDecoration: "none",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.heading}>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
        <div style={styles.link}>
          <a href="#" style={styles.linkAnchor}>
            Forgot Password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;